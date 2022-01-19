import React from "react";
import { useFormikContext } from "formik";
import Select from "react-select";
import FontAwesome from "react-fontawesome";

import { FormGroup, FormLabel } from "react-bootstrap";

const SelectField = ({
  name,
  options,
  label,
  required,
  show,
  onShow,
  ...otherProps
}) => {
  const { setFieldTouched, touched, errors, values, setFieldValue } =
    useFormikContext();

  return (
    <FormGroup>
      <FormLabel>
        {label} {required && <span className="text-danger">*</span>}
      </FormLabel>
      <Select
        value={options.filter((f) => f.value === values[name])}
        options={options}
        onChange={(e) => setFieldValue(name, e.value)}
        onBlur={() => setFieldTouched(name)}
        {...otherProps}
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

export default SelectField;
