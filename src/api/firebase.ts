import { TempBusiness } from '../@types/krowd/business';
import firebase from 'firebase/app';
import { firebaseConfigSecondary } from '../config';

const FIREBASE_DATASTORAGE_CONFIG = {
  colection: {
    business: 'business'
  }
};

class FirebaseService {
  static async getAllTempBusiness() {
    const _firebase = firebase.app('Secondary');
    const businessRef = _firebase
      .firestore()
      .collection(FIREBASE_DATASTORAGE_CONFIG.colection.business);
    const snapshot = await businessRef.get();
    const listBusiness: TempBusiness[] = [];
    snapshot.forEach(async (doc) => {
      const data = doc.data();
      var business: TempBusiness = {
        email: data.email,
        displayName: data.name,
        uid: data.uid,
        password: data.password
      };
      listBusiness.push(business);
    });
    return listBusiness;
  }

  static async createTempBusinessFirebase(email: string, password: string, name: string) {
    const _firebase = firebase.app('Secondary');
    _firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (res) => {
        _firebase
          .firestore()
          .collection('business')
          .add({
            uid: res.user?.uid,
            email: email,
            name: name,
            password: password,
            address: '',
            description: '',
            image: '',
            phoneNum: '',
            status: 'notSubmited',
            taxIdentificationNumber: '',
            fieldList: [{ id: '', name: '' }],
            denied_message: ''
          })
          .then(() => _firebase.auth().currentUser?.sendEmailVerification())
          .then(() => _firebase.auth().signOut());
      });
  }
}

export default FirebaseService;