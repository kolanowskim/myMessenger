import "../styles/globals.css";
import { auth, db, fuego } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { doc, setDoc, serverTimestamp } from "@firebase/firestore";
import { FuegoProvider } from "swr-firestore-v9";
import dynamic from "next/dynamic";

const LoadingWithNoSSR = dynamic(() => import("../Components/Loading"), {
  ssr: false,
});

const LoginWithNoSSR = dynamic(() => import("../Components/login"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

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

  if (loading) return <LoadingWithNoSSR />;
  if (!user) return <LoginWithNoSSR />;

  return (
    <FuegoProvider fuego={fuego}>
      <Component {...pageProps} />
    </FuegoProvider>
  );
}

export default MyApp;
