import React from "react";
import { useFormikContext } from "formik";

import { FormGroup, FormLabel } from "react-bootstrap";

const TextAreaField = ({ name, label, required, ...otherProps }) => {
  const { handleChange, setFieldTouched, touched, errors, values } =
    useFormikContext();

  return (
    <FormGroup>
      <FormLabel>
        {label} {required && <span className="text-danger">*</span>}
      </FormLabel>
      <textarea
        className="form-control"
        onChange={handleChange(name)}
        onBlur={() => setFieldTouched(name)}
        value={values[name]}
        {...otherProps}
      />
      {errors[name] && touched[name] ? (
        <div className="text-danger">{errors[name]}</div>
      ) : null}
    </FormGroup>
  );
};

export default TextAreaField;
