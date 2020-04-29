import React from "react";

import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import COVIDApp from "./components/COVIDApp";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";
import SideNav from "./components/SideNav";
import Home from "./components/Home";
import Kanban from "./components/Kanban";

import styles from './App.css';
import SettingsPage from "./components/SettingsPage";


class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <div className={styles.SideNav}>
            <SideNav />
          </div>
          <header>
          </header>
          <div className="MainWindow">
            <Switch>
              <Route path="/" exact />
              <PrivateRoute path="/home" component={Home} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/COVIDApp" component={COVIDApp} />
              <PrivateRoute path="/Kanban" component={Kanban} />
              <PrivateRoute path="/SettingsPage" component={SettingsPage} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;