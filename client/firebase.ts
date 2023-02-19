import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCisXDPRsqLxT8hR3wWi3S0Db0YUc9zzaw",
  authDomain: "hackathon-8e9ac.firebaseapp.com",
  projectId: "hackathon-8e9ac",
  storageBucket: "hackathon-8e9ac.appspot.com",
  messagingSenderId: "423832736018",
  appId: "1:423832736018:web:ed9fbca5fbd8a157c8a3cb",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
