import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { Card, Row, Col } from "react-bootstrap";
import {
  SubmitBtn,
  TextField,
  TextAreaField,
  DateField,
} from "../../components/Form";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";

class BudgetForm extends Component {
  state = {
    budget: {
      id: 0,
      amount: "",
      description: "",
      date: "",
    },
  };

  schema = Yup.object({
    id: Yup.number().label("Id"),
    amount: Yup.number().required().min(1).max(10000).label("Amount"),
    description: Yup.string(),
    date: Yup.date().required().label("Date"),
  });

  render() {
    const { budget } = this.state;

    return (
      <Card>
        <Card.Header>
          <Card.Title>Budget Form</Card.Title>
        </Card.Header>
        <Formik
          initialValues={budget}
          enableReinitialize={true}
          validationSchema={this.schema}
          onSubmit={(budget, { resetForm }) => {
            resetForm();
            this.setState({ budget });
            this.handleSubmit(budget);
          }}
        >
          {() => (
            <>
              <Card.Body>
                <Row>
                  <Col>
                    <TextField
                      name="amount"
                      label="Amount"
                      type="number"
                      required
                    />
                  </Col>
                  <Col>
                    <DateField name="date" label="Date" required />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextAreaField name="description" label="Description" />
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
      Services.get(Config.apiUrl + "/budgets/" + id, { headers: auth })
        .then(({ data }) => {
          this.setState({ budget: data });
        })
        .catch((error) => {
          console.log(error);

          toast.error("Something went wrong");
        });
    }
  }
  handleSubmit = () => {
    const { budget } = this.state;
    const auth = { Authorization: `bearer ${localStorage["token"]}` };
    const data = { ...budget };

    this.setState({
      budget: {
        id: 0,
        amount: "",
        description: "",
        date: "",
      },
    });

    if (budget.id === 0) {
      Services.post(Config.apiUrl + "/budgets", data, { headers: auth })
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
      Services.put(Config.apiUrl + "/budgets/" + data.id, data, {
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

export default BudgetForm;
