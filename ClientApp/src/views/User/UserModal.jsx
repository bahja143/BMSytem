import React from "react";
import { Modal, Button, Form, FormGroup, FormLabel } from "react-bootstrap";
import Select from "react-select";

const UserModal = ({
  show,
  onClose,
  onChange,
  user,
  onSubmit,
  errors,
  validate,
}) => {
  const roles = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ];

  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>
          {user.id === 0 ? "New Father" : "Update Father"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <FormGroup>
            <FormLabel>
              Name <span className="text-danger">*</span>
            </FormLabel>
            <input
              name="name"
              value={user.name}
              onChange={onChange}
              className="form-control"
            />
            {errors["name"] && (
              <div className="text-danger">{errors["name"]}</div>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel>
              Role <span className="text-danger">*</span>
            </FormLabel>
            <Select
              options={roles}
              value={roles.filter((r) => r.value === user.role)}
              onChange={(e) =>
                onChange({ currentTarget: { name: "role", value: e.value } })
              }
            />
            {errors["role"] && (
              <div className="text-danger">{errors["role"]}</div>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel>
              Username <span className="text-danger">*</span>
            </FormLabel>
            <input
              name="username"
              value={user.username}
              onChange={onChange}
              className="form-control"
            />
            {errors["username"] && (
              <div className="text-danger">{errors["username"]}</div>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel>
              Password <span className="text-danger">*</span>
            </FormLabel>
            <input
              name="password"
              value={user.password}
              onChange={onChange}
              className="form-control"
            />
            {errors["password"] && (
              <div className="text-danger">{errors["password"]}</div>
            )}
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
          <Button disabled={validate()} type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserModal;
