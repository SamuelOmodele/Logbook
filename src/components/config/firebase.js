import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfFIS2UwFILC7P-tbZqO538dfd_CZRUAQ",
  authDomain: "e-itriam.firebaseapp.com",
  projectId: "e-itriam",
  storageBucket: "e-itriam.appspot.com",
  messagingSenderId: "445830460354",
  appId: "1:445830460354:web:a9dfc0dd99cde854289c5b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const Imagedb = getStorage(app)
