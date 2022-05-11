import "./App.css";
import moment from "moment";

import Main from "./pages/Main";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "moment/locale/es";
import { ToastContainer } from 'react-toastify';

moment.locale("es"); // it is required to select default locale manually

function App() {
  return (
    <div>
        <MuiPickersUtilsProvider utils={MomentUtils} locale={'en'}>
          <Main />
        </MuiPickersUtilsProvider>
        <ToastContainer />
    </div>
  );
}

export default App;