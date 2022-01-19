import React, { useState } from "react";
import { useFormikContext } from "formik";
import Select from "react-select";
import Fontawesome from "react-fontawesome";

import { FormGroup, FormLabel } from "react-bootstrap";
import { Row, Col, Button } from "react-bootstrap";

const FieldArrayForm = ({
  name,
  options,
  label,
  required,
  balance,
  onAdd,
  onSub,
  onRemoveItem,
  onAddItem,
  allOptions,
}) => {
  const { setFieldTouched, values, setFieldValue } = useFormikContext();
  const [select, setSelect] = useState({ itemId: "", amount: "" });
  const [customErrors, setErrors] = useState({});

  const handleSelect = () => {
    setFieldValue(name, [...values[name], select]);
    onSub(select["amount"]);
    setSelect({ itemId: "", amount: "" });
    setErrors({});
    onRemoveItem(select.itemId);
  };

  const handleChange = ({ currentTarget: input }) => {
    select[input.name] = input.value;
    setSelect({ ...select });

    if (select.itemId && select.amount) setErrors(null);
    else setErrors({});

    if (input.name === "amount") {
      if (input.value && input.value > balance)
        setErrors({ balance: "Plz check balance" });
      else setErrors(null);
    }
  };

  const handleEdit = (input) => {
    setFieldValue(name, [
      ...values[name].filter((v) => v.itemId !== input.itemId),
    ]);
    setSelect(input);
    setErrors(null);
    onAdd(input.amount);
    onAddItem(input.itemId);
  };

  const handleDelete = (input) => {
    setFieldValue(name, [
      ...values[name].filter((v) => v.itemId !== input.itemId),
    ]);
    onAdd(input.amount);
    onAddItem(input.itemId);
  };

  return (
    <FormGroup>
      <Row>
        <Col>
          <FormGroup>
            <FormLabel>
              {label} {required && <span className="text-danger">*</span>}
            </FormLabel>
            <Select
              value={options.filter((f) => f.value === select["itemId"])}
              options={options}
              onChange={(e) =>
                handleChange({
                  currentTarget: { name: "itemId", value: e.value },
                })
              }
              onBlur={() => setFieldTouched(name)}
            />
          </FormGroup>
        </Col>
        <Col>
          <Row>
            <Col>
              <FormGroup>
                <FormLabel>Amount</FormLabel>
                <input
                  value={select.amount}
                  name="amount"
                  className="form-control mb-1"
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormLabel>Budget Balance</FormLabel>
              <input
                disabled
                name="budegt"
                value={balance}
                className="form-control"
              />
              {customErrors && customErrors["balance"] ? (
                <div className="text-danger">{customErrors["balance"]}</div>
              ) : null}
            </Col>
            <Col>
              <Button
                onClick={handleSelect}
                disabled={customErrors}
                className="mt-4"
              >
                <Fontawesome className="fas fa-plus-circle" />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* {errors[name] && touched[name] ? (
        <div className="text-danger">{errors[name]}</div>
      ) : null} */}
      {values[name].map((v) => (
        <Row key={v.itemId}>
          <Col>
            <FormGroup>
              <input
                value={allOptions.find((o) => o.value === v.itemId).label}
                className="form-control"
                disabled
              />
            </FormGroup>
          </Col>
          <Col>
            <Row>
              <Col>
                <FormGroup>
                  <input
                    value={"$" + v.amount}
                    className="form-control"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col>
                <Button
                  className="btn-secondary btn-sm"
                  onClick={() => handleEdit(v)}
                >
                  <Fontawesome className="fas fa-pen" />
                </Button>
                <Button
                  className="btn-danger btn-sm"
                  onClick={() => handleDelete(v)}
                >
                  <Fontawesome className="fas fa-trash" />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      ))}
    </FormGroup>
  );
};

export default FieldArrayForm;
