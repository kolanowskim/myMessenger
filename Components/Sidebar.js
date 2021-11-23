import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import * as EmailValidator from "email-validator";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Chat from "./Chat";
import { useCollection } from "swr-firestore-v9";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";

function Sidebar() {
  const [user] = useAuthState(auth);
  const { data: chats } = useCollection("chats", {
    where: ["users", "array-contains", user.email],
    listen: true,
    orderBy: ["timestamp", "desc"],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatFormHook, setNewChatFormHook] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputEmailError, setInputEmailError] = useState(false);

  const createChat = () => {
    if (!inputEmail) return;
    if (
      EmailValidator.validate(inputEmail) &&
      !chatAlreadyExist(inputEmail) &&
      inputEmail !== user.email
    ) {
      addDoc(collection(db, "chats"), {
        users: [user.email, inputEmail],
        timestamp: serverTimestamp(),
      });
      setInputEmail("");
      setInputEmailError(false);
    } else {
      setInputEmailError(true);
    }
  };

  const chatAlreadyExist = (recipientEmail) =>
    chats?.find((chat) => chat.users.find((user) => user === recipientEmail));

  const toggleNewChatForm = () => {
    setNewChatFormHook(!newChatFormHook);
    setInputEmail("");
    setInputEmailError(false);
  };

  return (
    <Wrapper>
      <HeaderWrapper>
        <Header>
          <Avatar src={user.photoURL} />
          <Name>{user.displayName}</Name>
          <SubMenu>
            <Logout onClick={() => auth.signOut()} />
          </SubMenu>
        </Header>
        <SearchWrapper>
          <SearchIcon />
          <SearchInput
            placeholder="Search"
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
        <LastChats>
          Last chats
          <PlusIcon onClick={() => toggleNewChatForm()} />
          <NewChatForm visible={newChatFormHook}>
            <h2>Add new chat</h2>
            <NewChatP>Type receiver email</NewChatP>
            <NewChatInput
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
            ></NewChatInput>
            {inputEmailError && (
              <NewChatP error>incorrect email or duplicate</NewChatP>
            )}
            <NewChatButton onClick={() => createChat()}>Add</NewChatButton>
            <NewChatCloseIcon onClick={() => toggleNewChatForm()} />
          </NewChatForm>
        </LastChats>
      </HeaderWrapper>
      <ChatsWrapper>
        {chats
          ?.filter((chat) => {
            if (searchQuery === "") {
              return chat;
            } else if (
              chat.users.filter(
                (chatUser) =>
                  chatUser.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  chatUser !== user.email
              ).length > 0
            ) {
              return chat;
            }
          })
          ?.map((chat) => (
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
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
  min-height: 80vh;
  max-height: 80vh;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0px 0px 10px 2px grey;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid whitesmoke;
  box-shadow: 0px 2px 5px 1px grey;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  position: relative;
  z-index: 101;
  background-color: white;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
`;

const Name = styled.h2``;

const Logout = styled(LogoutIcon)`
  cursor: pointer;
  box-sizing: content-box;
  padding: 5px;
  position: relative;
  :hover {
    transition: 0.5s;
    border-radius: 20px;
    background-color: #dcdcdd;
  }
`;

const SubMenu = styled.div`
  position: relative;
`;

const SearchWrapper = styled.div`
  border-bottom: 1px solid whitesmoke;
  margin: 5px 15px 5px 15px;
  padding: 10px;
  display: flex;
  align-items: center;
  background-color: whitesmoke;
  border-radius: 20px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  background-color: whitesmoke;
  margin-left: 10px;
`;

const LastChats = styled.div`
  border-bottom: 1px solid whitesmoke;
  margin: 5px 0px 5px 15px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  position: relative;
`;

const PlusIcon = styled(AddIcon)`
  cursor: pointer;
  box-sizing: content-box;
  padding: 5px;
  margin-right: 10px;
  :hover {
    transition: 0.5s;
    border-radius: 20px;
    background-color: #dcdcdd;
  }
`;

const NewChatForm = styled.div`
  position: absolute;
  top: ${({ visible }) => (visible ? "100px" : "-250px")};
  left: calc((400px - 300px - 15px - 10px - 5px) / 2);
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 300px;
  height: 150px;
  background-color: #dcdcdd;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 2px grey;
  transition: 0.5s;
`;

const NewChatCloseIcon = styled(CloseIcon)`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const NewChatInput = styled.input`
  border: none;
  padding: 5px;
  width: 250px;
  outline: none;
  border-radius: 5px;
`;

const NewChatButton = styled.button`
  border: none;
  border-radius: 5px;
  padding: 5px;
  box-shadow: 0px 1px 2px 1px grey;
  cursor: pointer;
  transition: 0.2s;
  :hover {
    background-color: #dcdcdd;
  }
`;

const NewChatP = styled.p`
  font-weight: lighter;
  font-size: 13px;
`;

const ChatsWrapper = styled.div``;
