// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

// 나중에 환경 변수 처리
const firebaseConfig = {
  apiKey: import.meta.env.VITE_DB_API_KEY,
  authDomain: 'skyscope-73aa7.firebaseapp.com',
  projectId: 'skyscope-73aa7',
  storageBucket: 'skyscope-73aa7.appspot.com',
  messagingSenderId: import.meta.env.VITE_DB_SENDER_ID,
  appId: import.meta.env.VITE_DB_APP_ID,
  measurementId: import.meta.env.VITE_DB_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
