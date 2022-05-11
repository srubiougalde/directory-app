import React from "react";
import axios from "axios";

import {
  Button,
  createStyles,
  Dialog,
  Fade,
  InputAdornment,
  makeStyles,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import { MEMBERS } from "../../Endpoints";
import { PRIMARYCOLOR } from "../../Utils";
import * as Yup from "yup";
import { useAppState } from "../../providers/State.provider";
import { toast } from "react-toastify";


const EditMemberSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  websiteUrl: Yup.string().required("Required"),
});

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

type Member = {
  id: string,
  name: string;
  websiteUrl: string;
};

type EditMemberProps = {
  open: boolean;
  handleClose: () => void;
  refreshDataCb: () => void;
  member: Member;
};

const EditMember: React.FC<EditMemberProps> = ({
  open,
  handleClose,
  refreshDataCb,
  member,
}) => {
  const classes = useStyles();
  const { state } = useAppState();
  const isNew = Object.keys(member).length > 0 || false;

  return (
    <Dialog open={open} onClose={handleClose} className={classes.modal}>
      <Fade in={open}>
        <div className={classes.paper}>
          <Formik
            initialValues={{
              id: member.id,
              name: member.name,
              websiteUrl: member.websiteUrl,
            }}
            validateOnBlur={false}
            validateOnChange={true}
            enableReinitialize={true}
            validationSchema={EditMemberSchema}
            onSubmit={async (values) => {
              try {
                await axios.put(`${MEMBERS}/${values.id}`, {
                  name: values.name,
                  websiteUrl: values.websiteUrl,
                });
                toast.success("Member updated");
                refreshDataCb();
              } catch (error) {
                console.log(error);
                toast.error("Unexpected error ocurred");
              } finally {
                handleClose();
              }
            }}
          >
            {({ isSubmitting, handleSubmit, isValid, values }) => {
              return (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "350px",
                    gridGap: "18px",
                    padding: 24,
                    border: '1px solid lightgray',
                    borderRadius: 10,
                  }}
                >
                  <h2 style={{ color: PRIMARYCOLOR }}>Edit member</h2>
                  <Field
                    component={TextField}
                    label="Name *"
                    name="name"
                    variant="outlined"
                  />
                  <Field
                    component={TextField}
                    label="Website Url *"
                    name="websiteUrl"
                    variant="outlined"
                  />
                  <Button type="submit" disabled={isSubmitting || !isValid}>
                    {isNew ? "Edit" : "Create"}
                  </Button>
                </form>
              );
            }}
          </Formik>
        </div>
      </Fade>
    </Dialog>
  );
};
export default EditMember;
