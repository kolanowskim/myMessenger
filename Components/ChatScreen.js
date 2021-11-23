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
import { auth, db, storage } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useCollection } from "swr-firestore-v9";
import { Avatar } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import Message from "./Message";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

function ChatScreen({ users }) {
  const [input, setInput] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const recipientEmail = getRecipientEmail(users, user);
  const scrollMessagesRef = useRef(null);
  const [image, setImage] = useState("");
  const [urlP, setUrlP] = useState("");
  const [addPhotoFlag, setAddPhotoFlag] = useState(false);
  const [addEmojiFlag, setAddEmojiFlag] = useState(false);

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
    if (
      messages?.at(-1)?.user === recipientEmail &&
      messages?.at(-1)?.read === false
    ) {
      updateDoc(
        doc(db, "chats", router.query.id, "messages", messages.at(-1).id),
        {
          read: true,
        }
      );
    }
  }, [messages]);

  const scrollToBottom = () => {
    scrollMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const updateTimeStamp = () => {
    updateDoc(doc(db, "users", user.uid), {
      lastSeen: serverTimestamp(),
    });

    updateDoc(doc(db, "chats", router.query.id), {
      timestamp: serverTimestamp(),
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    addDoc(collection(db, "chats", router.query.id, "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
      read: false,
      isMessage: true,
    });
    setInput("");
    updateTimeStamp();
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

  const sendImage = (url, e) => {
    e.preventDefault();
    addDoc(collection(db, "chats", router.query.id, "messages"), {
      timestamp: serverTimestamp(),
      user: user.email,
      imageURL: url,
      read: false,
      isMessage: false,
    });
    updateTimeStamp();
    setImage("");
  };

  const upload = (e) => {
    e.preventDefault();
    const randomID = Math.random();
    const imageRef = ref(storage, `images/${router.query.id}/${randomID}.jpg`);
    const uploadTask = uploadBytesResumable(imageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrlP(downloadURL);
          sendImage(downloadURL, e);
          setAddPhotoFlag(false);
        });
      }
    );
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
            <p>Never logged</p>
          )}
        </HeaderInformation>
      </HeaderWrapper>
      <MessagesWrapper>
        {showMessages()} <EndOfMessage ref={scrollMessagesRef} />
      </MessagesWrapper>
      <InputWrapper>
        <AddonsWrapper>
          <IconsWrapper>
            <AddPhotoIcon onClick={() => setAddPhotoFlag(!addPhotoFlag)} />
            <AddEmojiIcon onClick={() => setAddEmojiFlag(!addEmojiFlag)} />
          </IconsWrapper>
          <EmojiPicker visible={addEmojiFlag}>
            <Picker
              set="facebook"
              showPreview={false}
              showSkinTones={false}
              onClick={(emoji) => setInput(`${input}${emoji.native}`)}
            />
          </EmojiPicker>
        </AddonsWrapper>
        <TextForm onSubmit={sendMessage}>
          <Input value={input} onChange={(e) => typeInput(e)} type="text" />
          <button hidden disabled={!input} type="submit">
            Wyślij wiadomość
          </button>
        </TextForm>
      </InputWrapper>
      <AddPhotoWrapper visible={addPhotoFlag}>
        <p>Add photo</p>
        <LabelPhoto>
          <InputPhoto
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
          Click to choose a photo
        </LabelPhoto>
        {image && <Button onClick={upload}>Send</Button>}
        <CloseIconMUI
          onClick={() => {
            setAddPhotoFlag(false), setImage("");
          }}
        />
      </AddPhotoWrapper>
    </Wrapper>
  );
}

export default ChatScreen;

const EmojiPicker = styled.div`
  position: absolute;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  left: 50px;
  top: -385px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  min-height: 80vh;
  max-height: 80vh;
  box-sizing: content-box;
  overflow: hidden;
  position: relative;
  justify-content: space-between;
  box-shadow: 0px 0px 10px 2px grey;
  z-index: 101;
  border-radius: 30px;
`;
const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  padding: 10px;
  align-items: center;
  z-index: 101;
  border-bottom: 1px solid #c5c3c6;
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
  flex: 1;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  background-color: #dcdcdd;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  position: relative;
  bottom: 0;
  right: 0;
  background-color: white;
  margin: 0;
  z-index: 102;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;
const TextForm = styled.form`
  flex: 1;
  margin-left: 15px;
  position: relative;
  z-index: 101;
`;

const Input = styled.input`
  outline: 0;
  width: 100%;
  background-color: whitesmoke;
  border: none;
  padding: 20px;
  border-radius: 10px;
  position: relative;
`;

const AddonsWrapper = styled.div`
  position: relative;
  // overflow: hidden;
  background-color: white;
  z-index: 101;
`;

const EndOfMessage = styled.div`
  margin-bottom: 40px;
`;

const IconsWrapper = styled.div`
  background-color: white;
  position: relative;
  z-index: 101;
`;

const AddPhotoIcon = styled(AddPhotoAlternateIcon)`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
`;

const AddEmojiIcon = styled(InsertEmoticonIcon)`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
`;

const AddPhotoWrapper = styled.div`
  height: ${({ visible }) => (visible ? "130px" : "70px")};
  width: 300px;
  position: absolute;
  bottom: 90px;
  left: ${({ visible }) => (visible ? "30px" : "-300px")};
  background-color: white;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: ${({ visible }) => (visible ? "0px 0px 10px 2px grey" : "none")};
  padding: 10px;
  z-index: 0;
  transition: 0.5s;
`;

const CloseIconMUI = styled(CloseIcon)`
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Button = styled.button`
  border: none;
  background-color: #e5ded8;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;
  width: 100px;
  font-weight: bold;
  margin-top: 15px;
`;

const LabelPhoto = styled.label`
  border: none;
  background-color: #e5ded8;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;
  max-width: 300px;
  font-weight: bold;
  margin-top: 10px;
`;

const InputPhoto = styled.input`
  display: none;
`;
