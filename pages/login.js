import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import Head from "next/head";
import { Button } from "@material-ui/core";

function login() {
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
      })
      .catch((error) => {
        const errorMessage = error.message;
        const email = error.email;
        console.log(errorMessage);
      });
  };

  return (
    <Wrapper>
      <Head>
        <title>Logowanie</title>
      </Head>
      <LoginWrapper>
        <Button variant="outlined" onClick={signIn}>
          Zaloguj się przez google
        </Button>
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
`;
