import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";

import Config from "../../config/config.json";
import Services from "../../services/HttpServices";

const Dashboard = () => {
  const [receipts, setReceipts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [budgetBalance, setBudgetBalance] = useState(0);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.get(Config.apiUrl + "/receipts", { headers: auth }).then(
      ({ data }) => {
        setReceipts([...data]);
      }
    );

    Services.get(Config.apiUrl + "/invoices", { headers: auth }).then(
      ({ data }) => {
        setInvoices([...data]);
      }
    );

    Services.get(Config.apiUrl + "/rentals", { headers: auth }).then(
      ({ data }) => {
        setRentals([...data]);
      }
    );

    Services.get(Config.apiUrl + "/rooms", { headers: auth }).then(
      ({ data }) => {
        setRooms([...data]);
      }
    );

    Services.get(Config.apiUrl + "/services", { headers: auth }).then(
      ({ data }) => {
        setServices([
          ...data
            .reverse((a, b) => new Date(a.date) + new Date(b.date))
            .slice(0, 7),
        ]);
      }
    );

    Services.get(Config.apiUrl + "/budget/balance", { headers: auth }).then(
      ({ data }) => {
        setBudgetBalance(data);
      }
    );
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col md={4} sm={6}>
          <Card className="user-card">
            <Card.Body>
              <h5 className="m-b-15">Total Invoices</h5>
              <h4 className="f-w-300">
                {invoices.length > 0
                  ? "$" + invoices.map((i) => i.amount).reduce((a, b) => a + b)
                  : 0}
              </h4>
              <span className="text-muted">Monthly Invoice</span>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6}>
          <Card className="user-card">
            <Card.Body>
              <h5 className="f-w-400 m-b-15">Total Receipts</h5>
              <h4 className="f-w-300">
                {receipts.length > 0
                  ? "$" + receipts.map((r) => r.amount).reduce((a, b) => a + b)
                  : 0}
              </h4>
              <span className="text-muted">
                <label className="label theme-bg text-white f-12 f-w-400">
                  {receipts.length > 0 && invoices.length > 0
                    ? Math.floor(
                        (receipts.map((r) => r.amount).reduce((a, b) => a + b) /
                          invoices
                            .map((i) => i.amount)
                            .reduce((a, b) => a + b)) *
                          100
                      )
                    : 0}
                  %
                </label>{" "}
                Monthly Receipt
              </span>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="user-card">
            <Card.Body>
              <h5 className="f-w-400 m-b-15">Rentals</h5>
              <h4 className="f-w-300">
                {rentals.filter((r) => r.isCurrent).length}
              </h4>
              <span className="text-muted">
                <label className="label theme-bg text-white f-12 f-w-400">
                  {(rentals.filter((r) => r.isCurrent).length / rooms.length) *
                    100}
                  %
                </label>
                Current Rent
              </span>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={8}>
          <Card className="user-list">
            <Card.Header>
              <Card.Title as="h5">Recent Services</Card.Title>
            </Card.Header>
            <Card.Body className="pb-0">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Expenses</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr>
                      <td>
                        <h6 className="mb-1">{s.category.name}</h6>
                      </td>
                      <td>
                        <span className="pie_1">
                          $
                          {s.items.map((s) => s.amount).reduce((a, b) => a + b)}
                        </span>
                      </td>
                      <td>
                        <h6 className="m-0">
                          {new Date(s.date).toDateString()}
                        </h6>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card>
            <Card.Header>
              <Card.Title className="m-0">Budget Balance</Card.Title>
            </Card.Header>
            <Card.Body className="border-bottom">
              <div className="row align-items-center">
                <div className="col-8">
                  <h2 className="f-w-300 m-0">${budgetBalance}</h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Dashboard;
