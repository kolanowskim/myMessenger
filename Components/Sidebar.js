import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import * as EmailValidator from "email-validator";
import { addDoc, collection } from "firebase/firestore";
import Chat from "./Chat";
import { useCollection } from "swr-firestore-v9";

function Sidebar() {
  const [subMenu, setSubMenu] = useState(false);
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

  const showSubMenu = () => {
    setSubMenu(!subMenu);
  };

  return (
    <Wrapper>
      <HeaderWrapper>
        <Header>
          <Avatar src={user.photoURL} />
          <Name>{user.displayName}</Name>

          <SubMenu>
            <VertIcon onClick={() => showSubMenu()} />
            <DropDownList subMenu={subMenu}>
              <DropDownButton>Edytuj Konto</DropDownButton>
              <DropDownButton onClick={() => auth.signOut()}>
                Wyloguj
              </DropDownButton>
            </DropDownList>
          </SubMenu>
        </Header>
        <LastChats>
          Last chats
          <PlusIcon onClick={createChat} />
        </LastChats>
      </HeaderWrapper>
      <ChatsWrapper>
        {chats?.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.users} />
        ))}
      </ChatsWrapper>
    </Wrapper>
  );
}

export default Sidebar;

const Wrapper = styled.div`
  min-width: 400px;
  max-width: 400px;
  height: 100vh;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 15px;
  margin-right: 10px;
  padding: 10px;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid whitesmoke;
  box-shadow: 0px 2px 5px grey;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
`;

const Name = styled.h2``;

const VertIcon = styled(MoreVertIcon)`
  cursor: pointer;
  box-sizing: content-box;
  padding: 5px;
  position: relative;
  :hover {
    transition: 0.5s;
    border-radius: 20px;
    background-color: lightgray;
  }
`;

const SubMenu = styled.div`
  position: relative;
`;
const DropDownList = styled.div`
  top: 100%;
  right: 50%;
  position: absolute;
  // background-color: white;
  width: 150px;
  //height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: 1px solid lightgrey;
  box-shadow: 2px -2px 10px grey;
  visibility: ${({ subMenu }) => (subMenu ? "visible" : "hidden")};
`;
const DropDownButton = styled.button`
  cursor: pointer;
  border: none;
  background-color: white;
  padding: 15px;
  :hover {
    transition: 0.5s;
    background-color: lightgrey;
  }
`;

const LastChats = styled.div`
  border-bottom: 1px solid whitesmoke;
  margin: 5px 0px 5px 15px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const PlusIcon = styled(AddIcon)`
  cursor: pointer;
  box-sizing: content-box;
  padding: 5px;
  margin-right: 10px;
  :hover {
    transition: 0.5s;
    border-radius: 20px;
    background-color: lightgray;
  }
`;

/* const StyledButton = styled(Button)`
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
`; */

const ChatsWrapper = styled.div``;
