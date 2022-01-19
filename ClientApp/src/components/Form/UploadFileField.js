import React from "react";
import { useFormikContext } from "formik";

import { FormGroup, FormLabel } from "react-bootstrap";

const TextFileField = ({
  name,
  file,
  setFile,
  label,
  required,
  ...otherProps
}) => {
  const { setFieldTouched, touched, errors, values, setFieldError } =
    useFormikContext();
  const handleUploadFile = async (e) => {
    const file = e.target.files[0];

    if (
      (file.name && file.name.substring(file.name.length - 3) === "png") ||
      (file.name && file.name.substring(file.name.length - 3) === "jpg")
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const int8Array = new Uint8Array(arrayBuffer);
      setFile(int8Array.toString());
    } else {
      setFieldError(name, "Image type must be Jpg/Png");
    }
  };

  return (
    <FormGroup>
      <FormLabel>
        {label} {required && <span className="text-danger">*</span>}
      </FormLabel>
      <input
        className="form-control"
        {...otherProps}
        onChange={(e) => handleUploadFile(e)}
        onBlur={() => setFieldTouched(name)}
        value={values[name]}
      />
      {errors[name] && touched[name] ? (
        <div className="text-danger">{errors[name]}</div>
      ) : null}
    </FormGroup>
  );
};

export default TextFileField;
