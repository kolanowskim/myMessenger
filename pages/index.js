import Head from "next/head";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Home() {
  return (
    <Wrapper>
      <Head>
        <title>myMessenger</title>
      </Head>
      <button onClick={() => signOut(auth)}>Wyloguj</button>
      <Sidebar />
    </Wrapper>
  );
}

const Wrapper = styled.div``;
