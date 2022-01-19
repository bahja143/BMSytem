import React from "react";
import "../../assets/scss/style.scss";
import Joi from "joi-browser";
import Services from "../../services/HttpServices";
import Logo from "../../assets/images/wsrd.jpg";
import { Alert } from "react-bootstrap";
import Config from "../../config/config.json";
import Loader from "react-fullscreen-loading";

class SignIn extends React.Component {
  state = {
    user: { username: "", password: "" },
    errors: "",
    loading: false,
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  render() {
    const { user, errors, loading } = this.state;
    return (
      <>
        {loading && <Loader loading loaderColor="#3498db" />}
        <div className="auth-wrapper">
          <div className="auth-content">
            <div className="auth-bg">
              <span className="r" />
              <span className="r s" />
              <span className="r s" />
              <span className="r" />
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-4">
                  <img src={Logo} alt="DPWorld Logo" width="130" />
                </div>
                <h3 className="mb-4">Hargeisa Group Hospital </h3>
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
      </>
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

export default SignIn;
