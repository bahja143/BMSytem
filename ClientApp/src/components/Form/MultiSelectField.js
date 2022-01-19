import React from "react";
import { useFormikContext } from "formik";
import Select from "react-select";
import FontAwesome from "react-fontawesome";

import { FormGroup, FormLabel } from "react-bootstrap";

const MulitSelectField = ({
  name,
  options,
  label,
  required,
  show,
  onShow,
  ...otherProps
}) => {
  const { setFieldTouched, touched, errors, setFieldValue } =
    useFormikContext();

  return (
    <FormGroup>
      <FormLabel>
        {label} {required && <span className="text-danger">*</span>}
      </FormLabel>
      <Select
        options={options}
        onChange={(e) => setFieldValue(name, e)}
        onBlur={() => setFieldTouched(name)}
        {...otherProps}
        isMulti
      />
      {show && (
        <a className="link mb-5" onClick={onShow}>
          <FontAwesome name="fas fa-plus-circle" />
          New customer
        </a>
      )}
      {errors[name] && touched[name] ? (
        <div className="text-danger">{errors[name]}</div>
      ) : null}
    </FormGroup>
  );
};

export default MulitSelectField;
