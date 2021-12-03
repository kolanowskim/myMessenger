import Head from "next/head";
import Sidebar from "../Components/Sidebar";
import styled from "styled-components";

export default function Home() {
  return (
    <Wrapper>
      <Head>
        <title>myMessenger</title>
      </Head>
      <Sidebar />
      <Mannual>
        <MannualHeader>Mannual</MannualHeader>
        <MannualContent>
          <MannualH3>Left panel</MannualH3>
          <ul>
            <li>
              <MannualP>
                To add new chat you have to click on "plus" on the right side
                from "Last chats". New chat will appear below.
              </MannualP>
            </li>
            <li>
              <MannualP>
                When you click on the particular chat, you will be redirected to
                this particular conversation. Then you can start typing, sending
                images, emoji etc.
              </MannualP>
            </li>
            <li>
              <MannualP>
                You can delete each chat, but not current opened chat. Delete
                option will appear from the right side when you hover on the
                chat.
              </MannualP>
            </li>
            <li>
              <MannualP>
                When you receive message inside other closed chat, you will get
                red notification on this chat. Like delete option.
              </MannualP>
            </li>
            <li>
              <MannualP>Chats are search by input above.</MannualP>
            </li>
            <li>
              <MannualP>
                Icon from right side of your name is used for logout.
              </MannualP>
            </li>
            <li>
              <MannualP>Chats are scrollable.</MannualP>
            </li>
          </ul>
          <MannualH3>Right panel - conversation</MannualH3>
          <ul>
            <li>
              <MannualP>Emojis are available under face icon.</MannualP>
            </li>
            <li>
              <MannualP>
                You can send image by clicking on icon with image. Then you will
                be prompt to choose, then send option will appear.
              </MannualP>
            </li>
            <li>
              <MannualP>
                Below receiver email you can see his last activity or if he was
                logged whenever.
              </MannualP>
            </li>
            <li>
              <MannualP>Each image is able to zoom by clicking on it.</MannualP>
            </li>
            <li>
              <MannualP>Send message by pressing "enter".</MannualP>
            </li>
            <li>
              <MannualP>Conversation is scrollable.</MannualP>
            </li>
          </ul>
        </MannualContent>
      </Mannual>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  background-color: #dcdcdd;
`;

const Mannual = styled.div`
  flex: 1;
  max-width: 40vw;
  min-height: 80vh;
  max-height: 80vh;
  overflow-y: scroll;
  box-shadow: 0px 0px 10px 2px grey;
  border-radius: 30px;
  background-color: white;

  ::-webkit-scrollbar {
    width: 5px;
    display: block;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
    margin-top: 50px;
    margin-bottom: 50px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: grey;
    border-radius: 30px;
  }

  @media (min-width: 1400px) {
    margin-right: 15vw;
  }
`;

const MannualHeader = styled.h1`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #c5c3c6;
  background-color: white;
  box-shadow: 0px 3px whitesmoke;
  position: sticky;
  top: 0;
`;

const MannualContent = styled.div`
  margin: 0px 15px 0px 0px;
`;
const MannualH3 = styled.h3`
  margin: 15px 0 0 15px;
`;

const MannualP = styled.p`
  margin-top: 15px;
`;
