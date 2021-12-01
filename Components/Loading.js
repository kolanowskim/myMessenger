import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";

function Loading() {
  return (
    <Wrapper>
      <CircularProgress />
    </Wrapper>
  );
}

export default Loading;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;
