import React from "react";
import { Button, Modal } from "react-bootstrap";

const ViewMessage = ({ show, setShow, message }) => {
  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>Message body of {message.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          disabled
          rows={10}
          value={message.body}
          className="form-control"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-secondary" onClick={() => setShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewMessage;
