import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../../../abstract/header";
import Table from "../../../abstract/Table";
import Input from "../../../abstract/input";
import Footer from "../../../abstract/footer";
import axios from "axios";
import swal from 'sweetalert2'

export default class ViewWorkers extends Component {
  state = {
    search: "",
    message: "",
    rows: []
  };
  onChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  deleteWorker = id => {
    swal({
      title: '',
      text: 'Are you sure that you want to delete this worker',
      type: 'warning',
      showCancelButton: true,
    }).then((confirm) => {
      if (confirm.value) {

        axios("/workers", {
          method: "DELETE",
          data: {
            workerId: id
          }
        }).then(result => {
          this.getData().then(() => {
            swal({
              title: 'success',
              text: result.data.message,
              type: 'success',
              confirmButtonText: 'Cool'
            })
          });
        });
      }
    })
  };

  getData = async () => {
    try {
      const data = await axios("/workers");
      const finalData = data.data.workersData;
      let array = [["username", "date of birth", "action"]];
      if (finalData.length === 0){
        const msg = ' There is no workers yet !!';
        array =[];          
        this.setState({ message: msg,rows:array});
      } else{
        finalData.map(row =>
          array.push([
            row.username,
            row.date_of_birth.split("T")[0],
            <>
            <i className="fas fa-trash-alt" onClick={() => this.deleteWorker(row.id)} />
            <Link to="/worker/details">
              <i className="fas fa-info-circle" />
            </Link>
            </>
          ])
        );
        this.setState({ rows: array });
      }
    } catch (err) {
      console.log(err); // waiting for boundery error handling
    }
  };

  componentDidMount = () => {
    this.getData();
  };
  render() {
    return (
      <>
        <section className="section-view">
          <Header value="View Worker" />
          <Input
            label="Search"
            name="search"
            type="text"
            placeholder="Type Name of manager"
            width="300px"
            value={this.state.search}
            onChange={this.onChange}
          />
          <Header value="Workers" align="left" margin="0" />
          <Table rows={this.state.rows} />
          { this.state.rows.length === 0 &&
            <p className="error-msg"> <i class="far fa-surprise"></i>{this.state.message}</p>
          }
          <Footer />
        </section>
      </>
    );
  }
}
