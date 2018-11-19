import React, { Component } from "react";
import swal from "sweetalert2";
import axios from "axios";

import {
  state as initialState,
  fields as fieldSet,
  validationForm
} from "./staticData";
import Form from "./../../../abstract/Form";
import Footer from "../../../abstract/footer";

export default class index extends Component {
  state = initialState;

  onChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  clearFields = event => {
    event.preventDefault();
    const fields = this.state;
    for (const key in fields) {
      fields[key] = "";
    }
    this.setState(fields);
  };

  addCourse = async obj => {
    await swal({
      type: "warning",
      html: "Are you sure that you want to add this course ?",
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i className="fa fa-thumbs-up"></i> Yes',
      confirmButtonAriaLabel: "Thumbs up",
      cancelButtonText: '<i className="fa fa-thumbs-down"></i> No ',
      cancelButtonAriaLabel: "Thumbs down"
    });
    const result = await axios("/api/v2/courses", {
      method: "POST",
      data: {
        courseData: obj
      }
    });
    if (result.data.error) {
      swal({
        title: "",
        type: "warning",
        html: result.data.error,
        confirmButtonText: "Ok"
      }).then(confirm => {
        this.props.history.push("/courses/view");
      });
    } else {
      await swal({
        title: "Success",
        type: "success",
        html: result.data.message
      });
      this.setState({ ...obj });
      this.props.history.push("/courses/view");
    }
  };

  // the implemention waiting  back end api
  onSubmit = event => {
    event.preventDefault();
    const fields = { ...this.state };
    const error = validationForm(fields);
    if (error) return this.setState({ error });

    this.addCourse(fields);
  };

  render() {
    return (
      <div>
        <Form
          title="Add Course"
          fields={fieldSet}
          values={this.state}
          onChange={this.onChange}
          btnEvents={[this.onSubmit, this.clearFields]}
        />
        <Footer />
      </div>
    );
  }
}
