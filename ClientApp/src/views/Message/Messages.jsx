import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";

import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";
import { MDBDataTableV5 } from "mdbreact";
import Fontawesome from "react-fontawesome";
import ViewMessage from "./ViewMessage";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState({});
  const [tableHeaders] = useState([
    { label: "Name", field: "name" },
    { label: "Tellphone", field: "tellphone" },
    { label: "Message", field: "messageBody" },
    { label: "Date", field: "date" },
    { label: "", field: "edit" },
  ]);

  useEffect(() => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.get(Config.apiUrl + "/messages", { headers: auth })
      .then(({ data }) => {
        setMessages(data);
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
  }, []);

  const handleSummary = (text) => {
    const max = 20;
    const letters = text.split("");

    if (letters.length > max) {
      return letters.slice(0, max).join("") + "...";
    } else {
      return letters.join("");
    }
  };

  return (
    <>
      <ViewMessage show={show} setShow={setShow} message={message} />
      <Card>
        <Card.Header>
          <Card.Title>Messages</Card.Title>
        </Card.Header>
        <Card.Body>
          <MDBDataTableV5
            hover
            entriesOptions={[10, 25, 50, 100, 250, 500, 1000]}
            entries={10}
            pagesAmount={10}
            data={{
              columns: tableHeaders,
              rows: messages.map((message) => {
                message.edit = (
                  <Button
                    className="btn-light btn-sm"
                    onClick={() => {
                      setMessage(message);
                      setShow(true);
                    }}
                  >
                    <Fontawesome
                      className="fas fa-eye text-secondary"
                      style={{ fontSize: 17 }}
                      name="edit"
                    />
                  </Button>
                );

                message.name = message.customer.name;
                message.tellphone = message.customer.tellphone;
                message.date = new Date(message.date).toDateString();
                message.messageBody = handleSummary(message.body);

                return message;
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

export default Messages;
