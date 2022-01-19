import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { Card, Row, Col } from "react-bootstrap";
import {
  SubmitBtn,
  TextAreaField,
  MultiSelectField,
  DateField,
} from "../../components/Form";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";

class MessageForm extends Component {
  state = {
    message: {
      id: 0,
      rentalId: "",
      tellphone: "",
      date: new Date(),
      message: "",
    },
    rentals: [],
  };

  schema = Yup.object({
    id: Yup.number().label("Id"),
    rentalId: Yup.array().label("Customer"),
    tellphone: Yup.string(),
    date: Yup.date().required().label("Date"),
    message: Yup.string().min(5).required().label("Message"),
  });

  render() {
    const { message, rentals } = this.state;

    return (
      <Card>
        <Card.Header>
          <Card.Title>New Message</Card.Title>
        </Card.Header>
        <Formik
          initialValues={message}
          enableReinitialize={true}
          validationSchema={this.schema}
          onSubmit={(message, { resetForm }) => {
            // resetForm();
            this.setState({ message });
            this.handleSubmit();
          }}
        >
          {() => (
            <>
              <Card.Body>
                <Row>
                  <Col>
                    <MultiSelectField
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
                        <DateField name="date" label="Date" required disabled />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextAreaField
                      name="message"
                      label="Message"
                      rows={10}
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
    const auth = { Authorization: `bearer ${localStorage["token"]}` };
    const { message, rentals } = this.state;
    message.tellphones = message.rentalId.map(
      (m) => rentals.find((r) => r.id === m.value)?.customer.tellphone
    );

    this.setState({
      message: {
        id: 0,
        rentalId: message.rentalId,
        date: new Date(),
        message: "",
      },
    });

    Services.post("https://gtsomapi.com/integration/api/Sms/SendByGroup", {
      body: message.message,
      phones: message.tellphones,
      security: {
        username: "Agbc",
        password: "$Gobanimo2021",
      },
    })
      .then(() => {
        toast.success("Message sent");
        const customerIds = message.rentalId.map(
          (r) => rentals.find((re) => re.id === r.value).customer.id
        );

        customerIds.forEach((id) => {
          Services.post(
            Config.apiUrl + "/messages",
            { customerId: id, body: message.message, date: message.date },
            {
              headers: auth,
            }
          );
        });
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

export default MessageForm;
