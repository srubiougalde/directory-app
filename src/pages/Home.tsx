import React from "react";
import withLayout from "../hoc/withLayout.hoc";
import PageTitle from "../components/page-title/PageTitle.component";
import { PageBox } from "../components/page-box/PageBox.styled";
import { 
  DataGrid,
  enUS,
} from "@material-ui/data-grid";
import { useAppState } from "../providers/State.provider";
import {
  StyledPageHeader,
  StyledPageSubHeader,
} from "./Styled/Home.Styled";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { PRIMARYCOLOR  } from "../Utils";

const theme = createTheme(
  {
    palette: {
      primary: { main: PRIMARYCOLOR },
    },
  },
  enUS
);

const Home: React.FC = () => {
  const { state } = useAppState();

  return (
    <div>
      <PageTitle>Home</PageTitle>
      <StyledPageHeader>
        Hi, {(state.user && state.user.given_name) || ""}!{" "}
      </StyledPageHeader>
      <StyledPageSubHeader>Directory</StyledPageSubHeader>
      <PageBox marginTop="40px">
        <div style={{ height: 400, width: "100%" }}>
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <ThemeProvider theme={theme}>
                
              </ThemeProvider>
            </div>
          </div>
        </div>
      </PageBox>
    </div>
  );
};

export default withLayout(Home);
