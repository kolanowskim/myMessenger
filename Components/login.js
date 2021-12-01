import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import Head from "next/head";

function login() {
  const signIn = () => {
    signInWithPopup(auth, provider).catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  };

  return (
    <Wrapper>
      <Head>
        <title>Logowanie</title>
      </Head>
      <LoginWrapper>
        <Info>
          <InfoH1>
            Hi, to use this appliaction you must login by google account.
          </InfoH1>
        </Info>
        <Button onClick={signIn}>Login by google</Button>
      </LoginWrapper>
    </Wrapper>
  );
}

export default login;

const Wrapper = styled.div`
  height: 80vh;
  display: grid;
  place-items: center;
`;
const LoginWrapper = styled.div`
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Info = styled.div`
  border: 1px solid whitesmoke;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 0 1px 2px lightgrey;
  border-radius: 5px;
`;

const InfoH1 = styled.div`
  font-size: 20px;
`;

const Button = styled.button`
  border-radius: 5px;
  background-color: lightgrey;
  border: none;
  padding: 15px;
  width: 300px;
  box-shadow: 0 0 3px black;
  font-size: 20px;
  cursor: pointer;
  :hover {
    background-color: grey;
  }
  transition: 0.5s;
`;
