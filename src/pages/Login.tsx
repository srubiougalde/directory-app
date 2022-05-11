import React from "react";
import styled from "styled-components";
import PageTitle from "../components/page-title/PageTitle.component";
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import JwtDecode from "jwt-decode";
import * as Yup from "yup";
import Loader from "react-loader-spinner";
import logo from '../logo.svg';
import Snackbar from "@material-ui/core/Snackbar";

import { Button, createStyles, Fade, makeStyles, Typography } from "@material-ui/core";
import { useHistory } from "react-router";
import { Routes } from "../providers/routes";
import { LOGIN, FORGOT } from "../Endpoints";
import { StateActions } from "../providers/State.reducer";
import { TextField, Switch as FormikSwitch } from "formik-material-ui";
import { AppUser, useAppState } from "../providers/State.provider";
import { Formik, Field, Form } from "formik";
import { PRIMARYCOLOR, SECONDARYCOLOR } from "../Utils";

import { useAuth } from "../components/protected-route/ProtectedRoute.component";
import { UserType } from "./Main";

const StyledLogin = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;
const StyledFormContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 2fr;
  grid-gap: 1em;
  justify-items: center;
  width: 100%;
`;

const StyledLoginForm = styled.form`
  background-color: ${SECONDARYCOLOR};
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 24px 24px;
  min-width: 420px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;

const StyledFormItemContainer = styled.div`
  display: flex;
  flex-flow: row;
  flex:1;
  align-items: center;
  > label {
    min-width: 100px;
    font-weight: bold;
  }
`;
const StyledLoginButton = styled.button`
  background-color: ${PRIMARYCOLOR};
  color: white;
  padding: 12px 12px;
  border: solid 1px ${PRIMARYCOLOR};
  border-radius: 6px;
  cursor: pointer;
  &:disabled {
    background-color: lightgrey;
    cursor: not-allowed;
    border: solid 1px grey;
  }
`;

const StyledLandingInput = styled(Field)`
  margin: 1em;
  font-size: 1em;
  height: 3em;
  width: 14em;
  border-radius: 5px;
  border: 1px solid lightgrey;

  ::-webkit-input-placeholder {
    text-align: center;
    color: grey;
  }

  :-moz-placeholder {
    /* Firefox 18- */
    text-align: center;
    color: grey;
  }

  ::-moz-placeholder {
    /* Firefox 19+ */
    text-align: center;
    color: grey;
  }

  :-ms-input-placeholder {
    text-align: center;
    color: grey;
  }
`;
const StyledError = styled.div`
  color: red;
`;

const useStyles = makeStyles((theme: any) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid " + PRIMARYCOLOR,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

export const storeLogin = (data: any, now: any, rememberMe: boolean) => {
  localStorage.removeItem("userData");
  localStorage.removeItem("expiresIn");
  localStorage.removeItem("userId");
  localStorage.removeItem("rememberMe");
  localStorage.setItem("userData", JSON.stringify(data.accessToken));
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("rememberMe", rememberMe.toString());
  localStorage.setItem("expiresIn", JSON.stringify(now));
};

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  rememberMe: Yup.boolean(),
});

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
});

