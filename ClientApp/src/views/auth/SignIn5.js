import React, { Component } from "react";

import Breadcrumb from "../../layouts/AdminLayout/Breadcrumb";
import back4 from "../../assets/images/bg-images/bg4.jpg";
import Logo from "../../assets/images/agbc logo - trans.png";

import { Alert } from "react-bootstrap";
import Config from "../../config/config.json";
import Joi from "joi-browser";
import Services from "../../services/HttpServices";

class SignIn5 extends Component {
  state = {
    user: { username: "", password: "" },
    errors: "",
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  render() {
    const { user, errors } = this.state;

    return (
      <React.Fragment>
        <Breadcrumb />
        <div
          className="auth-wrapper aut-bg-img"
          style={{
            backgroundImage: `url(${back4})`,
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
          }}
        >
          <div className="auth-content">
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-4">
                  <img src={Logo} alt="Logo" width={225} height={130} />
                </div>
                <h3 className="mb-4">Sign in</h3>
                {errors && (
                  <Alert variant="danger">Invalid username or password</Alert>
                )}
                <form onSubmit={this.handleSubmit}>
                  <div className="input-group mb-3">
                    <input
                      value={user.username}
                      onChange={this.handleOnChange}
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="Username"
                    />
                  </div>
                  <div className="input-group mb-4">
                    <input
                      value={user.password}
                      onChange={this.handleOnChange}
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={this.validate()}
                    className="btn btn-primary shadow-2 mb-4"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleOnChange = ({ currentTarget: input }) => {
    const user = { ...this.state.user };
    user[input.name] = input.value;

    this.setState({ user });
  };
  validate = () => {
    const user = { ...this.state.user };
    const option = { abortEarly: false };
    const errors = {};
    const { error } = Joi.validate(user, this.schema, option);

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const user = { ...this.state.user };
    const errors = this.validate();

    this.setState({ errors: errors });

    if (errors) return;

    this.setState({ loading: true });

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
  };
}

export default SignIn5;
