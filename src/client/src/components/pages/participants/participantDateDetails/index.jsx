import React, { Component } from "react";
import {
  state as initialState,
  fields as fieldSet,
  validationForm
} from "./staticData";
import Form from "./../../../abstract/Form";
import Footer from '../../../abstract/footer';
import axios from 'axios';
import contextHoc from './../../../abstract/HOC/contextHoc';
import Loading from '../../loading';

class index extends Component {
  state = initialState;

  onChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  goBack = event => {
    const id = this.props.match.params.id;
    this.props.history.push(`/participant/${id}/dates`);
  };

  getDetails = async () => {
    const { id, date_id } = this.props.match.params;
    const { dispatch } = this.props.context;
    axios(`/api/v2/participant/${id}/date/details/${date_id}`)
      .then(result => {
        const { data } = result;
        const currentDate = data.date.split("T")[0];
        this.setState({ ...data, date: currentDate, loading: false });
      })
      .catch(error => {
        dispatch({
          type: "ERROR_PAGE",
          payload: { ErrorPage: error.response.status }
        });
      });
  };

  componentDidMount = async () => {
    this.getDetails();
  };

  // the implemention waiting  back end api
  onSubmit = event => {
    event.preventDefault();
    const fields = { ...this.state };
    const error = validationForm(fields);
    if (error) return this.setState({ error });

    for (const key in fields) {
      fields[key] = "";
    }
    this.setState(fields);
  };

  render() {
    const {
      loading
    } = this.state;
    if (loading) return <Loading />;
    return (
      <div>
        <Form
          title="Date Details and Notes"
          fields={fieldSet}
          values={this.state}
          onChange={this.onChange}
          btnEvents={[this.onSubmit, this.goBack]}
        />
        <Footer />
      </div>
    );
  }
}


export default contextHoc(index);
