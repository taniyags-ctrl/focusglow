import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCL_IAmhy2uX7iYvcvNMJ4R0i8OaXd07xQ",
  authDomain: "focusglow-c5f9f.firebaseapp.com",
  databaseURL: "https://focusglow-c5f9f.firebaseio.com",
  projectId: "focusglow-c5f9f",
  storageBucket: "focusglow-c5f9f.appspot.com",
  messagingSenderId: "652364966999",
  appId: "1:652364966999:web:d69704fd4daaf204988712"
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);