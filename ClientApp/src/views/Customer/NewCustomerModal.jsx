import React from "react";
import { Formik } from "formik";

import { Modal, Button } from "react-bootstrap";
import { TextField, SubmitBtn } from "../../components/Form";

const NewCustomerModal = ({
  show,
  setShow,
  customer,
  schema,
  handleSubmit,
}) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={customer}
      validationSchema={schema}
      onSubmit={(customer, { resetForm }) => {
        resetForm();
        handleSubmit(customer);
      }}
    >
      {() => (
        <>
          <Modal show={show}>
            <Modal.Header>
              <Modal.Title>
                {customer.id === 0 ? "New Customer" : "Update Customer"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TextField name="name" label="Name" required />
              <TextField name="tellphone" label="Tellphone" required />
              <TextField name="address" label="Address" required />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShow(false)} className="btn-secondary">
                Close
              </Button>
              <SubmitBtn />
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Formik>
  );
};

export default NewCustomerModal;
