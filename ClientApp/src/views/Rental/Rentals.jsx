import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";
import { MDBDataTableV5 } from "mdbreact";
import Fontawesome from "react-fontawesome";
import SweatAlert from "react-bootstrap-sweetalert";

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [rent, setRental] = useState({ customer: {} });
  const [show, setShow] = useState(false);
  const [tableHeaders] = useState([
    { label: "Customer", field: "name" },
    { label: "Tellphone", field: "tellphone" },
    { label: "Room No", field: "roomNumber" },
    { label: "Amount", field: "amount" },
    { label: "Date", field: "startDate" },
    { label: "", field: "edit" },
  ]);
  const handleOut = (obj) => {
    setRental(obj);
    setShow(true);
  };

  const handleApprove = () => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };
    setShow(false);

    Services.get(Config.apiUrl + "/rental/out/" + rent.id, {
      headers: auth,
    })
      .then(() => {
        toast.warning("Outed");
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
  };

  useEffect(() => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.get(Config.apiUrl + "/rentals", { headers: auth })
      .then(({ data }) => {
        setRentals(data.filter((r) => r.isCurrent));
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
  }, []);

  return (
    <>
      <SweatAlert
        title={"Are you sure to out(" + rent.customer.name + ")"}
        show={show}
        onCancel={() => setShow(false)}
        closeOnClickOutside
        confirmButtonColor="green"
        onConfirm={() => handleApprove()}
        showCloseButton
      />
      <Card>
        <Card.Header>
          <Card.Title>Rentals</Card.Title>
        </Card.Header>
        <Card.Body>
          <MDBDataTableV5
            hover
            entriesOptions={[10, 25, 50, 100, 250, 500, 1000]}
            entries={10}
            pagesAmount={10}
            data={{
              columns: tableHeaders,
              rows: rentals.map((ren) => {
                ren.edit = (
                  <>
                    <NavLink to={"/rentals/rentalForm/edit/" + ren.id}>
                      <Fontawesome
                        className="fas fa-edit text-primary"
                        style={{ fontSize: 17 }}
                        name="edit"
                      />
                    </NavLink>
                    <a className="ml-4" onClick={() => handleOut(ren)}>
                      <Fontawesome
                        className="fas fa-sign-out-alt text-danger"
                        style={{ fontSize: 17 }}
                        name="edit"
                      />
                    </a>
                  </>
                );

                ren.name = ren.customer.name;
                ren.tellphone = ren.customer.tellphone;
                ren.roomNumber = ren.room.roomNumber;
                ren.amount = "$" + ren.amount;
                ren.startDate = new Date(ren.startDate).toDateString();
                return ren;
              }),
            }}
            pagingTop
            searchTop
            searchBottom={false}
            fullPagination
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default Rentals;
