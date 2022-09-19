import React, { Component } from "react";
import { Card, Table } from "react-bootstrap";
// import Logo from "../assets/images/agbc logo (1).png";

class PrinTible extends Component {
  state = {
    count: 1,
  };

  render() {
    const date = new Date();
    const { title, data, theaders } = this.props;

    return (
      <Card>
        <Card.Header>
          <Card.Title>
            <div className="row">
              <div className="col-12">
                {/* <img src={Logo} width="200" height="150" alt="Logo" /> */}
                <h3 className="mt-2">
                  BMS
                  <p className="float-right">{date.toDateString()}</p>
                </h3>
                <h5 className="mt-4">{title}</h5>
              </div>
            </div>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Table
            ref="tbl"
            striped
            hover
            responsive
            className="table table-condensed"
          >
            <thead>
              <tr>
                <th>#</th>
                {theaders.map((h) => (
                  <th>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>{this.handleTableBody(data)}</tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }

  handleStringToArray = (str = "") => {
    const array = str.split(",");
    const buffer = [];

    for (let index = 0; index < array.length; index++) {
      buffer[index] = array[index];
    }

    const data = new Uint8Array(buffer);

    return data;
  };
  handleTableBody = (data) => {
    let id = 1;
    for (let c of data) {
      c.id = id;
      id++;
    }

    return data.map((d) => (
      <tr key={d.id}>
        {this.handleRowData(d).map((c) => (
          <td
            style={{
              height: "12",
              padding: "6 24",
              border: "1px solid #eaeaea",
            }}
          >
            {c}
          </td>
        ))}
      </tr>
    ));
  };
  handleRowData = (row) => {
    const colomns = [];

    for (let col in row) {
      colomns.push(row[col]);
    }

    return colomns;
  };
}

export default PrinTible;
