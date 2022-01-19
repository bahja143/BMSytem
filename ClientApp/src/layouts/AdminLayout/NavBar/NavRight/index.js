import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import JwtDecode from "jwt-decode";

import Avatar1 from "../../../../assets/images/user/avatar-1.jpg";

class NavRight extends Component {
  state = {
    listOpen: false,
    user: {},
  };

  render() {
    const { user } = this.state;

    return (
      <ul className="navbar-nav ml-auto">
        <li>
          <Dropdown alignRight={!this.props.rtlLayout} className="drp-user">
            <Dropdown.Toggle variant={"link"} id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight className="profile-notification">
              <div className="pro-head">
                <img src={Avatar1} className="img-radius" alt="User Profile" />
                <span>{user.name}</span>
                <a
                  onClick={this.handleLogout}
                  className="dud-logout"
                  title="Logout"
                >
                  <i className="feather icon-log-out" />
                </a>
              </div>
              <ul className="pro-body">
                <li>
                  <a href="/user/profile" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </a>
                </li>

                <li>
                  <a href="/auth/changepassword" className="dropdown-item">
                    <i className="feather icon-lock" /> Change Password
                  </a>
                </li>
              </ul>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    );
  }

  handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/signin";
  };
  componentDidMount = () => {
    const token = localStorage.getItem("token");

    try {
      const user = JwtDecode(token);

      this.setState({ user });
    } catch (error) {
      window.location.href = "/auth/signin";
    }
  };
}

export default NavRight;
