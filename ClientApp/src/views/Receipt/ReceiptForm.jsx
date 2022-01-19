import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { Card, Row, Col, FormLabel } from "react-bootstrap";
import {
  SelectField,
  SubmitBtn,
  TextField,
  TextAreaField,
  DateField,
} from "../../components/Form";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";

class ReceiptForm extends Component {
  state = {
    receipt: {
      id: 0,
      rentalId: "",
      amount: "",
      type: "",
      date: new Date(),
      description: "",
    },
    rentals: [],
    balance: { rentalId: "", amount: "" },
    initialErrors: {},
    typesOfPayment: [
      { label: "Cash", value: "Cash" },
      { label: "Zaad", value: "Zaad" },
      { label: "E-Dahab", value: "E-Dahab" },
      { label: "Check", value: "Check" },
      { label: "Bank Account", value: "Bank Account" },
    ],
  };

  schema = Yup.object({
    id: Yup.number().label("Id"),
    rentalId: Yup.number().required().label("Rental"),
    amount: Yup.number().required().min(1).max(10000).label("Amount"),
    date: Yup.date().required().label("Date"),
    description: Yup.string().label("Description"),
  });

  render() {
    const { receipt, rentals, balance, initialErrors, typesOfPayment } =
      this.state;

    return (
      <Card>
        <Card.Header>
          <Card.Title>
            {receipt.id === 0 ? "Receipt form" : "Update Receipt"}
          </Card.Title>
        </Card.Header>
        <Formik
          initialValues={receipt}
          initialErrors={initialErrors}
          validate={(e) => this.handleBalance(e)}
          enableReinitialize={true}
          validationSchema={this.schema}
          onSubmit={(receipt, { resetForm }) => {
            resetForm();
            this.setState({ receipt });
            this.handleSubmit(receipt);
          }}
        >
          {() => (
            <>
              <Card.Body>
                <Row>
                  <Col>
                    <SelectField
                      name="rentalId"
                      label="Rental"
                      options={rentals.map((c) => ({
                        label: c.customer.name + " (" + c.room.roomNumber + ")",
                        value: c.id,
                      }))}
                      required
                    />
                  </Col>
                  <Col>
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
                        <FormLabel>Balance</FormLabel>
                        <input
                          className="form-control"
                          disabled
                          value={balance.amount}
                        />
                        {initialErrors["amount"] && (
                          <div className="text-danger">
                            {initialErrors["amount"]}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <SelectField
                      name="type"
                      label="Type of payment"
                      options={typesOfPayment}
                      required
                    />
                  </Col>
                  <Col>
                    <DateField name="date" label="Date" required />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextAreaField
                      name="description"
                      label="Description"
                      required
                    />
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
    );
  }

  handleBalance = (receipt) => {
    let { balance, initialErrors } = this.state;
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    if (receipt.rentalId !== "" && balance.rentalId !== receipt.rentalId) {
      balance.rentalId = receipt.rentalId;

      Services.get(Config.apiUrl + "/balance/" + receipt.rentalId, {
        headers: auth,
      })
        .then(({ data }) => {
          balance.amount = data;
          this.setState({ balance });
        })
        .catch((error) => {
          console.log(error);

          toast.error("Something went wrong");
        });

      this.setState({ balance });
    }

    if (receipt.amount !== "") {
      if (receipt.amount > balance.amount) {
        initialErrors.amount = "Check balance!";

        this.setState({ initialErrors });
      } else {
        delete initialErrors.amount;

        this.setState({ initialErrors });
      }
    }
  };
  componentDidMount() {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };
    const { id } = this.props.match.params;

    if (id) {
      Services.get(Config.apiUrl + "/receipts/" + id, { headers: auth })
        .then(({ data }) => {
          this.setState({ receipt: data });
        })
        .catch((error) => {
          console.log(error);

          toast.error("Something went wrong");
        });
    }

    Services.get(Config.apiUrl + "/rentals", { headers: auth })
      .then(({ data }) => {
        this.setState({ rentals: data.filter((r) => r.isCurrent) });
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
  }
  handleSubmit = () => {
    const { receipt, balance, initialErrors, rentals } = this.state;
    const customer = rentals.find((r) => r.id === receipt.rentalId).customer;
    const totalRemaning = balance.amount;
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    if (initialErrors["amount"]) return;

    balance.amount = "";
    this.setState({
      receipt: {
        id: 0,
        rentalId: "",
        amount: "",
        date: receipt.date,
        description: "",
      },
      balance: { rentalId: "", amount: "" },
    });

    if (receipt.id === 0) {
      Services.post(Config.apiUrl + "/receipts", receipt, { headers: auth })
        .then(() => {
          toast.success("Successful Registred.");

          Services.get(
            "https://gtsomapi.com/integration/api/Sms/SendByOne?Body=" +
              "Ali Gobanimo Business Center: Waxaa bixisay lacag dhan " +
              receipt.amount +
              " doller. waxana kugu harray lacag dhan " +
              (totalRemaning - receipt.amount) +
              " dollar" +
              "&Phone=" +
              customer.tellphone +
              "&Security.Username=Agbc&Security.Password=$Gobanimo2021"
          );
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
      Services.put(Config.apiUrl + "/receipts/" + receipt.id, receipt, {
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

export default ReceiptForm;
