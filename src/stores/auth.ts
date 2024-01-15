import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../services/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const useAuthStore = defineStore('auth', () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const user = ref<object | null>(null);
  const token = ref<string | null | undefined>(null);

  const makeLogin = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        user.value = result.user;
        token.value = credential?.accessToken;
        saveUser(user.value);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const saveUser = async (user: object) => {
    try {
      if (!user) return;

      const userDoc = await getDocs(collection(db, 'users'), user.uid);
      if (!userDoc.exists) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        console.log('Usuário salvo com sucesso!');
      } else {
        console.log('Usuário já existe no banco de dados.');
      }
    } catch (error) {
      console.error('Erro ao salvar o usuário:', error);
    }
  };

  const signOut = async () => {
    auth
      .signOut()
      .then(() => {
        console.log('Deslogado com sucesso!');
        user.value = null;
        token.value = null;
      })
      .catch((error) => {
        console.error('Erro ao deslogar:', error);
      });
  };

  const persistLogin = async () => {
    auth.onAuthStateChanged((userlogged) => {
      if (userlogged) {
        user.value = userlogged;
        console.log('Usuário logado.');
      } else {
        console.log('Usuário não logado.');
      }
    });
  };

  return { makeLogin, signOut, user, token, persistLogin };
});
