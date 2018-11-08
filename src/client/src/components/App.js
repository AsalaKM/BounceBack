import React, { Component } from "react";
import Sidebar from "../components/abstract/sidebar";
import Container from "../components/abstract/layout/Container";
import ViewParticipants from "../components/pages/participants/viewParticipants";
import viewCourses from '../components/pages/courses/viewCourses';
import viewManagers from '../components/pages/managers/viewManagers' ;
import date from '../components/pages/dates';
import Dashboard from "../components/pages/dashboard";
import AddParticipant from '../components/pages/participants/addParticipant';
import ViewWorker from '../components/pages/workers/viewWorkers';
import Login from './pages/login';
import ReportResult from './pages/reportResult'
import Report from './pages/report'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

class App extends Component {
  state = {
    login: true
  };
  render() {
    return (
      <Router>
        <div className="App">
          {!this.state.login ? (
            <Login /> // Login Page
            ) : (
            <React.Fragment>
              <div className='view-app'>
              <Sidebar />
              <Container>
                <Switch>
                  <Route exact path="/participants/view" component={ViewParticipants}/>
                  <Route exact path="/courses/view" component={viewCourses}/>
                  <Route exact path="/managers/view" component={viewManagers}/>
                  <Route exact path="/participants/dates" component={date}/>
                  <Route exact path="/" component={Dashboard}/>
                  <Route exact path="/participants/add" component={AddParticipant}/>
                  <Route exact path="/report/result" component={ReportResult}/>
                  <Route exact path="/report" component={Report}/>
                  <Route exact path="/workers/view" component={ViewWorker}/>
                </Switch>
              </Container>
              </div>
            </React.Fragment>
          ) }
        </div>
      </Router>
    );
  }
}

export default App;