const Login: React.FC = () => {
  const { dispatch } = useAppState();
  const [valid, setValid] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const classes = useStyles();
  const history = useHistory();
  const loggedIn = useAuth();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  React.useEffect(() => {
    if (loggedIn) {
      history.push(Routes.LANDING);
    }
  }, []);

  return (
    <StyledLogin>
      <PageTitle>Welcome</PageTitle>
      <StyledFormContainer>
        <div
          style={{
            display: "flex",
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
        >
          <img src={logo} style={{ width: 420 }} alt="logo" />
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          validateOnBlur={false}
          validateOnChange={true}
          enableReinitialize={false}
          validationSchema={SignupSchema}
          onSubmit={async (values) => {
            try {
              setValid(true)
              const { data } = await axios.post(LOGIN, {
                username: values.email,
                password: values.password,
              });

              if (data === undefined){
                setValid(false)
                return
              }

              const parsedUser = JwtDecode(data.accessToken) as AppUser;
              if (parsedUser.roles === UserType.Client)
                throw new Error("Unauthorized user");

              axios.defaults.headers.common.Authorization = "Bearer " + data.accessToken;
              const now = new Date();
              now.setSeconds(now.getSeconds() + data.expiresIn);
              storeLogin(data, now, values.rememberMe);
              dispatch({
                type: StateActions.LOGIN,
                payload: {
                  loggedIn: true,
                  user: JwtDecode(data.accessToken),
                  userId: data.userId,
                  token: data.accessToken,
                  expiresIn: now,
                  rememberMe: values.rememberMe
                },
              });
              history.push(Routes.LANDING);
            } catch (error) {
              console.log(error);
              setValid(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting, handleSubmit, isValid }) => {
            return (
              <StyledLoginForm onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
                <StyledFormItemContainer style={{ minHeight: 102 }}>
                  <label htmlFor="email">Email</label>
                  <div>
                    <StyledLandingInput
                      name="email"
                      type="email"
                      placeholder="Email"
                    />
                    {errors.email && touched.email ? (
                      <StyledError style={{ position: 'absolute' }}>{errors.email}</StyledError>
                    ) : null}
                  </div>
                </StyledFormItemContainer>

                <StyledFormItemContainer style={{ minHeight: 102 }}>
                  <label htmlFor="password">Password</label>
                  <div>
                    <StyledLandingInput
                      name="password"
                      type="password"
                      placeholder="Password"
                    />
                    {errors.password && touched.password ? (
                      <StyledError style={{ position: 'absolute' }}>{errors.password}</StyledError>
                    ) : null}
                  </div>
                </StyledFormItemContainer>
                <StyledFormItemContainer style={{ height: 18, flex: 0.5 }}>
                  <label></label>
                  <StyledError>
                    {!valid && "Invalid credentials"}
                  </StyledError>
                </StyledFormItemContainer>
                <StyledFormItemContainer>
                  <label
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {isSubmitting && (
                      <Loader
                        type="Rings"
                        color={PRIMARYCOLOR}
                        height={30}
                        width={30}
                      />
                    )}
                  </label>
                  <div
                    style={{ display: "inline-flex", alignItems: "center", flex: 1 }}
                  >
                    <Typography>Remember me</Typography>
                    <Field
                      component={FormikSwitch}
                      type="checkbox"
                      name="rememberMe"
                    />
                  </div>
                  <StyledLoginButton
                    disabled={isSubmitting || !isValid}
                    type="submit"
                  >
                    Sign in
                  </StyledLoginButton>
                </StyledFormItemContainer>

                <StyledFormItemContainer style={{ marginTop: 10 }}>
                  <label></label>
                  <a href="#" onClick={handleOpen}>
                    {" "}
                    Recover password{" "}
                  </a>
                </StyledFormItemContainer>
              </StyledLoginForm>
            );
          }}
        </Formik>
      </StyledFormContainer>

      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <Fade in={open}>
          <div className={classes.paper}>
            <Formik
              initialValues={{
                email: "",
              }}
              validateOnBlur={false}
              validateOnChange={true}
              enableReinitialize={true}
              validationSchema={ResetPasswordSchema}
              onSubmit={async (values) => {
                try {
                  await axios.post(FORGOT, {
                    username: values.email,
                  });
                } catch (error) {
                  console.log(error);
                } finally {
                  handleClose();
                  handleOpenAlert();
                }
              }}
            >
              {({ isSubmitting, handleSubmit }) => {
                return (
                  <Form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexFlow: "column", padding: 36, border: '1px solid lightgray', borderRadius: 10 }}
                  >
                    <h2 style={{ color: PRIMARYCOLOR }}>Reset password</h2>
                    <Field
                      component={TextField}
                      variant="outlined"
                      name="email"
                      type="email"
                      label="Correo electrónico"
                      style={{ height: 87 }}
                      disabled={isSubmitting}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      Send
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Fade>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openAlert}
        onClose={handleCloseAlert}
        autoHideDuration={6000}
        message="An email has been sent with the instructions."
      />
    </StyledLogin>
  );
};

export default Login;
