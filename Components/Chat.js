import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { Avatar } from "@material-ui/core";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { updateDoc, serverTimestamp, doc } from "firebase/firestore";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useCollection } from "swr-firestore-v9";
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
    if (currentChatID != id) {
      console.log("chuj", currentChatID);
      updateDoc(doc(db, "chats", id), {
        timestamp: serverTimestamp(),
      });
    }
  }, [messages]);

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
      {currentChatID === id ? null : notification && <ExclamationMark />}
    </Wrapper>
  );
}

export default Chat;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  margin: 0px 7px 0px 5px;
  position: relative;

  :hover {
    background-color: lightgray;
    border-radius: 30px;
    transition: 0.5s;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px 5px 5px 10px;
`;

const ExclamationMark = styled(PriorityHighIcon)`
  background-color: red;
  padding: 3px;
  border-radius: 50px;
  right: 10px;
  position: absolute;
`;
