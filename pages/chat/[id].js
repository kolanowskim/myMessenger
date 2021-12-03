import React from "react";
import Head from "next/head";
import getRecipientEmail from "../../utils/getRecipientEmail";
import styled from "styled-components";
import Sidebar from "../../Components/Sidebar";
import ChatScreen from "../../Components/ChatScreen";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import CurrentChatContext from "../../context";

function NoMetter({ users, chatID }) {
  const [user] = useAuthState(auth);

  return (
    <Wrapper>
      <Head>
        <title>Chat with {getRecipientEmail(users, user)}</title>
      </Head>
      <CurrentChatContext.Provider value={chatID}>
        <Sidebar />
      </CurrentChatContext.Provider>
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
      chatID: context.query.id,
    },
  };
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  background-color: #dcdcdd;
`;

const ChatWrapper = styled.div`
  flex: 1;
  max-width: 40vw;
  @media (min-width: 1400px) {
    margin-right: 15vw;
  }
`;
