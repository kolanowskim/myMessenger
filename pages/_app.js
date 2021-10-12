import "../styles/globals.css";
import { auth, db, fuego } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./login";
import { useEffect } from "react";
import { doc, setDoc, serverTimestamp } from "@firebase/firestore";
import { FuegoProvider } from "swr-firestore-v9";

function MyApp({ Component, pageProps }) {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL,
        },
        { capital: true },
        { merge: true }
      );
    }
  }, [user]);

  if (!user) return <Login />;

  return (
    <FuegoProvider fuego={fuego}>
      <Component {...pageProps} />
    </FuegoProvider>
  );
}

export default MyApp;
