import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { Card, Row, Col } from "react-bootstrap";
import {
  SelectField,
  SubmitBtn,
  TextField,
  UploadFileField,
  DateField,
} from "../../components/Form";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";
import NewCustomerModal from "./NewCustomerModal";

class RentalForm extends Component {
  state = {
    rental: {
      id: 0,
      customerId: "",
      roomId: "",
      amount: "",
      startDate: "",
    },
    customers: [],
    rooms: [],
    file: "",
    show: false,
  };

  schema = Yup.object({
    id: Yup.number().label("Id"),
    customerId: Yup.number().required().label("Customer"),
    roomId: Yup.number().required().label("Room"),
    amount: Yup.number().required().min(0).max(10000).label("Amount"),
    startDate: Yup.date().required().label("Start Date"),
  });

  render() {
    const { rental, customers, rooms, file, show } = this.state;
    const fileImage = URL.createObjectURL(
      new Blob([this.handleStringToArray(file)], { type: "image/png" })
    );

    return (
      <>
        <NewCustomerModal
          show={show}
          setClose={this.handleClose}
          onPapulate={this.handlePapulate}
        />
        <Card>
          <Card.Header>
            <Card.Title>
              {rental.id === 0 ? "New Rental" : "Update Rental"}
            </Card.Title>
          </Card.Header>
          <Formik
            initialValues={rental}
            enableReinitialize={true}
            validationSchema={this.schema}
            onSubmit={(rental, { resetForm }) => {
              resetForm();
              this.setState({ rental });
              this.handleSubmit(rental);
            }}
          >
            {() => (
              <>
                <Card.Body>
                  <Row>
                    <Col>
                      <SelectField
                        name="customerId"
                        label="Customer"
                        options={customers.map((c) => ({
                          label: c.name,
                          value: c.id,
                        }))}
                        required
                        show={true}
                        onShow={this.handleShow}
                      />
                    </Col>
                    <Col>
                      <SelectField
                        name="roomId"
                        label="Room"
                        options={rooms.map((c) => ({
                          label: c.roomNumber,
                          value: c.id,
                        }))}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TextField
                        name="amount"
                        label="Amount"
                        required
                        type="number"
                      />
                    </Col>
                    <Col>
                      <DateField name="startDate" label="start Date" required />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <UploadFileField
                        name="document"
                        file="file"
                        label="Document"
                        type="file"
                        setFile={this.handleFile}
                      />
                      {file && (
                        <a href={fileImage} download>
                          <img
                            width="400"
                            height="400"
                            src={fileImage}
                            alt=""
                          />
                        </a>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="text-center">
                  <SubmitBtn />
                </Card.Footer>
              </>
            )}
          </Formik>
        </Card>
      </>
    );
  }

  handlePapulate = (customer) => {
    const { customers, rental } = this.state;
    rental.customerId = customer.id;

    this.setState({ customers: [customer, ...customers], rental });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };
  handleFile = (file) => {
    this.setState({ file });
  };
  componentDidMount() {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };
    const { id } = this.props.match.params;

    if (id) {
      Services.get(Config.apiUrl + "/rentals/" + id, { headers: auth })
        .then(({ data }) => {
          delete data.endDate;
          delete data.isCurrent;
          delete data.customer;
          delete data.room;

          this.setState({ file: data.document });
          delete data.document;
          this.setState({ rental: data });
        })
        .catch((error) => {
          console.log(error);

          toast.error("Something went wrong");
        });
    }

    Services.get(Config.apiUrl + "/customers", { headers: auth })
      .then(({ data }) => {
        this.setState({ customers: data });
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });

    Services.get(Config.apiUrl + "/rooms", { headers: auth })
      .then(({ data }) => {
        this.setState({ rooms: data });
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
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
  handleSubmit = () => {
    const { rental, file } = this.state;
    const auth = { Authorization: `bearer ${localStorage["token"]}` };
    const data = { ...rental, document: file };

    this.setState({
      rental: {
        id: 0,
        customerId: "",
        roomId: "",
        amount: "",
        startDate: rental.startDate,
      },
      file: "",
    });

    if (rental.id === 0) {
      Services.post(Config.apiUrl + "/rentals", data, { headers: auth })
        .then(() => {
          toast.success("Successful Registred.");
        })
        .catch((error) => {
          console.log(error);

          if (error.response && error.response.data) {
            toast.error(error.response.data);
          } else {
            toast.error("Something went wrong");
          }
        });
    } else {
      Services.put(Config.apiUrl + "/rentals/" + data.id, data, {
        headers: auth,
      })
        .then(() => {
          toast.info("Successful Updates.");
        })
        .catch((error) => {
          console.log(error);

          if (error.response && error.response.data) {
            toast.error(error.response.data);
          } else {
            toast.error("Something went wrong");
          }
        });
    }
  };
}

export default RentalForm;
