import React from "react";
import { Formik } from "formik";

import { Modal, Button } from "react-bootstrap";
import { TextField, TextAreaField, SubmitBtn } from "../../components/Form";

const NewRoomModal = ({ show, setShow, room, schema, handleSubmit }) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={room}
      validationSchema={schema}
      onSubmit={(room) => {
        handleSubmit(room);
      }}
    >
      {() => (
        <>
          <Modal show={show}>
            <Modal.Header>
              <Modal.Title>New Room</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TextField name="roomNumber" label="Room number" required />
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

export default NewRoomModal;
