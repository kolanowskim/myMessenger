import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import moment from "moment";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;
  const TypeOfMessageImage =
    user === userLoggedIn.email ? SenderImage : RecieverImage;

  return (
    <Wrapper>
      {message.isMessage ? (
        <TypeOfMessage>
          {message.message}
          <Timestamp>
            {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
          </Timestamp>
        </TypeOfMessage>
      ) : (
        <TypeOfMessageImage>
          <Image src={message.imageURL}></Image>
          <Timestamp>
            {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
          </Timestamp>
        </TypeOfMessageImage>
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
  padding-bottom: 26px;
  position: relative;
  text-align: right;
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
  text-align: right;
  right: 0;
`;

const MessageElementImage = styled.div`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Image = styled.img`
  max-width: 40vw;
`;
const SenderImage = styled(MessageElementImage)`
  background-color: #dcf8c6;
  margin-left: auto;
`;
const RecieverImage = styled(MessageElementImage)`
  background-color: whitesmoke;
  text-align: left;
`;
