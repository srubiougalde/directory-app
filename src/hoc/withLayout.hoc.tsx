import React from "react";
import TopNav from "../components/top-nav/TopNav.component";
import { StyledLayout } from "./Layout.styled";
import styled from 'styled-components'
import { SECONDARYCOLOR } from "../Utils";

const StyledMainContainer = styled.div`
  grid-area: main;
  background-color: ${SECONDARYCOLOR};
  padding: 16px 16px;
  overflow: auto;
  max-height: calc(100vh - 64px);
`

function withLayout<T>(Component: React.ComponentType<T>) {
  return (props: T) => (
    <StyledLayout>
      <TopNav />
      <StyledMainContainer>
        <Component {...props} />
      </StyledMainContainer>
    </StyledLayout>
  );
}

export default withLayout;
