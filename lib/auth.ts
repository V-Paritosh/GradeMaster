import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseClient";

export type SessionLike = { user: { id: string } } | null;

function toAuthUser(user: User) {
  return { id: user.uid, uid: user.uid, email: user.email ?? undefined };
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  graduationYear: string
) {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      graduationYear,
      email,
    });
    return { data: { user: toAuthUser(user) }, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { data: { user: null }, error: { message: error.message ?? "Sign up failed" } };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return { data: { user: toAuthUser(user) }, error: null };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { data: { user: null }, error: { message: error.message ?? "Sign in failed" } };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    throw err;
  }
}

export function getCurrentSession(): Promise<SessionLike> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user ? { user: { id: user.uid } } : null);
    });
  });
}
