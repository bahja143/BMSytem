import React, { Component } from "react";
import { Card, Row, Col, FormLabel } from "react-bootstrap";
import Fontawesome from "react-fontawesome";
import { MDBDataTableV5 } from "mdbreact";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import PrinTible from "../../Utility/printible";
import ReactToPrint from "react-to-print";
import Select from "react-select";
import DateTime from "react-datetime";
import Filter from "../../Utility/rentalsFilter";

class Report extends Component {
  state = {
    tableHeaders: [
      { label: "Customer", field: "name" },
      { label: "Tellphone", field: "tellphone" },
      { label: "Room No", field: "roomNumber" },
      { label: "Amount", field: "amount" },
      { label: "Start Date", field: "startDate" },
      { label: "Last Date", field: "lastDate" },
      { label: "", field: "edit" },
    ],
    rentals: [],
    customers: [],
    rooms: [],
    filter: {
      name: "All",
      roomNumber: "All",
      tellphone: "",
      startDate: "",
    },
  };

  render() {
    const {
      tableHeaders,
      rentals: allrentals,
      customers,
      rooms,
      filter,
    } = this.state;

    const rentals = Filter(
      allrentals.map((r) => {
        r.name = r.customer.name;
        r.tellphone = r.customer.tellphone;
        r.roomNumber = r.room.roomNumber;

        return r;
      }),
      filter
    );

    return (
      <>
        <Card>
          <Card.Header>
            <Card.Title>
              Rental Report
              <ReactToPrint
                trigger={() => (
                  <button
                    type="button"
                    className="btn d-print-none float-right"
                  >
                    <Fontawesome
                      className="fas fa-print"
                      name="print"
                      style={{ fontSize: 25 }}
                    />
                  </button>
                )}
                content={() => {
                  return this.componentRef;
                }}
              />
              <div className="d-none">
                <PrinTible
                  data={rentals.map((r) => ({
                    id: r.id,
                    name: r.customer.name,
                    tellphone: r.customer.tellphone,
                    roomNumber: r.room.roomNumber,
                    amount: "$" + r.amount,
                    startDate: new Date(r.startDate).toDateString(),
                    lastDate: r.endDate ? (
                      new Date(r.endDate).toDateString()
                    ) : (
                      <span className="badge badge-success">Current</span>
                    ),
                  }))}
                  theaders={tableHeaders
                    .filter((t) => t.label !== "")
                    .map((h) => h.label)}
                  title="Rental Report"
                  ref={(el) => (this.componentRef = el)}
                />
              </div>
            </Card.Title>
            <Row>
              <Col>
                <FormLabel>Customer</FormLabel>
                <Select
                  value={customers
                    .filter((c) => c.name === filter.name)
                    .map((c) => ({ label: c.name, value: c.id }))}
                  onChange={(e) =>
                    this.handleOnChangeFilter({
                      currentTarget: { name: "name", value: e.label },
                    })
                  }
                  options={customers.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                />
              </Col>
              <Col>
                <FormLabel>Room</FormLabel>
                <Select
                  value={rooms
                    .filter((c) => c.roomNumber === filter.roomNumber)
                    .map((c) => ({ label: c.roomNumber, value: c.id }))}
                  onChange={(e) =>
                    this.handleOnChangeFilter({
                      currentTarget: { name: "roomNumber", value: e.label },
                    })
                  }
                  options={rooms.map((c) => ({
                    label: c.roomNumber,
                    value: c.id,
                  }))}
                />
              </Col>
              <Col>
                <FormLabel>Tellphone</FormLabel>
                <input
                  onChange={this.handleOnChangeFilter}
                  value={filter.tellphone}
                  name="tellphone"
                  className="form-control"
                />
              </Col>
              <Col>
                <FormLabel>Start Date</FormLabel>
                <DateTime
                  onChange={(e) =>
                    this.handleOnChangeFilter({
                      currentTarget: { name: "startDate", value: e._d },
                    })
                  }
                  closeOnSelect={true}
                  timeFormat={false}
                />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <MDBDataTableV5
              hover
              entriesOptions={[10, 25, 50, 100]}
              entries={10}
              pagesAmount={10}
              data={{
                columns: tableHeaders,
                rows: rentals.map((ren) => {
                  ren.name = ren.customer.name;
                  ren.amount = "$" + ren.amount;
                  ren.tellphone = ren.customer.tellphone;
                  ren.roomNumber = ren.room.roomNumber;
                  ren.startDate = new Date(ren.startDate).toDateString();
                  ren.lastDate = ren.endDate ? (
                    new Date(ren.endDate).toDateString()
                  ) : (
                    <span className="badge badge-success">Current</span>
                  );
                  return ren;
                }),
              }}
              pagingTop
              searchTop={false}
              searchBottom={false}
            />
          </Card.Body>
        </Card>
      </>
    );
  }

  handleOnChangeFilter = ({ currentTarget: input }) => {
    const { filter } = this.state;
    filter[input.name] = input.value;

    this.setState({ filter });
  };
  handleCloseModal = () => {
    this.setState({ show: false });
  };
  handleViewModal = (death) => {
    this.setState({ death, show: true });
  };
  componentDidMount() {
    this.setState({ loading: true });
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.get(Config.apiUrl + "/rentals", { headers: auth }).then(
      ({ data }) => {
        this.setState({
          rentals: data,
        });
      }
    );

    Services.get(Config.apiUrl + "/customers", { headers: auth }).then(
      ({ data }) => {
        this.setState({
          customers: [{ id: "All", name: "All" }, ...data],
        });
      }
    );

    Services.get(Config.apiUrl + "/rooms", { headers: auth }).then(
      ({ data }) => {
        this.setState({
          rooms: [{ id: "All", roomNumber: "All" }, ...data],
        });
      }
    );
  }
}

export default Report;
