import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.GOOGLE_API_KEY,
  authDomain: 'shopping-cc6d3.firebaseapp.com',
  projectId: 'shopping-cc6d3',
  storageBucket: 'shopping-cc6d3.appspot.com',
  messagingSenderId: '702934379774',
  appId: '1:702934379774:web:578cd0640047c9c62d89af',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
