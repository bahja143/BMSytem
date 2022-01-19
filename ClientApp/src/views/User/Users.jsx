import React, { Component } from "react";
import { Card, Button, Row } from "react-bootstrap";
import { MDBDataTableV5 } from "mdbreact";
import Fontawesome from "react-fontawesome";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import Services from "../../services/HttpServices";
import Config from "../../config/config.json";
import UserModal from "././UserModal";
import JwtDecode from "jwt-decode";

class Users extends Component {
  state = {
    user: {
      id: 0,
      name: "",
      username: "",
      role: "",
      password: "",
      status: true,
    },
    users: [],
    errors: {},
    show: false,
    tableHeaders: [
      { label: "Name", field: "name" },
      { label: "Username", field: "username" },
      { label: "Role", field: "role" },
      { label: "", field: "edit" },
    ],
  };

  schema = {
    id: Joi.any(),
    name: Joi.string().required().label("Name"),
    username: Joi.string().required().label("Username"),
    role: Joi.string().required().label("Role"),
    status: Joi.any(),
    password: Joi.string().required().label("Password"),
  };

  render() {
    const { users, tableHeaders, show, user, errors } = this.state;

    return (
      <>
        <UserModal
          show={show}
          onClose={this.handleClose}
          onChange={this.handleOnChange}
          user={user}
          onSubmit={this.handleSubmit}
          errors={errors}
          validate={this.validate}
        />
        <Card>
          <Card.Header>
            <Row className="float-right">
              <Button onClick={this.handleShow}>
                <Fontawesome
                  name="plus-circle"
                  className="fas fa-plus-circle"
                />{" "}
                New User
              </Button>
            </Row>
            <Card.Title>Users</Card.Title>
          </Card.Header>
          <Card.Body>
            <MDBDataTableV5
              hover
              entriesOptions={[10, 25, 50, 100]}
              entries={10}
              pagesAmount={10}
              data={{
                columns: tableHeaders,
                rows: users.map((user) => {
                  user.edit = user.status ? (
                    <React.Fragment>
                      <button
                        onClick={() => this.handleStatus(user.id)}
                        className="btn btn-link"
                      >
                        Active
                      </button>
                      <button
                        className="btn btn-link"
                        onClick={() => this.handleUpdate(user)}
                      >
                        <Fontawesome
                          className="fas fa-edit text-primary"
                          style={{ fontSize: 17 }}
                          name="edit"
                        />
                      </button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <button
                        onClick={() => this.handleStatus(user.id)}
                        className="btn btn-link"
                      >
                        Not active
                      </button>
                      <button
                        className="btn btn-link"
                        onClick={() => this.handleUpdate(user)}
                      >
                        <Fontawesome
                          className="fas fa-edit text-primary"
                          style={{ fontSize: 17 }}
                          name="edit"
                        />
                      </button>
                    </React.Fragment>
                  );

                  return user;
                }),
              }}
              pagingTop
              searchTop
              searchBottom={false}
            />
          </Card.Body>
        </Card>
      </>
    );
  }

  handleStatus = (id) => {
    const { users } = this.state;
    this.setState({ loader: true });
    const token = localStorage["token"];
    const auth = { Authorization: `bearer ${token}` };

    Services.get(Config.apiUrl + "/userStatus/" + id, { headers: auth })
      .then(({ data }) => {
        this.setState({
          users: users.map((u) => {
            if (u.id === id) u.status = data.status;
            return u;
          }),
          loader: false,
        });
      })
      .catch((error) => {
        console.log(error);

        this.setState({ loader: false });
        toast.error("Something went wrong");
      });
  };
  handleUpdate = (row) => {
    const user = { ...row };
    delete user.edit;

    this.setState({ user, show: true });
  };
  handlePapulate = (user) => {
    const { users } = this.state;

    this.setState({
      users: [user, ...users.filter((f) => f.id !== user.id)],
    });
  };
  validateOnProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schema = { [input.name]: this.schema[input.name] };
    const { error } = Joi.validate(obj, schema);

    if (!error) return null;

    return error.details[0].message;
  };
  validate = () => {
    const { user } = this.state;
    const errors = {};
    const { error } = Joi.validate(user, this.schema, { abortEarly: false });

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { user } = this.state;
    const errors = this.validate();
    const token = localStorage["token"];
    const auth = { Authorization: `bearer ${token}` };

    this.setState({ errors: errors || {} });

    if (errors) return;

    this.handleClose();
    this.setState({ loader: true });

    if (user.id === 0) {
      Services.post(Config.apiUrl + "/users", user, { headers: auth })
        .then(({ data }) => {
          this.setState({ loader: false });
          toast.success("Successfull Registred");
          this.handlePapulate(data);

          this.setState({
            user: {
              id: 0,
              name: "",
              username: "",
              role: "",
              password: "",
              status: true,
            },
          });
        })
        .catch((error) => {
          this.setState({ loader: false });
          console.log(error);
          this.handleShow();

          if (error.response && error.response.data) {
            toast.error(error.response.data);
          } else {
            toast.error("Something went wrong");
          }
        });
    } else {
      Services.put(Config.apiUrl + "/users/" + user.id, user, { headers: auth })
        .then(({ data }) => {
          this.setState({ loader: false });
          toast.info("Successfull Update");
          this.handlePapulate(data);

          this.setState({
            user: {
              id: 0,
              name: "",
              username: "",
              role: "",
              password: "",
              status: true,
            },
          });
        })
        .catch((error) => {
          this.setState({ loader: false });
          console.log(error);
          this.handleShow();

          toast.error("Something went wrong");
        });
    }
  };
  handleOnChange = ({ currentTarget: input }) => {
    const { user, errors } = this.state;
    user[input.name] = input.value;
    const errorMessage = this.validateOnProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ user });
  };
  componentDidMount() {
    this.setState({ loader: true });
    const token = localStorage["token"];
    const user = token ? JwtDecode(token) : "";
    const auth = { Authorization: `bearer ${token}` };

    Services.get(Config.apiUrl + "/users", { headers: auth })
      .then(({ data }) => {
        this.setState({
          users: data.filter((u) => u.id != user.id),
          loader: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loader: false });

        toast.error("Something went wrong");
      });
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };
}

export default Users;
