import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { Avatar } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useCollection, deleteDoc } from "swr-firestore-v9";
import CurrentChatContext from "../context";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);
  const [notification, setNotification] = useState(false);
  const currentChatID = useContext(CurrentChatContext);

  const { data: messages } = useCollection(`chats/${id}/messages`, {
    listen: true,
    orderBy: ["timestamp", "asc"],
  });

  useEffect(() => {
    if (messages?.at(-1)?.user === recipientEmail) {
      if (messages?.at(-1)?.read === false) {
        setNotification(true);
      } else {
        setNotification(false);
      }
    }
  }, [messages]);

  const { data } = useCollection("users", {
    where: ["email", "==", getRecipientEmail(users, user)],
  });

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  const deleteChat = (e) => {
    e.stopPropagation();
    deleteDoc(`chats/${id}`);
  };

  return (
    <Wrapper onClick={enterChat}>
      {data?.length > 0 ? (
        <UserAvatar src={`${data[0].photoURL}`} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
      {currentChatID === id ? null : notification && <ExclamationMark />}
      {currentChatID !== id && <DeleteButton onClick={deleteChat} />}
    </Wrapper>
  );
}

export default Chat;

const DeleteButton = styled(DeleteIcon)`
  position: absolute;
  right: -10px;
  visibility: hidden;

  :hover {
    background-color: white;
    border-radius: 50px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  margin: 0px 7px 0px 5px;
  position: relative;

  :hover {
    background-color: #dcdcdd;
    border-radius: 30px;
    transition: 0.5s;
  }
  :hover ${DeleteButton} {
    visibility: visible;
    transition: 0.5s;
    right: 10px;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px 5px 5px 10px;
`;

const ExclamationMark = styled(PriorityHighIcon)`
  background-color: red;
  padding: 3px;
  border-radius: 50px;
  right: 50px;
  position: absolute;
`;
