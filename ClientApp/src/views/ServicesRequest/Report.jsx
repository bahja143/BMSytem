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
import Filter from "../../Utility/servicesFilter";
import ViewItemsModal from "./ViewItemsModal";

class Report extends Component {
  state = {
    tableHeaders: [
      { label: "Category", field: "category" },
      { label: "Total expenses", field: "total" },
      { label: "Date", field: "date" },
      { label: "", field: "edit" },
    ],
    services: [],
    categories: [],
    rooms: [],
    filter: {
      name: "All",
      date: "",
    },
    show: false,
    items: [],
    allItems: [],
  };

  render() {
    const {
      tableHeaders,
      services: allservices,
      categories,
      filter,
      show,
      items,
      allItems,
    } = this.state;

    const services = Filter(allservices, filter);

    return (
      <>
        <ViewItemsModal
          items={items}
          options={allItems}
          show={show}
          onClose={this.handleCloseModal}
        />
        <Card>
          <Card.Header>
            <Card.Title>
              Services Report
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
                  data={services.map((r) => ({
                    id: r.id,
                    category: r.category,
                    date: new Date(r.Date).toDateString(),
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
                <FormLabel>Category</FormLabel>
                <Select
                  value={categories
                    .filter((c) => c.name === filter.name)
                    .map((c) => ({ label: c.name, value: c.id }))}
                  onChange={(e) =>
                    this.handleOnChangeFilter({
                      currentTarget: { name: "name", value: e.label },
                    })
                  }
                  options={categories.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                />
              </Col>
              <Col>
                <FormLabel>Date</FormLabel>
                <DateTime
                  onChange={(e) =>
                    this.handleOnChangeFilter({
                      currentTarget: { name: "date", value: e._d },
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
                rows: services.map((ren) => {
                  ren.edit = (
                    <>
                      <a
                        className="ml-4"
                        onClick={() => this.handleShowModal(ren)}
                      >
                        <Fontawesome
                          className="fas fa-eye"
                          style={{ fontSize: 17 }}
                          name="edit"
                        />
                      </a>
                    </>
                  );
                  ren.total =
                    "$" +
                    ren.items.map((r) => r.amount).reduce((a, b) => a + b, 0);
                  ren.date = new Date(ren.date).toDateString();

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

  handleCloseModal = () => {
    this.setState({ show: false });
  };
  handleShowModal = (service) => {
    console.log(service.items);
    this.setState({ show: true, items: service.items });
  };
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

    Services.get(Config.apiUrl + "/services", { headers: auth }).then(
      ({ data }) => {
        this.setState({
          services: data.map((s) => {
            s.category = s.category.name;

            return s;
          }),
        });
      }
    );

    Services.get(Config.apiUrl + "/serviceCategories", { headers: auth }).then(
      ({ data }) => {
        this.setState({
          categories: [{ id: "All", name: "All" }, ...data],
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

    Services.get(Config.apiUrl + "/items", { headers: auth }).then(
      ({ data }) => {
        this.setState({
          allItems: data,
        });
      }
    );
  }
}

export default Report;
