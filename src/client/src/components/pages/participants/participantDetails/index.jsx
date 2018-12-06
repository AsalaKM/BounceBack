import React, { Component } from "react";
import {
  state as initialState,
  fields as fieldSet
} from "./staticData";
import Form from "./../../../abstract/Form";
import Footer from "../../../abstract/footer";
import axios from "axios";
import swal from "sweetalert2";
import contextHoc from './../../../abstract/HOC/contextHoc';
import Loading from '../../loading';
import { makeDownloadLink } from './logic'


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
  goPrison = event => {
    const { id } = this.props.match.params;
    const prisonId = this.state.prisonerId
    this.props.history.push(`/participants/${id}/prisoner/${prisonId}`);
  }

  getPrison = async () => {
    const id = this.props.match.params.id;
    const { dispatch } = this.props.context;
    axios(`/api/v2/participants/${id}/prison`)
      .then(result => {
        const { count } = result.data.getPrisoner;
        if (count === 1) {
          const prisonId = result.data.getPrisoner.rows[0].id;
          fieldSet[0][3].display = 'block';
          this.setState({ prisonerId: prisonId })
        } else {
          fieldSet[0][3].display = 'none';
          this.setState({ prisonerId: '' })
        }
      })
      .catch(error => {
        dispatch({
          type: "ERROR_PAGE",
          payload: { ErrorPage: error.response.status }
        });
      });
  };

  getDetails = async () => {
    const id = this.props.match.params.id;
    const { dispatch } = this.props.context;

    axios(`/api/v2/participant/${id}`)
      .then(async result => {
        this.getPrison();
        const { data } = result;
        const date = data.date_of_birth.split("T")[0];
        console.log(data);
        this.setState({ ...data, date_of_birth: date, loading: false })
      })
      .catch(error => {
        dispatch({
          type: "ERROR_PAGE",
          payload: { ErrorPage: error.response.status }
        });
      })
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
      const upload = document.getElementById('fileid');
      const FileData = new FormData();
      const fields = { ...obj };
      FileData.append('data', JSON.stringify(fields));
      FileData.append("file", upload.files[0]);
      const { id } = this.props.match.params;
      const result = await axios.put(`/api/v2/participant/${id}`, FileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
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

  // Edit Data
  onSubmit = event => {
    event.preventDefault();
    const fields = { ...this.state };
    this.updateParticipant(fields);
  };

  onChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };
  downloadCV = async () => {
    const { id } = this.props.match.params;
    try {
      const response = await fetch(`/api/v2/download/${id}`)
      if (response.status !== 200) throw new TypeError(`Can't Download The File`);
      const filename = response.headers.get('filename');
      const blob = await response.blob();
      makeDownloadLink(blob, filename);
    } catch ({ message }) {
      swal("Oops", message, "error")
    }
  }
  uploadCV = () => {
    document.getElementById('fileid').click();
  }

  render() {
    const { fileExists } = this.state;
    const btnFunc = [
      this.onSubmit,
      this.goBack,
      null,
      this.goPrison,
      this.goDates,
      this.goTrainings,
    ];

    if (fileExists) {
      btnFunc[2] = (this.downloadCV)
      fieldSet[fieldSet.length - 1][2].value = "Download CV";
    }
    else {
      btnFunc[2] = (this.uploadCV)
      fieldSet[fieldSet.length - 1][2].value = "Upload CV";
    } const {
      loading
    } = this.state;
    if (loading)
      return <Loading />;

    return (
      <>
        <Form
          title="Participant Details"
          fields={fieldSet}
          values={this.state}
          onChange={this.onChange}
          btnEvents={btnFunc}
        />
        <input id='fileid' type='file' hidden multiple={false} />

        <Footer />
      </>
    );
  }
}


export default contextHoc(index);
