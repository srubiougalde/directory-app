import "./App.css";
import moment from "moment";

import AppStateProvider from "./providers/State.provider";
import Main from "./pages/Main";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "moment/locale/es";
import { ToastContainer, toast } from 'react-toastify';

moment.locale("es"); // it is required to select default locale manually

function App() {
  return (
    <AppStateProvider>
        <MuiPickersUtilsProvider utils={MomentUtils} locale={'en'}>
          <Main />
        </MuiPickersUtilsProvider>
        <ToastContainer />
    </AppStateProvider>
  );
}

export default App;
