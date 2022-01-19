import React from "react";
import Logo from "../../../../assets/images/agbc logo.png";

const NavLogo = () => {
  return (
    <React.Fragment>
      <div className="navbar-brand header-logo mb-2">
        <img src={Logo} alt="Logo" width={225} height={100} />
      </div>
    </React.Fragment>
  );
};

export default NavLogo;
