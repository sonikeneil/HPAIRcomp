import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

// All functions for database mutations are stored here

export const emptyEntry = {
   name: "",
   email: "",
   description: "",
   user: "",
   category: 0,
}

export async function addEntry(entry) {
   await addDoc(collection(db, "entries"), {
      name: entry.name,
      email: entry.email,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      userid: entry.userid,
   });
}

export async function updateEntry(entry) {
   const entryRef = doc(db, "entries", entry.id);
   await updateDoc(entryRef, {
      name: entry.name,
      email: entry.email,
      description: entry.description,
      category: entry.category
   });
}

export async function deleteEntry(entry_id) {
   await deleteDoc(doc(db, "entries", entry_id));
}