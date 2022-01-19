import React, { Component } from "react";
import Services from "../../services/HttpServices";
import jwtDecode from "jwt-decode";
import { Card } from "react-bootstrap";
import joi from "joi-browser";
import { toast } from "react-toastify";
import Config from "../../config/config.json";

class Profile extends Component {
  state = {
    user: {
      id: 0,
      name: "",
      username: "",
      role: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    id: joi.number().allow(0),
    name: joi.string().min(3).required().label("Name"),
    username: joi.string().required().label("Username"),
    role: joi.string().required().label("Role"),
    password: joi.string().required().label("Password"),
    status: joi.any(),
    notar: joi.any(),
    notary: joi.any(),
    notarId: joi.any(),
  };

  render() {
    const { user, errors } = this.state;

    return (
      <>
        <Card>
          <Card.Header>
            <Card.Title>Profile</Card.Title>
          </Card.Header>
          <form onSubmit={this.handleSubmit}>
            <Card.Body>
              <div className="row form-group">
                <div className="col-12">
                  <label htmlFor="name">Name</label>
                  <input
                    onChange={this.handleChange}
                    value={user.name}
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                  />
                  {errors["name"] && (
                    <div className="text-danger">{errors["name"]}</div>
                  )}
                </div>
              </div>
              <div className="row form-group">
                <div className="col-6">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    name="username"
                    value={user.username}
                    disabled={true}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="role">Role</label>
                  <input
                    id="role"
                    name="role"
                    value={user.role}
                    disabled={true}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={this.validate()}
                >
                  Save changes
                </button>
              </div>
            </Card.Footer>
          </form>
        </Card>
      </>
    );
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    const currentUser = jwtDecode(token);
    this.setState({ loading: true });
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.get(Config.apiUrl + "/users/" + currentUser.id, { headers: auth })
      .then(({ data }) => {
        this.setState({ user: data, loading: false });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
      });
  }
  validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schem = { [input.name]: this.schema[input.name] };
    const { error } = joi.validate(obj, schem);

    if (!error) return null;

    return error.details[0].message;
  };
  validate = () => {
    const user = { ...this.state.user };
    const errors = {};
    const option = { abortEarly: false };
    const { error } = joi.validate(user, this.schema, option);

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = (e) => {
    e.preventDefault();

    const user = { ...this.state.user };
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    if (errors) return;

    this.setState({ loading: true });

    Services.put(Config.apiUrl + "/users/" + user.id, user, { headers: auth })
      .then(() => {
        Services.post(Config.apiUrl + "/token", user)
          .then(({ data }) => {
            localStorage.setItem("token", data.token);
            window.location = "/";
          })
          .catch((error) => {
            if (error.response.status === 400 && error.response.data) {
              const errors = { ...this.state.errors };
              errors["username"] = error.response.data;

              this.setState({ errors, loading: false });
            }
          });
      })
      .catch(() => {
        toast.error("Something went wrong.");
      });
  };
  handleChange = ({ currentTarget: input }) => {
    const user = { ...this.state.user };
    user[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ user, errors });
  };
}

export default Profile;
