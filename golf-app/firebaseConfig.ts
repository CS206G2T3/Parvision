import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBay2qWZsrGPXydJpXwvmbvnbrCw6ezTdc",
  authDomain: "parvision-bc358.firebaseapp.com",
  projectId: "parvision-bc358",
  storageBucket: "parvision-bc358.firebasestorage.app",
  messagingSenderId: "832279374125",
  appId: "1:832279374125:web:81cd990998f6ec1c43cba4",
  measurementId: "G-EREF5RXQEK"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);