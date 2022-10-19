import closeFill from '@iconify/icons-eva/close-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
import { MIconButton } from 'components/@material-extend';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { deleteProjectListById, getAllProject } from 'redux/slices/krowd_slices/project';
import { dispatch, RootState, useSelector } from 'redux/store';
import { PATH_DASHBOARD } from 'routes/paths';
import { DATA_TYPE, KrowdTable, RowData } from '../krowd-table/KrowdTable';
const STATUS = 'WAITING_FOR_APPROVAL';

const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'name', label: 'TÊN DỰ ÁN', align: 'left' },
  { id: 'createDate', label: 'NGÀY TẠO', align: 'left' },
  { id: 'status', label: 'TRẠNG THÁI', align: 'left' },
  { id: '', label: 'THAO TÁC', align: 'center' }
];

export default function WaitingProjectTable() {
  const { projectLists, isLoading } = useSelector((state: RootState) => state.project);
  const { listOfProject: list } = projectLists;
  const { status = 'WAITING_FOR_APPROVAL' } = useParams();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useEffect(() => {
    dispatch(getAllProject(status));
  }, [dispatch]);

  const handleDeleteProjectById = (businessId: string) => {
    dispatch(deleteProjectListById(businessId));
    enqueueSnackbar('Cập nhật trạng thái thành công', {
      variant: 'success',
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });
  };

  const getData = (): RowData[] => {
    if (!list) return [];
    return list
      .filter((_item) => _item.status === STATUS)
      .map<RowData>((_item, _idx) => {
        return {
          id: _item.id,
          items: [
            {
              name: 'idx',
              value: _idx + 1,
              type: DATA_TYPE.NUMBER
            },
            {
              name: 'id',
              value: _item.id,
              type: DATA_TYPE.TEXT
            },
            {
              name: 'name',
              value: _item.name,
              type: DATA_TYPE.TEXT
            },
            // {
            //   name: 'manager',
            //   value: `${_item.manager.firstName} ${_item.manager.lastName}`,
            //   type: DATA_TYPE.TEXT
            // },

            {
              name: 'createDate',
              value: _item.createDate,
              type: DATA_TYPE.TEXT
            },
            {
              name: 'status',
              value: _item.status,
              type: DATA_TYPE.TEXT
            }
          ]
        };
      });
  };

  return (
    <KrowdTable
      headingTitle="dự án đang chờ duyệt"
      header={TABLE_HEAD}
      getData={getData}
      isLoading={isLoading}
      viewPath={PATH_DASHBOARD.projects.projectDetails}
    />
  );
}
