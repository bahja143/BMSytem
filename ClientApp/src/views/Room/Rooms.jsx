import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import * as Yup from "yup";

import FontAwesome from "react-fontawesome";
import NewRoomModal from "./NewRoomModal";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";
import { MDBDataTableV5 } from "mdbreact";
import Fontawesome from "react-fontawesome";

const schema = Yup.object({
  id: Yup.number(),
  roomNumber: Yup.string().min(2).max(50).required().label("Room Number"),
  description: Yup.string().label("Description"),
});

const Rooms = () => {
  const [show, setShow] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState({
    id: 0,
    roomNumber: "",
    description: "",
  });
  const [tableHeaders] = useState([
    { label: "Room number", field: "roomNumber" },
    { label: "Description", field: "description" },
    { label: "", field: "edit" },
  ]);

  useEffect(() => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.get(Config.apiUrl + "/rooms", { headers: auth })
      .then(({ data }) => {
        setRooms(data);
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
  }, [room]);

  const handleSubmit = (room) => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    if (room.id === 0) {
      Services.post(Config.apiUrl + "/rooms", room, { headers: auth })
        .then(({ data }) => {
          toast.success("Successful Registred.");
          setShow(false);
          setRooms([data, ...rooms]);
        })
        .catch((error) => {
          console.log(error);

          if (error.response && error.response.data) {
            toast.error(error.response.data);
          } else {
            toast.error("Something went wrong");
          }
        });
    } else {
      Services.put(Config.apiUrl + "/rooms/" + room.id, room, {
        headers: auth,
      })
        .then(({ data }) => {
          toast.info("Successful Updates.");
          setShow(false);
          setRooms([data, ...rooms.filter((c) => c.id !== room.id)]);
        })
        .catch((error) => {
          console.log(error);

          if (error.response && error.response.data) {
            toast.error(error.response.data);
          } else {
            toast.error("Something went wrong");
          }
        });
    }
  };
  const handleEdit = (custom) => {
    const cust = { ...custom };
    delete cust.edit;
    setRoom(cust);
    setShow(true);
  };

  return (
    <>
      <NewRoomModal
        show={show}
        setShow={setShow}
        room={room}
        schema={schema}
        handleSubmit={handleSubmit}
      />
      <Card>
        <Card.Header>
          <Button
            className="float-right"
            onClick={() => {
              setShow(true);
              setRoom({
                id: 0,
                roomNumber: "",
                description: "",
              });
            }}
          >
            <FontAwesome name="fas fa-plus-circle" /> New Room
          </Button>
          <Card.Title>Rooms</Card.Title>
        </Card.Header>
        <Card.Body>
          <MDBDataTableV5
            hover
            entriesOptions={[10, 25, 50, 100, 250, 500, 1000]}
            entries={10}
            pagesAmount={10}
            data={{
              columns: tableHeaders,
              rows: rooms.map((rom) => {
                rom.edit = (
                  <Button
                    onClick={() => handleEdit(rom)}
                    className="btn-light btn-sm"
                  >
                    <Fontawesome
                      className="fas fa-edit text-primary"
                      style={{ fontSize: 17 }}
                      name="edit"
                    />
                  </Button>
                );
                return rom;
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

export default Rooms;
