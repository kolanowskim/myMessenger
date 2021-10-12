import React, { useState } from "react";
import Head from "next/head";
import getRecipientEmail from "../../utils/getRecipientEmail";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function NoMetter({ users }) {
  const [user] = useAuthState(auth);

  return (
    <Wrapper>
      <Head>
        <title>Chat with {getRecipientEmail(users, user)}</title>
      </Head>
      <Sidebar />
      <ChatWrapper>
        <ChatScreen users={users} />
      </ChatWrapper>
    </Wrapper>
  );
}

export default NoMetter;

export async function getServerSideProps(context) {
  const chat = await getDoc(doc(db, "chats", context.query.id));

  return {
    props: {
      users: chat.data().users,
    },
  };
}

const Wrapper = styled.div`
  display: flex;
`;

const ChatWrapper = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  background-color: lightpink;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
