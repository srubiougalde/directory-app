import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  StyledTopNav,
  StyledTopNavLeft,
  StyledTopNavRight,
} from "./TopNav.styled";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import companylogo from "../../assets/companylogo.svg";
import { Routes, RouteTitles } from "../../providers/routes";
import { PRIMARYCOLOR } from "../../Utils";
import { useAppState } from "../../providers/State.provider";
import { StateActions } from "../../providers/State.reducer";
import { UserType } from "../../pages/Main";

const TopNav: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExitClick = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberMe");
    dispatch({ type: StateActions.LOGOUT, payload: {} });
    history.push(Routes.LOGIN);
  };

  return (
    <StyledTopNav>
      <StyledTopNavLeft>
        <span>{RouteTitles[location.pathname]}</span>
        {state.user.roles === UserType.SuperAdmin && <div style={{ marginLeft: 50, display: 'flex', alignItems: 'center' }}>
        </div>}

      </StyledTopNavLeft>
      <StyledTopNavRight>
        <span>{state.user.given_name} {state.user.family_name}</span>
        <IconButton
          style={{ color: PRIMARYCOLOR, backgroundColor: "transparent" }}
          aria-label="menu"
          component="button"
          onClick={handleClick}
        >
          <Avatar style={{ backgroundColor: PRIMARYCOLOR }}>{state.user && state.user.given_name && state.user.given_name[0].toUpperCase() || '?'}</Avatar>
          {/* <KeyboardArrowDownIcon /> */}
        </IconButton>
        {/* <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { history.push(Routes.DIRECTORY) }}>Directory</MenuItem>
        </Menu> */}
        <span style={{ fontWeight: 500, fontSize: 36, color: "black" }}>|</span>
        <IconButton
          style={{ color: PRIMARYCOLOR }}
          aria-label="logout"
          component="span"
          onClick={handleExitClick}
        >
          <PowerSettingsNewIcon />
        </IconButton>
      </StyledTopNavRight>
    </StyledTopNav>
  );
};

export default TopNav;
