import React, { Component } from "react";
import {
  state as initialState,
  fields as fieldSet
  // validationForm
} from "./staticData";
import Button from "./../../../abstract/button";
import Form from "./../../../abstract/Form";
import Footer from "../../../abstract/footer";
import axios from "axios";
import contextHoc from "./../../../abstract/HOC/contextHoc";
import "./style.css";
import swal from "sweetalert2";

class index extends Component {
  state = initialState;

  goBack = event => {
    this.props.history.push("/participants/view");
  };

  goDates = event => {
    const id = this.props.match.params.id;
    this.props.history.push(`/participant/${id}/dates`);
  };

  goTrainings = event => {
    const id = this.props.match.params.id;
    this.props.history.push(`/participant/${id}/courses`);
  };

  getDetails = async () => {
    const id = this.props.match.params.id;
    const { dispatch } = this.props.context;
    axios(`/api/v2/participant/${id}`)
      .then(result => {
        const { data } = result;
        const date = data.date_of_birth.split("T")[0];
        this.setState({ ...data, date_of_birth: date });
      })
      .catch(error => {
        dispatch({
          type: "ERROR_PAGE",
          payload: { ErrorPage: error.response.status }
        });
      });
  };

  updateParticipant = async obj => {
    const confirm = await swal({
      type: "warning",
      html: "Are you sure that you want to update this data ?",
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes',
      confirmButtonAriaLabel: "Thumbs up",
      cancelButtonText: '<i class="fa fa-thumbs-down"></i> No ',
      cancelButtonAriaLabel: "Thumbs down"
    });
    if (confirm.value) {
      const { id } = this.props.match.params;
      const result = await axios(`/api/v2/participant/${id}`, {
        method: "PUT",
        data: {
          participantData: obj
        }
      });
      if (result.data.error) {
        await swal({
          title: "",
          type: "warning",
          html: result.data.error,
          confirmButtonText: "Ok"
        });
        this.props.history.push("/participants/view");
      } else {
        await swal({
          title: "Success",
          type: "success",
          html: result.data.message
        });
        this.setState({ ...obj });
        this.props.history.push("/participants/view");
      }
    }
  };

  componentDidMount = () => {
    this.getDetails();
  };

  // the implemention waiting  back end api
  onSubmit = event => {
    event.preventDefault();
    const fields = { ...this.state };
    // const error = validationForm(fields);
    // if (error) return this.setState({ error });
    this.updateParticipant(fields);
  };

  onChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <>
        <Form
          title="Participant Details"
          fields={fieldSet}
          values={this.state}
          onChange={this.onChange}
          btnEvents={[this.onSubmit, this.goBack]}
        />
        <div className="button-taps">
          <Button value="Dates" onClick={this.goDates} color="#272727" />
          <Button
            value="Trainings"
            onClick={this.goTrainings}
            color="#272727"
          />
        </div>
        <Footer />
      </>
    );
  }
}

export default contextHoc(index);
