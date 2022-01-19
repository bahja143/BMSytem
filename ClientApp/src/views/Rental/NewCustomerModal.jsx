import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import { Modal, Button } from "react-bootstrap";
import { TextField, SubmitBtn } from "../../components/Form";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";

const schema = Yup.object({
  id: Yup.number(),
  name: Yup.string().min(5).max(50).required().label("Name"),
  tellphone: Yup.string().required().label("Tellphone"),
  address: Yup.string().required().label("Address"),
});

const NewCustomerModal = ({ show, setClose, onPapulate }) => {
  const [customer] = useState({
    id: 0,
    name: "",
    tellphone: "",
    address: "",
  });

  const handleSubmit = (customer) => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.post(Config.apiUrl + "/customers", customer, { headers: auth })
      .then(({ data }) => {
        toast.success("Successful Registred.");
        setClose();
        onPapulate(data);
      })
      .catch((error) => {
        console.log(error);

        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

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
              <Button onClick={setClose} className="btn-secondary">
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
