// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrEMa_aElTh8Foc5YD3xVjyoP5RAbJr48",
  authDomain: "base-project-8patas.firebaseapp.com",
  projectId: "base-project-8patas",
  storageBucket: "base-project-8patas.appspot.com",
  messagingSenderId: "425558786563",
  appId: "1:425558786563:web:dc443588ad9ecf64d8c436"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }