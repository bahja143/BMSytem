import React from "react";

const AuthGuard = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthGuard;
