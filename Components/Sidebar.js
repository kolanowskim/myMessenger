import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import * as EmailValidator from "email-validator";
import { addDoc, collection } from "firebase/firestore";
import Chat from "./Chat";
import { useCollection } from "swr-firestore-v9";

function Sidebar() {
  const [user] = useAuthState(auth);
  const { data: chats } = useCollection("chats", {
    where: ["users", "array-contains", user.email],
    listen: true,
  });

  const createChat = () => {
    const input = prompt("Podaj adres email odbiorcy");

    if (!input) return;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== user.email
    ) {
      addDoc(collection(db, "chats"), {
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExist = (recipientEmail) =>
    chats?.find((chat) => chat.users.find((user) => user === recipientEmail));

  return (
    <Wrapper>
      <StyledButton onClick={createChat}>Dodaj odbiorcę</StyledButton>
      {chats?.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.users} />
      ))}
    </Wrapper>
  );
}

export default Sidebar;

const Wrapper = styled.div`
  max-width: 350px;
  height: 80vh;
`;

const StyledButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    margin: 5px 5px 5px 25px;
    font-weight: bold;
    :hover {
      background-color: lightgray;
    }
  }
`;
