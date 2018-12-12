/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import propTypes from 'prop-types';
import {
  state as initialState,
  fields as fieldSet,
  validationForm,
} from './staticData';
import Form from '../../../abstract/Form';
import Footer from '../../../abstract/footer';
import Header from '../../../abstract/header';
import contextHoc from '../../../abstract/HOC/contextHoc';
import Loading from '../../loading';
import PieChart from '../../../abstract/pieChart';

class index extends Component {
  state = initialState;

  onChange = (event) => {
    const { value, name } = event.target;
    if (name === 'type' || name === 'project_type') return;
    this.setState({ [name]: value });
  };

  updateCourse = async (obj) => {
    const confirm = await swal({
      type: 'warning',
      html: 'Are you sure that you want to update this data ?',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes',
      confirmButtonAriaLabel: 'Thumbs up',
      cancelButtonText: '<i class="fa fa-thumbs-down"></i> No ',
      cancelButtonAriaLabel: 'Thumbs down',
    });
    if (confirm.value) {
      const { match: { params: { id } } } = this.props;
      const result = await axios(`/api/v2/course/${id}`, {
        method: 'PUT',
        data: {
          courseData: obj,
        },
      });
      if (result.data.error) {
        await swal({
          title: '',
          type: 'warning',
          html: result.data.error,
          confirmButtonText: 'Ok',
        });
      } else {
        await swal({
          title: 'Success',
          type: 'success',
          html: result.data.message,
        });
        this.setState({ ...obj });
      }
    }
  };

  getDetails = async () => {
    const { context: { dispatch }, match: { params: { id } } } = this.props;
    axios(`/api/v2/course/${id}`).then((result) => {
      const { data } = result;
      const startDate = data.course_start.split('T')[0];
      const endDate = data.course_end.split('T')[0];
      this.setState({
        ...data, course_start: startDate, course_end: endDate, loading: false,
      });
    }).catch((error) => {
      dispatch({ type: 'ERROR_PAGE', payload: { ErrorPage: error.response.status } });
    });
  };

  getChart = async () => {
    const { context: { dispatch }, match: { params: { id } } } = this.props;
    try {
      const {
        total: { count: total },
        countCompleted: { count: countCompleted },
      } = (await axios(`/api/v2/enrollment/${id}`)).data;
      const countUnCompleted = (total - countCompleted);

      const avg = (count, countAll) => ((count * 100) / countAll).toFixed(1);
      const completeAvg = avg(countCompleted, total);
      const unCompleteAvg = avg(countUnCompleted, total);

      this.setState({
        enrollmentStatus: [
          { decription: 'Percentage of participants who have successfully completed this training', percentage: completeAvg },
          { decription: 'Percentage of participants who have this training', percentage: unCompleteAvg },
        ],
      });
    } catch (error) {
      dispatch({
        type: 'ERROR_PAGE',
        payload: { ErrorPage: error.response.status },
      });
    }
  };

  componentWillMount = () => {
    this.getDetails();
  }

  componentDidMount = () => {
    this.getChart();
  }

  goBack = () => {
    const { history } = this.props;
    history.push('/courses/view');
  };

  onSubmit = (event) => {
    event.preventDefault();
    const fields = { ...this.state };
    const error = validationForm(fields);
    if (error) return this.setState({ error });
    this.updateCourse(fields);
  };

  render() {
    const {
      loading, enrollmentStatus,
    } = this.state;
    if (loading) return <Loading />;
    return (
      <div>
        <Header value="Training Intervention" />
        <div className="trainig-section">
          <Form
            title="Details"
            fields={fieldSet}
            values={this.state}
            onChange={this.onChange}
            btnEvents={[this.onSubmit, this.goBack]}
          />
          <div className="training-chart">
            <h2 className="title"> Outcomes</h2>
            {enrollmentStatus[0] && <PieChart sections={enrollmentStatus} width={200} title="Training Enrollment Status" />}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
export default contextHoc(index);

index.propTypes = {
  history: propTypes.object.isRequired,
};
