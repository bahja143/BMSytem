import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { Card, Row, Col } from "react-bootstrap";
import {
  SelectField,
  SubmitBtn,
  DateField,
  FieldArrayForm,
} from "../../components/Form";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";

class ServiceRequest extends Component {
  state = {
    service: {
      id: 0,
      categoryId: "",
      date: new Date(),
      items: [],
    },
    categories: [],
    items: [],
    allItems: [],
    balance: "",
  };

  schema = Yup.object({
    id: Yup.number().label("Id"),
    categoryId: Yup.number().required().label("Customer"),
    date: Yup.date().required().label("Start Date"),
    items: Yup.array().min(1, "Please select at least 1 item.").label("Items"),
  });

  render() {
    const { service, categories, items, balance, allItems } = this.state;

    return (
      <Card>
        <Card.Header>
          <Card.Title>
            {service.id === 0
              ? "New Service Request"
              : "Update Service Request"}
          </Card.Title>
        </Card.Header>
        <Formik
          initialValues={service}
          enableReinitialize={true}
          validationSchema={this.schema}
          onSubmit={(service, { resetForm }) => {
            resetForm();
            this.setState({ service });
            this.handleSubmit(service);
          }}
        >
          {() => (
            <>
              <Card.Body>
                <Row>
                  <Col>
                    <SelectField
                      name="categoryId"
                      label="Category"
                      options={categories.map((c) => ({
                        label: c.name,
                        value: c.id,
                      }))}
                      required
                    />
                  </Col>
                  <Col>
                    <DateField name="date" label="Date" required />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FieldArrayForm
                      name="items"
                      label="Select Item"
                      options={items.map((i) => ({
                        label: i.name + " (" + i.category.name + ")",
                        value: i.id,
                      }))}
                      allOptions={allItems.map((i) => ({
                        label: i.name + " (" + i.category.name + ")",
                        value: i.id,
                      }))}
                      balance={balance}
                      onAdd={this.handleAddBalance}
                      onSub={this.handleSubBalance}
                      onRemoveItem={this.handleRemoveItem}
                      onAddItem={this.handleAddItem}
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

  handleAddItem = (id) => {
    const { items, allItems } = this.state;

    this.setState({ items: [allItems.find((i) => i.id === id), ...items] });
  };
  handleRemoveItem = (id) => {
    const { items } = this.state;

    this.setState({ items: items.filter((i) => i.id !== id) });
  };
  handleAddBalance = (value) => {
    const { balance } = this.state;

    this.setState({ balance: parseFloat(balance) + parseFloat(value) });
  };
  handleSubBalance = (value) => {
    const { balance } = this.state;

    this.setState({ balance: balance - value });
  };
  componentDidMount() {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };
    const { id } = this.props.match.params;

    if (id) {
      Services.get(Config.apiUrl + "/services/" + id, {
        headers: auth,
      })
        .then(({ data }) => {
          this.setState({ service: data });
        })
        .catch((error) => {
          console.log(error);

          toast.error("Something went wrong");
        });
    }

    Services.get(Config.apiUrl + "/serviceCategories", { headers: auth })
      .then(({ data }) => {
        this.setState({ categories: data });
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });

    Services.get(Config.apiUrl + "/budget/balance", { headers: auth })
      .then(({ data }) => {
        this.setState({ balance: data });
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });

    Services.get(Config.apiUrl + "/items", { headers: auth })
      .then(({ data }) => {
        this.setState({ items: data, allItems: data });
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
  }
  handleSubmit = () => {
    const { service, allItems } = this.state;
    const auth = { Authorization: `bearer ${localStorage["token"]}` };
    service.items.map((i) => {
      i.amount = parseFloat(i.amount);

      return i;
    });

    this.setState({
      service: {
        id: 0,
        categoryId: "",
        date: new Date(),
        items: [],
      },
      items: allItems,
    });

    if (service.id === 0) {
      Services.post(Config.apiUrl + "/services", service, { headers: auth })
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
      Services.put(Config.apiUrl + "/services/" + service.id, service, {
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

export default ServiceRequest;
