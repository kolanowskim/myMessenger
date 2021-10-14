import Head from "next/head";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";

export default function Home() {
  return (
    <Wrapper>
      <Head>
        <title>myMessenger</title>
      </Head>
      <Sidebar />
    </Wrapper>
  );
}

const Wrapper = styled.div``;
