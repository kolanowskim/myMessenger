import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import TimeAgo from "timeago-react";
import {
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useCollection } from "swr-firestore-v9";
import { Avatar } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import Message from "./Message";

function ChatScreen({ users }) {
  const [input, setInput] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const recipientEmail = getRecipientEmail(users, user);
  const scrollMessagesRef = useRef(null);

  const { data: messages } = useCollection(
    `chats/${router.query.id}/messages`,
    {
      listen: true,
      orderBy: ["timestamp", "asc"],
    }
  );

  const { data: recipient } = useCollection("users", {
    where: ["email", "==", getRecipientEmail(users, user)],
    listen: true,
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    scrollMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    updateDoc(doc(db, "users", user.uid), {
      lastSeen: serverTimestamp(),
    });

    addDoc(collection(db, "chats", router.query.id, "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
  };

  const typeInput = (e) => {
    setInput(e.target.value);
  };

  const showMessages = () => {
    return messages?.map((message) => (
      <Message
        key={message.id}
        user={message.user}
        message={{
          ...message,
          timestamp: message.timestamp.toDate().getTime(),
        }}
      >
        {}
      </Message>
    ));
  };
  return (
    <Wrapper>
      <HeaderWrapper>
        {recipient?.length > 0 ? (
          <Avatar src={recipient[0].photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipient?.length > 0 ? (
            <p>
              Last active:{` `}
              {recipient?.[0]?.lastSeen.toDate() ? (
                <TimeAgo datetime={recipient?.[0].lastSeen.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last active</p>
          )}
        </HeaderInformation>
      </HeaderWrapper>
      <MessagesWrapper>
        {showMessages()} <EndOfMessage ref={scrollMessagesRef} />
      </MessagesWrapper>
      <InputWrapper onSubmit={sendMessage}>
        <Input value={input} onChange={(e) => typeInput(e)} type="text" />
        <button hidden disabled={!input} type="submit">
          Wyślij wiadomość
        </button>
      </InputWrapper>
    </Wrapper>
  );
}

export default ChatScreen;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  padding: 10px;
  border-bottom: 1px solid whitesmoke;
  align-items: center;
  z-index: 100;
  background-color: white;
  height: 80px;
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;

const MessagesWrapper = styled.div`
  background-color: #e5ded8;
  min-height: 90vh;
`;

const InputWrapper = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  outline: 0;
  margin-left: 15px;
  margin-left: 15px;
  padding: 20px;
`;

const EndOfMessage = styled.div`
  margin-bottom: 40px;
`;
