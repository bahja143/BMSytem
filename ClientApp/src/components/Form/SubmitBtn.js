import React from "react";
import { useFormikContext } from "formik";

import { Button } from "react-bootstrap";

const SubmitBtn = ({ disabled }) => {
  const { handleSubmit } = useFormikContext();

  return (
    <Button type="submit" onClick={() => handleSubmit()} disabled={disabled}>
      Sibmit
    </Button>
  );
};

export default SubmitBtn;
