import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import * as Yup from "yup";

import FontAwesome from "react-fontawesome";
import NewItemModal from "./NewItemModal";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";
import { MDBDataTableV5 } from "mdbreact";
import Fontawesome from "react-fontawesome";

const schema = Yup.object({
  id: Yup.number(),
  name: Yup.string().min(5).max(50).required().label("Name"),
  categoryId: Yup.number().required().label("Category"),
  description: Yup.string(),
});

const Items = () => {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [item, setItem] = useState({
    id: 0,
    name: "",
    categoryId: "",
    description: "",
  });
  const [tableHeaders] = useState([
    { label: "Name", field: "name" },
    { label: "Category", field: "categoryName" },
    { label: "Description", field: "description" },
    { label: "", field: "edit" },
  ]);

  useEffect(() => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.get(Config.apiUrl + "/items", { headers: auth })
      .then(({ data }) => {
        setItems(data);
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });

    Services.get(Config.apiUrl + "/itemCategories", { headers: auth })
      .then(({ data }) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
  }, [item]);

  const handleSubmit = (item) => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    if (item.id === 0) {
      Services.post(Config.apiUrl + "/items", item, { headers: auth })
        .then(({ data }) => {
          toast.success("Successful Registred.");
          setShow(false);
          setItems([data, ...items]);
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
      Services.put(Config.apiUrl + "/items/" + item.id, item, {
        headers: auth,
      })
        .then(({ data }) => {
          toast.info("Successful Updates.");
          setShow(false);
          setItems([data, ...items.filter((c) => c.id !== item.id)]);
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
    delete cust.categoryName;

    setItem(cust);
    setShow(true);
  };

  return (
    <>
      <NewItemModal
        show={show}
        setShow={setShow}
        item={item}
        categories={categories}
        schema={schema}
        handleSubmit={handleSubmit}
      />
      <Card>
        <Card.Header>
          <Button
            className="float-right"
            onClick={() => {
              setShow(true);
              setItem({
                id: 0,
                name: "",
                categoryId: "",
                description: "",
              });
            }}
          >
            <FontAwesome name="fas fa-plus-circle" /> New Item
          </Button>
          <Card.Title>Items</Card.Title>
        </Card.Header>
        <Card.Body>
          <MDBDataTableV5
            hover
            entriesOptions={[10, 25, 50, 100, 250, 500, 1000]}
            entries={10}
            pagesAmount={10}
            data={{
              columns: tableHeaders,
              rows: items.map((item) => {
                item.edit = (
                  <Button
                    onClick={() => handleEdit(item)}
                    className="btn-light btn-sm"
                  >
                    <Fontawesome
                      className="fas fa-edit text-primary"
                      style={{ fontSize: 17 }}
                      name="edit"
                    />
                  </Button>
                );
                item.categoryName = item.category && item.category.name;

                return item;
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

export default Items;
