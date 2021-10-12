import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useCollection } from "swr-firestore-v9";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);

  const { data } = useCollection("users", {
    where: ["email", "==", getRecipientEmail(users, user)],
  });
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Wrapper onClick={enterChat}>
      {data?.length > 0 ? (
        <UserAvatar src={`${data[0].photoURL}`} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Wrapper>
  );
}

export default Chat;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 25px;
  width: 100%;
  padding: 10px;

  :hover {
    background-color: lightgray;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px 5px 5px 15px;
`;
