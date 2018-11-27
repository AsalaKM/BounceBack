import React, { Component } from "react";
import Statistics from "../../abstract/statistics";
import { Link } from "react-router-dom";
import Header from "../../abstract/header";
import Footer from "../../abstract/footer";
import PieChart from "../../abstract/pieChart";
import axios from "axios";
import "./style.css";
import contextHoc from "./../../abstract/HOC/contextHoc";
import Loading from "./../loading";

class index extends Component {
  state = {
    participant: "",
    course: "",
    worker: "",
    employment: [],
    sections: [],
    loading: true
  };

  componentWillMount = () => {
    this.props.history.push("/");
  };

  componentDidMount = async () => {
    const { dispatch } = this.props.context;
    try {
      // axios to get the data;
      const {
        countParticipant: { count: countParticipant },
        countCourse: { count: countCourse },
        countWorker: { count: countWorker },
        countEmployedReOffenging: { count: countEmployedReOffenging },
        countOffending: { count: countOffending },
        counts
      } = (await axios("/api/v2/overview")).data;

      const countUnemployedReoffenging = countOffending - countEmployedReOffenging;


      // get average for emloyed reoffinfing participants
      const ReoffengingEmployedAvg = (
        (countUnemployedReoffenging * 100) /
        countOffending
      ).toFixed(1);

      // get average for emloyed reoffinfing participants
      const ReoffengingUnemployedAvg = (
        (countEmployedReOffenging * 100) /
        countOffending
      ).toFixed(1);

      const EmployedCount = counts[0].reduce((sum, { count }) => sum + Number(count), 0);

      const sections = counts[0].map(({ course_name, count }) => ({
        decription: course_name,
        percentage: ((count * 100) / EmployedCount).toFixed(1)
      }));

      this.setState({
        participant: countParticipant,
        course: countCourse,
        worker: countWorker,
        employment: [
          { decription: "Percentage of participants who have reoffinding state and employed", percentage: ReoffengingEmployedAvg },
          { decription: "Percentage of participants who have reoffinding state and unemployed", percentage: ReoffengingUnemployedAvg }
        ],
        sections: sections,
        loading: false
      });
    } catch (err) {
      dispatch({
        type: "ERROR_PAGE",
        payload: { ErrorPage: err.response.status }
      });
    }
  };

  render() {
    const {
      participant,
      course,
      worker,
      employment,
      sections,
      loading
    } = this.state;
    if (loading) return <Loading />;
    return (
      <>
        <Header value="Dashboard" />
        <div className="charts">
          {sections && <PieChart sections={sections} width={250} />}
          {employment[0] && <PieChart sections={employment} width={250} />}
        </div>
        <h3 className="welcome">welcome in the bounceback dashboard</h3>
        <p className="welcome-p">you can manage any thing that you want</p>
        <div className="cards">
          <Link className="static-count" to="/participants/view">
            <Statistics number={participant} value="Participant" />
          </Link>
          <Link className="static-count" to="/courses/view">
            <Statistics number={course} value="Interventions" />
          </Link>
          <Link className="static-count" to="/workers/view">
            <Statistics number={worker} value="Worker" />
          </Link>
        </div>
        <Footer />
      </>
    );
  }
}

export default contextHoc(index);
