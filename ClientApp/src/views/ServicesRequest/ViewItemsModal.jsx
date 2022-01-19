import React from "react";
import { FormGroup } from "react-bootstrap";
import { Row, Col, Button, Modal } from "react-bootstrap";

const ViewItemsModal = ({ show, items, options, onClose }) => {
  console.log("Items:", items);
  console.log("Options:", options);
  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>Service Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {items.map((v) => (
          <Row key={v.itemId}>
            <Col>
              <FormGroup>
                <input
                  value={options.find((o) => o.id === v.itemId).name}
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
              </Row>
            </Col>
          </Row>
        ))}
        <Row>
          <Col>
            <FormGroup>
              <input value={"Total"} className="form-control" disabled />
            </FormGroup>
          </Col>
          <Col>
            <Row>
              <Col>
                <FormGroup>
                  <input
                    value={
                      "$" +
                      items.map((i) => i.amount).reduce((a, b) => a + b, 0)
                    }
                    className="form-control"
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewItemsModal;
