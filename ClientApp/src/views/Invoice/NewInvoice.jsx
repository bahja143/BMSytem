import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { Card, Row, Col } from "react-bootstrap";
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

class NewInvoice extends Component {
  state = {
    invoice: {
      id: 0,
      rentalId: "",
      amount: "",
      date: "",
      description: "",
    },
    rentals: [],
  };

  schema = Yup.object({
    id: Yup.number().label("Id"),
    rentalId: Yup.number().required().label("Rental"),
    amount: Yup.number().required().min(0).max(10000).label("Amount"),
    date: Yup.date().required().label("Date"),
    description: Yup.string().label("Description"),
  });

  render() {
    const { invoice, rentals } = this.state;

    return (
      <Card>
        <Card.Header>
          <Card.Title>
            {invoice.id === 0 ? "New Invoice" : "Update Invoice"}
          </Card.Title>
        </Card.Header>
        <Formik
          initialValues={invoice}
          enableReinitialize={true}
          validationSchema={this.schema}
          onSubmit={(invoice, { resetForm }) => {
            resetForm();
            this.setState({ invoice });
            this.handleSubmit(invoice);
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
                    <TextField
                      name="amount"
                      label="Amount"
                      required
                      type="number"
                    />
                  </Col>
                </Row>
                <Row>
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
  componentDidMount() {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };
    const { id } = this.props.match.params;

    if (id) {
      Services.get(Config.apiUrl + "/invoices/" + id, { headers: auth })
        .then(({ data }) => {
          this.setState({ invoice: data });
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
    const { invoice, rentals } = this.state;
    const customer = rentals.find((r) => r.id === invoice.rentalId).customer;
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    this.setState({
      invoice: {
        id: 0,
        rentalId: "",
        amount: "",
        date: invoice.date,
        description: "",
      },
    });

    Services.post(Config.apiUrl + "/invoices", invoice, { headers: auth })
      .then(({ data }) => {
        toast.success("Successful Registred.");

        Services.get(
          "https://gtsomapi.com/integration/api/Sms/SendByOne?Body=" +
            "Ali Gobanimo Business Center: Waxaa lagugu dalacay lacag dhan " +
            invoice.amount +
            " doller oo ah " +
            invoice.description +
            "&Phone=" +
            customer.tellphone +
            "&Security.Username=Agbc&Security.Password=$Gobanimo2021"
        );

        this.props.history.push("/invoice/print/" + data.id);
      })
      .catch((error) => {
        console.log(error);

        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("Something went wrong");
        }
      });
  };
}

export default NewInvoice;
