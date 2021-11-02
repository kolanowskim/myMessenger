import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Fuego } from "swr-firestore-v9";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhFTMBnaorLs_iMZQr_Btar3Eyw7j0RXE",
  authDomain: "mymessenger-c8a5e.firebaseapp.com",
  projectId: "mymessenger-c8a5e",
  storageBucket: "mymessenger-c8a5e.appspot.com",
  messagingSenderId: "560132488765",
  appId: "1:560132488765:web:c6ddf216bc7876345b7454",
};

const fuego = new Fuego(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage();

export { db, auth, provider, fuego, storage };
