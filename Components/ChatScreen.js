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

  //Jeśli user = recipientemail
  //Ustaw read na true

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

  //read = false

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
      read: false,
      isMessage: true,
    });
    setInput("");

    updateDoc(doc(db, "chats", router.query.id), {
      timestamp: serverTimestamp(),
    });
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
    updateDoc(doc(db, "users", user.uid), {
      lastSeen: serverTimestamp(),
    });

    addDoc(collection(db, "chats", router.query.id, "messages"), {
      timestamp: serverTimestamp(),
      user: user.email,
      imageURL: url,
      read: false,
      isMessage: false,
    });
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
          console.log("File available at", downloadURL);
          setUrlP(downloadURL);
          sendImage(downloadURL, e);
          setAddPhotoFlag(false);
        });
      }
    );
    setImage("");
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
      <InputWrapper>
        <AddonsWrapper>
          <AddPhotoIcon onClick={() => setAddPhotoFlag(!addPhotoFlag)} />
          {addPhotoFlag && (
            <AddPhotoWrapper>
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
          )}
          <AddEmoji onClick={() => setAddEmojiFlag(!addEmojiFlag)} />

          {addEmojiFlag && (
            <EmojiPicker>
              <Picker
                set="facebook"
                showPreview={false}
                showSkinTones={false}
                onClick={(emoji) => setInput(`${input}${emoji.native}`)}
              />
            </EmojiPicker>
          )}
        </AddonsWrapper>
        <TextForm onSubmit={sendMessage}>
          <Input value={input} onChange={(e) => typeInput(e)} type="text" />
          <button hidden disabled={!input} type="submit">
            Wyślij wiadomość
          </button>
        </TextForm>
      </InputWrapper>
    </Wrapper>
  );
}

export default ChatScreen;

const EmojiPicker = styled.div`
  position: absolute;
  z-index: 999;
  bottom: 50px;
  left: 50px;
`;

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

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
`;
const TextForm = styled.form`
  flex: 1;
  margin-left: 15px;
  margin-left: 15px;
`;

const Input = styled.input`
  outline: 0;
  width: 100%;
  background-color: whitesmoke;
  border: none;
  padding: 20px;
  border-radius: 10px;
`;

const AddonsWrapper = styled.div`
  position: relative;
`;

const EndOfMessage = styled.div`
  margin-bottom: 40px;
`;

const AddPhotoIcon = styled(AddPhotoAlternateIcon)`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
`;

const AddPhotoWrapper = styled.div`
  height: 130px;
  width: 400px;
  position: fixed;
  top: 50vh;
  right: calc(50vw - 400px);
  background-color: white;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 0 10px 10px grey;
  padding: 10px;
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

const AddEmoji = styled(InsertEmoticonIcon)`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  //background-color: whitesmoke;
`;
