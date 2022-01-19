import React from "react";
import { Formik } from "formik";

import { Modal, Button } from "react-bootstrap";
import {
  TextField,
  TextAreaField,
  SelectField,
  SubmitBtn,
} from "../../components/Form";

const NewItemModal = ({
  show,
  setShow,
  item,
  schema,
  categories,
  handleSubmit,
}) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={item}
      validationSchema={schema}
      onSubmit={(item, { resetForm }) => {
        resetForm();
        handleSubmit(item);
      }}
    >
      {() => (
        <>
          <Modal show={show}>
            <Modal.Header>
              <Modal.Title>
                {item.id === 0 ? "New Item" : "Update Item"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TextField name="name" label="Name" required />
              <SelectField
                name="categoryId"
                label="Category"
                options={categories.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
                required
              />
              <TextAreaField name="description" label="Description" />
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

export default NewItemModal;
