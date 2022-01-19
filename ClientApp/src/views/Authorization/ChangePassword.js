import React from "react";
import JwtDecode from "jwt-decode";
import Joi from "joi-browser";
import Service from "../../services/HttpServices";
import { toast } from "react-toastify";
import Config from "../../config/config.json";
import Loader from "react-fullscreen-loading";

import "../../assets/scss/style.scss";

class ChangePassword extends React.Component {
  state = {
    changePassword: { currentPassword: "", newPassword: "", reType: "" },
    error: {},
    user: {},
    loading: false,
  };

  schema = {
    newPassword: Joi.string().required().label("New Password"),
    reType: Joi.string().required().label("Re-Type"),
    currentPassword: Joi.string().required().label("Current Password"),
  };

  render() {
    const { error, changePassword, loading } = this.state;

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
            <form onSubmit={this.handleSubmit}>
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="mb-4">Change Password</h5>
                  <div className="form-group">
                    <input
                      value={changePassword.currentPassword}
                      onChange={this.handleOnChange}
                      type="password"
                      className="form-control"
                      placeholder="Current Password"
                      name="currentPassword"
                    />
                    {error["currentPassword"] && (
                      <div className="text-danger">
                        {error["currentPassword"]}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      value={changePassword.newPassword}
                      onChange={this.handleOnChange}
                      type="password"
                      className="form-control"
                      placeholder="New Password"
                      name="newPassword"
                    />
                    {error["newPassword"] && (
                      <div className="text-danger">{error["newPassword"]}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      value={changePassword.reType}
                      onChange={this.handleOnChange}
                      type="password"
                      className="form-control"
                      placeholder="Re-Type New Password"
                      name="reType"
                    />
                    {error["reType"] && (
                      <div className="text-danger">{error["reType"]}</div>
                    )}
                  </div>
                  <button
                    disabled={this.handleValidate()}
                    className="btn btn-primary shadow-2 mb-4"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { changePassword, user } = this.state;
    this.setState({ loading: true });
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Service.get(
      Config.apiUrl +
        "/users/changePassword/" +
        user.id +
        "/" +
        changePassword.newPassword,
      { headers: auth }
    )
      .then(({ data }) => {
        this.props.history.push("/");
        toast.success("Successful changed password");
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");

        this.setState({ loading: false });
      });
  };
  handleOnValidateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schema = { [input.name]: this.schema[input.name] };
    const { error } = Joi.validate(obj, schema);

    if (error === null) return null;

    return error.details[0].message;
  };
  handleValidate = () => {
    const { changePassword, user } = this.state;
    const options = { abortEarly: false };
    const { error } = Joi.validate(changePassword, this.schema, options);
    const errors = {};

    if (error === null) {
      if (changePassword.currentPassword !== user.password) {
        errors["currentPassword"] = "Invalid password";

        return errors;
      } else if (changePassword.newPassword !== changePassword.reType) {
        errors["reType"] = "New password and Re-type password must match";

        return errors;
      } else {
        return null;
      }
    }

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleOnChange = ({ currentTarget: input }) => {
    const { changePassword, user, error } = this.state;
    changePassword[input.name] = input.value;
    const errorMessage = this.handleOnValidateProperty(input);

    if (errorMessage) error[input.name] = errorMessage;
    else delete error[input.name];

    if (input.name === "newPassword") {
      if (changePassword.currentPassword !== user.password)
        error["currentPassword"] = "Invalid password";
      else delete error["currentPassword"];
    }

    if (input.name === "reType" || input.name === "newPassword") {
      if (changePassword.newPassword !== changePassword.reType) {
        error["reType"] = "New password and Re-type password must match";
      } else delete error["reType"];
    }

    this.setState({ changePassword, error });
  };
  componentDidMount = async () => {
    const token = localStorage["token"];
    const user = JwtDecode(token);
    user.id = parseInt(user.id);
    const auth = { Authorization: `bearer ${token}` };

    Service.get(Config.apiUrl + "/users/" + user.id, { headers: auth })
      .then(({ data }) => {
        this.setState({ user: data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export default ChangePassword;
