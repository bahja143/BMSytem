import React from "react";
import { useFormikContext } from "formik";

import { FormGroup, FormLabel } from "react-bootstrap";
import DateTime from "react-datetime";

const DateField = ({ name, label, required }) => {
  const { setFieldTouched, touched, errors, values, setFieldValue } =
    useFormikContext();

  return (
    <FormGroup>
      <FormLabel>
        {label} {required && <span className="text-danger">*</span>}
      </FormLabel>
      <DateTime
        onChange={(e) => setFieldValue(name, e._d)}
        onBlur={() => setFieldTouched(name)}
        value={new Date(values[name])}
        timeFormat={false}
      />
      {errors[name] && touched[name] ? (
        <div className="text-danger">{errors[name]}</div>
      ) : null}
    </FormGroup>
  );
};

export default DateField;
