import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../../abstract/header';
import Table from '../../../abstract/Table';
import Footer from '../../../abstract/footer';
import Input from "../../../abstract/input";

export default class Courses extends Component {
  state = {
    rows: [
      [
        'Course Name', 'Course Id', 'start', 'end', 'Action'
      ],
      [
        'Painting', '4', '04/05/2017', '04/05/2017', 
        <React.Fragment><i className="fas fa-trash-alt"></i><Link to="/courses/details">
        <i className="fas fa-info-circle"></i></Link></React.Fragment>
      ],
      [
        'Painting', '4', '04/05/2017', '04/05/2017', 
        <React.Fragment><i className="fas fa-trash-alt"></i><Link to="/courses/details">
        <i className="fas fa-info-circle"></i></Link></React.Fragment>
      ]
    ]
  }
  render() {
    return (
      <React.Fragment>
        <section className="section-view">
        <Header
        value='Courses'
        />
        <div className="search-bar">
          <Input
            label="Search"
            name="search"
            type="text"
            placeholder="Type Username"
            width="300px"
            value={this.state.search}
            onChange={this.onChange}
          />
        </div>
        <Header
        value='Courses'
        align='left'
        margin = '0'
        />
        <Table
          rows = {this.state.rows}
        />
        <Footer />
        </section>
      </React.Fragment>
    )
  }
}
