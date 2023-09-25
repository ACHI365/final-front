import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXkJsSrbSFDfedpkwqgs3rrZBUgMZioyM",
  authDomain: "finalproject-399323.firebaseapp.com",
  projectId: "finalproject-399323",
  storageBucket: "finalproject-399323.appspot.com",
  messagingSenderId: "463927888195",
  appId: "1:463927888195:web:cb5f0f2bb114ad60f247f6",
  measurementId: "G-HQXYYZ01FY"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);