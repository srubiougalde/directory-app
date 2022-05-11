import React from "react";
import axios from "axios";
import withLayout from "../hoc/withLayout.hoc";
import PageTitle from "../components/page-title/PageTitle.component";
import { PageBox } from "../components/page-box/PageBox.styled";
import { 
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
  enUS,
  GridCellParams,
  GridOverlay,
} from "@material-ui/data-grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useAppState } from "../providers/State.provider";
import {
  StyledPageHeader,
  StyledPageSubHeader,
} from "./Styled/Home.Styled";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { MEMBERS } from "../Endpoints";
import { PRIMARYCOLOR  } from "../Utils";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from '@material-ui/icons/Delete';
import PeopleIcon from "@material-ui/icons/People";
import ConfirmDialog from "../components/confirm-dialog/ConfirmDialog.component";
import EditMember from "./modal/EditMember.component";
import { toast } from "react-toastify";

const theme = createTheme(
  {
    palette: {
      primary: { main: PRIMARYCOLOR },
    },
  },
  enUS
);

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
  
function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}
  
const defaultColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 3,
  },
  {
    field: "websiteShortUrl",
    headerName: "Website",
    flex: 2,
    renderCell: (params: GridCellParams) => (
      <a href={params.row.websiteUrl} target='_blank'>{params.row.websiteShortUrl}</a>
    )
  },
  { 
    field: "friendsCount",
    headerName: "Friends",
    flex: 1
  }
];

type Members = {
  id: string;
  name: string;
  websiteUrl: string;
  websiteShortUrl: string;
  friendsCount: string;
};

const Home: React.FC = () => {
  const { state } = useAppState();
  const [members, setMembers] = React.useState<Members[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingMembers, setLoadingMembers] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [member, setMember] = React.useState({} as Members)
  const [markDelete, setMarkDelete] = React.useState(false);
  const [idMemberToDelete, setIdMemberToDelete] = React.useState('');

  const handleClose = () => {
    setMarkDelete(false);
  };

  const handleConfirm = () => {
    deleteMember(idMemberToDelete)
    setMarkDelete(false);
  };

  const deleteMember = async (id: string) => {
    try {
      await axios.delete(`${MEMBERS}/${id}`);
      toast.success("Member deleted");
      loadMembers();
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error al borrar la empresa");
    }
  };

  const columns = [
    ...defaultColumns,
    {
      field: "id",
      headerName: "Actions",
      flex: 1.5,
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      renderCell: (params: GridCellParams) => (
        <>
          <IconButton onClick={() => {  }}>
            <PeopleIcon />
          </IconButton>
          <IconButton onClick={() => { setOpen(true); setMember(params.row as Members) }}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setIdMemberToDelete(params.row.id)
              setMarkDelete(true)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    }
  ];

  const loadMembers = async () => {
    setLoadingMembers(true);
    try {
      const { data } = await axios.get(`${MEMBERS}`);
      setMembers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMembers(false);
    }
  };

  React.useEffect(() => {
    loadMembers();
  }, [state]);

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
                <DataGrid
                  disableSelectionOnClick
                  columns={columns}
                  rows={members}
                  loading={loading}
                  components={{
                    Toolbar: CustomToolbar,
                    LoadingOverlay: CustomLoadingOverlay,
                  }}
                />
              </ThemeProvider>
            </div>
          </div>
        </div>
      </PageBox>
      <EditMember
        open={open}
        handleClose={() => { setOpen(false) }}
        refreshDataCb={loadMembers}
        member={member}
      />
      <ConfirmDialog open={markDelete} onClose={handleClose} onConfirm={handleConfirm} title={"Delete member"} message={"This operation cannot be undone!"} />
    </div>
  );
};

export default withLayout(Home);
