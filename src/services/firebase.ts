import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBbkgzplC6-dVFS1WtlT94i1Cef8YzghKg',
  authDomain: 'shopping-cc6d3.firebaseapp.com',
  projectId: 'shopping-cc6d3',
  storageBucket: 'shopping-cc6d3.appspot.com',
  messagingSenderId: '702934379774',
  appId: '1:702934379774:web:578cd0640047c9c62d89af',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
