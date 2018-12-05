import React, { Component } from "react";
import {
  state as initialState,
  fields as fieldSet,
  validationForm
} from "./staticData";
import Form from "./../../../abstract/Form";
import Footer from '../../../abstract/footer';
import axios from 'axios';
import swal from 'sweetalert2';

export default class index extends Component {
  state = initialState;

  onChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  cancleAction = () => {
    const { id } = this.props.match.params;
    this.props.history.push(`/participant/${id}/courses`);
  };

  getPastoralNames = async () => {
    const data = await axios("/api/v2/courses/pastoral");
    const final = data.data.coursesData;
    fieldSet[0][0].options = final.map(value => value.course_name)
    if (final[0]) {
      this.setState({ course_name: final[0].course_name });
    } else {
      const confirm = await swal({
        type: "warning",
        html: "There is no pastoral interventions, please add one",
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
        confirmButtonAriaLabel: "Thumbs up",
      });
      if (confirm.value) {
        this.props.history.push('/courses/add');
      }
    }

  };

  componentDidMount = () => {
    this.getPastoralNames();
  }

  addPastoral = async obj => {
    const confirm = await swal({
      type: "warning",
      html: "Are you sure for adding this pastoral intervintions ?",
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Yes',
      confirmButtonAriaLabel: "Thumbs up",
      cancelButtonText: '<i class="fa fa-thumbs-down"></i> No ',
      cancelButtonAriaLabel: "Thumbs down"
    });
    if (confirm.value) {
      const { id } = this.props.match.params;
      const result = await axios(`/api/v2/participant/${id}/course`, {
        method: "POST",
        data: {
          courseData: obj,
        }
      });
      if (result.data.error) {
        await swal({
          title: "",
          type: "warning",
          html: result.data.error,
          confirmButtonText: "Ok"
        });
      } else {
        await swal({
          title: "Success",
          type: "success",
          html: result.data.message
        });
      }
      this.setState({ ...obj });
      this.props.history.push(`/participant/${id}/courses`);
    }
  }

  // add new pastoral 
  onSubmit = event => {
    event.preventDefault();
    const fields = { ...this.state };
    const error = validationForm(fields);
    if (error) return this.setState({ error });

    this.addPastoral(fields);
  };

  render() {
    return (
      <div>
        <Form
          title="Add New Pastoral Intervention"
          fields={fieldSet}
          values={this.state}
          onChange={this.onChange}
          btnEvents={[this.onSubmit, this.cancleAction]}
        />
        <Footer />
      </div>
    );
  }
}
