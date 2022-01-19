import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";
import { MDBDataTableV5 } from "mdbreact";
import FontAwesome from "react-fontawesome";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [tableHeaders] = useState([
    { label: "Customer", field: "name" },
    { label: "Tellphone", field: "tellphone" },
    { label: "Room No", field: "roomNumber" },
    { label: "Amount", field: "amountInDollar" },
    { label: "Date", field: "date" },
    { label: "Description", field: "description" },
    { label: "", field: "edit" },
  ]);
  const handleGenerateInvoice = () => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.get(Config.apiUrl + "/generateinvoices", { headers: auth })
      .then(({ data }) => {
        const invoices = [];
        data.value.reverse().forEach((v) => {
          if (
            !invoices.find((i) => i.rental.customer.id === v.rental.customer.id)
          ) {
            invoices.push(v);
          }
        });
        const customers = invoices.map((r) => r.rental.customer);

        setInvoices([
          ...data.value.map((r) => {
            r.date = new Date(r.date).toDateString();
            return r;
          }),
        ]);

        customers.forEach((customer) => {
          const amount = invoices.find(
            (i) => i.rental.customer.id === customer.id
          ).amount;
          const total = data.value
            .filter((i) => i.rental.customer.id === customer.id)
            .map((r) => r.amount)
            .reduce((a, b) => a + b);

          const body =
            "Ali Gobanimo Business Center: Waxaa lagugu dalacay lacag dhan " +
            amount +
            " dollar oo kirro ah. guud ahaan waxaa lacag lagugu leyahay: " +
            total +
            " dollar";

          Services.get(
            "https://gtsomapi.com/integration/api/Sms/SendByOne?Body=" +
              body +
              "&Phone=" +
              customer.tellphone +
              "&Security.Username=Agbc&Security.Password=$Gobanimo2021"
          );

          //  Services.post(
          //    Config.apiUrl + "/messages",
          //    { customerId: id, body: "Ali Gobanimo Bussiness center, waxa lagugu dalacay ", date: new Date().t },
          //    {
          //      headers: auth,
          //    }
          //  );
        });
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
  };

  useEffect(() => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.get(Config.apiUrl + "/invoices", { headers: auth })
      .then(({ data }) => {
        setInvoices(
          data.map((r) => {
            r.date = new Date(r.date).toDateString();
            return r;
          })
        );
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
  }, [setInvoices]);

  const handleSummary = (text) => {
    const max = 15;
    const letters = text.split("");

    if (letters.length > max) {
      return letters.slice(0, max).join("") + "...";
    } else {
      return letters.join("");
    }
  };

  return (
    <>
      <Card>
        <Card.Header>
          <Button
            className="float-right"
            onClick={() => handleGenerateInvoice()}
          >
            Generate Invoices
          </Button>
          <Card.Title>Invoices</Card.Title>
        </Card.Header>
        <Card.Body>
          <MDBDataTableV5
            hover
            entriesOptions={[10, 25, 50, 100, 250, 500, 1000]}
            entries={10}
            pagesAmount={10}
            data={{
              columns: tableHeaders,
              rows: invoices.map((inv) => {
                inv.edit = (
                  <>
                    <NavLink to={"/invoices/edit/" + inv.id}>
                      <FontAwesome
                        className="fas fa-edit text-primary"
                        style={{ fontSize: 17 }}
                        name="edit"
                      />
                    </NavLink>
                    <NavLink to={"/invoice/print/" + inv.id}>
                      <FontAwesome
                        className="fas fa-print ml-5 text-secondary"
                        style={{ fontSize: 17 }}
                        name="edit"
                      />
                    </NavLink>
                  </>
                );

                inv.amountInDollar = "$" + inv.amount;
                inv.description = handleSummary(inv.description);
                return inv;
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

export default Invoices;
