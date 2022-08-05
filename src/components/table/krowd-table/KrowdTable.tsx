import React from 'react';
import { useState } from 'react';
import {
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  CircularProgress
} from '@mui/material';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Scrollbar from 'components/Scrollbar';
import { PATH_DASHBOARD } from 'routes/paths';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import KrowdTableMoreMenu from '../components/KrowdTableMoreMenu';
import KrowdTableListHead from '../components/KrowdTableListHead';

export enum DATA_TYPE {
  TEXT = 'text',
  IMAGE = 'image',
  LIST_TEXT = 'list_text'
}
export type RowData = {
  id: string;
  items: { name: string; value: any; type: DATA_TYPE }[];
};
export type KrowdTableProps = {
  headingTitle: string;
  createNewRecordButton: { pathTo: string; label: string } | null;
  header: { id: string; label: string; align: string }[];
  getData: () => Array<RowData>;
  viewPath: string;
  deleteRecord: (id: string) => void;
  isLoading: boolean;
};

export function KrowdTable({
  headingTitle,
  createNewRecordButton,
  header,
  getData,
  viewPath,
  deleteRecord,
  isLoading
}: KrowdTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [page, setPage] = useState(0);
  const data = getData();

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const dataInPage: RowData[] =
    data && data.length > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

  return (
    <>
      <HeaderBreadcrumbs
        heading={headingTitle}
        links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Danh sách' }]}
        action={
          createNewRecordButton && (
            <Button
              variant="contained"
              component={RouterLink}
              to={createNewRecordButton.pathTo}
              startIcon={<Icon icon={plusFill} />}
            >
              {createNewRecordButton.label}
            </Button>
          )
        }
      />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <KrowdTableListHead
              headLabel={[
                { id: '__borderHeaderLeft', label: '', align: 'center' },
                ...header,
                { id: '__borderHeaderRight', label: '', align: 'center' }
              ]}
            />
            <TableBody>
              {!isLoading &&
                dataInPage.length > 0 &&
                dataInPage.map((data, index) => {
                  return (
                    <TableRow hover key={`__${data.id}`} tabIndex={-1} role="checkbox">
                      <TableCell
                        key={'__borderRowLeft'}
                        component="th"
                        scope="row"
                        padding="normal"
                        align="justify"
                        sx={{ bgcolor: '#ffffff' }}
                      ></TableCell>
                      {data.items.map((_item) => {
                        switch (_item.type) {
                          case DATA_TYPE.TEXT:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="subtitle2" noWrap>
                                    {_item.value}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );
                          case DATA_TYPE.IMAGE:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar alt={`__${_item.name}__${data.id}`} src={_item.value} />
                                </Stack>
                              </TableCell>
                            );
                          case DATA_TYPE.LIST_TEXT:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="subtitle2" noWrap>
                                    {[..._item.value].map((_o) => _o)}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );
                        }
                      })}
                      <TableCell align="left">
                        <KrowdTableMoreMenu
                          viewPath={viewPath + `/${data.id}`}
                          onDelete={() => deleteRecord(data.id)}
                        />
                      </TableCell>
                      <TableCell
                        key={'__borderRowRight'}
                        component="th"
                        scope="row"
                        padding="normal"
                        align="justify"
                        sx={{ bgcolor: '#ffffff' }}
                      ></TableCell>
                    </TableRow>
                  );
                })}
              ;
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell
                    key={'__borderRowLeft'}
                    component="th"
                    scope="row"
                    padding="normal"
                    align="justify"
                    sx={{ bgcolor: '#ffffff' }}
                  ></TableCell>
                  <TableCell colSpan={6} />
                  <TableCell
                    key={'__borderRowRight'}
                    component="th"
                    scope="row"
                    padding="normal"
                    align="justify"
                    sx={{ bgcolor: '#ffffff' }}
                  ></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {isLoading && (
          <Box>
            <CircularProgress
              size={100}
              sx={{ margin: '0px auto', padding: '1rem', display: 'flex' }}
            />
            <Typography variant="h5" sx={{ textAlign: 'center', padding: '1rem' }}>
              Đang tải dữ liệu, vui lòng đợi giây lát...
            </Typography>
          </Box>
        )}
        {!isLoading && dataInPage.length === 0 && (
          <Box>
            <img
              src="https://minimals.cc/assets/illustrations/illustration_empty_content.svg"
              style={{ margin: '0px auto', padding: '1rem' }}
            />
            <Typography variant="h5" sx={{ textAlign: 'center', padding: '1rem' }}>
              Không có bất kỳ tiêu đề nào có sẵn để hiển thị
            </Typography>
          </Box>
        )}
      </Scrollbar>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, page) => setPage(page)}
        onRowsPerPageChange={(e) => handleChangeRowsPerPage}
      />
    </>
  );
}