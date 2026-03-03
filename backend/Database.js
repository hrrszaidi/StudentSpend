import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore"
import { database } from "./Firebase"

export async function createDocument(collectionName, data) {
  const docRef = await addDoc(collection(database, collectionName), data);
  return docRef.id;
}

export async function setDocument(collectionName, docId, data) {
  await setDoc(doc(database, collectionName, docId), data);
  return docId;
}

export async function getDocument(collectionName, docId) {
  const snap = await getDoc(doc(database, collectionName, docId));
  return snap.exists() ? snap.data() : null;
}

export async function deleteDocument(collectionName, docId) {
  await deleteDoc(doc(database, collectionName, docId));
}


