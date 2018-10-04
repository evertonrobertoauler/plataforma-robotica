import * as firebase from 'firebase/app';

export class Firebase {
  public auth: any;

  /** @ngInject */
  constructor(
    private FIREBASE_CONFIG,
    private $firebaseArray,
    private $firebaseObject,
    $firebaseAuth
  ) {
    firebase.initializeApp(this.FIREBASE_CONFIG);
    this.auth = $firebaseAuth();
  }

  createRef(path): firebase.database.Reference {
    return firebase.database().ref(path);
  }

  loadArray(ref) {
    ref = typeof ref === 'string' ? this.createRef(ref) : ref;
    return this.$firebaseArray(ref);
  }

  loadObject(ref) {
    ref = typeof ref === 'string' ? this.createRef(ref) : ref;
    return this.$firebaseObject(ref);
  }

  storageUrl(path) {
    return firebase
      .storage()
      .ref(path)
      .getDownloadURL();
  }
}
