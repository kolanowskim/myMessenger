import React, { useState } from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  const [showImage, setShowImage] = useState(false);

  const whoIs = user === userLoggedIn.email;

  const TypeOfMessage = whoIs ? Sender : Reciever;
  const TypeOfMessageImage = whoIs ? SenderImage : RecieverImage;
  const TypeOfTimestamp = whoIs ? SenderTimestamp : RecieverTimestamp;

  return (
    <Wrapper>
      {message.isMessage ? (
        <TypeOfMessage>
          {message.message}
          <TypeOfTimestamp>
            {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
          </TypeOfTimestamp>
        </TypeOfMessage>
      ) : (
        <TypeOfMessageImage>
          <Image
            src={message.imageURL}
            onClick={() => setShowImage(true)}
          ></Image>
          <TypeOfTimestamp>
            {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
          </TypeOfTimestamp>
        </TypeOfMessageImage>
      )}
      {showImage && (
        <ShowImageWrapper>
          <ShowImageCointener>
            <ShowImageClose onClick={() => setShowImage(false)} />
            <Image src={message.imageURL} />
          </ShowImageCointener>
        </ShowImageWrapper>
      )}
    </Wrapper>
  );
}

export default Message;

const Wrapper = styled.div``;
const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  max-width: 80%;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
  overflow-wrap: break-word;
`;
const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;
const Reciever = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;
const Timestamp = styled.span`
  color: grey;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
`;
const SenderTimestamp = styled(Timestamp)`
  text-align: right;
  right: 0;
`;

const RecieverTimestamp = styled(Timestamp)`
  text-align: left;
  left: 0;
`;

const MessageElementImage = styled.div`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  max-width: 80%;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Image = styled.img`
  width: 100%;
  cursor: pointer;
`;
const SenderImage = styled(MessageElementImage)`
  background-color: #dcf8c6;
  margin-left: auto;
`;
const RecieverImage = styled(MessageElementImage)`
  background-color: whitesmoke;
  text-align: left;
`;

const ShowImageWrapper = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  backdrop-filter: blur(2px);
  z-index: 900;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ShowImageCointener = styled.div`
  background-color: white;
  padding: 30px;
  position: relative;
  box-shadow: 0px 0px 10px 2px grey;
`;

const ShowImageClose = styled(CloseIcon)`
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 5px;
`;
