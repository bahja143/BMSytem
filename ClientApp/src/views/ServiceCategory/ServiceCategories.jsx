import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import * as Yup from "yup";

import FontAwesome from "react-fontawesome";
import NewServiceCategories from "./NewServiceCategories";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";
import { toast } from "react-toastify";
import { MDBDataTableV5 } from "mdbreact";
import Fontawesome from "react-fontawesome";

const schema = Yup.object({
  id: Yup.number(),
  name: Yup.string().min(5).max(50).required().label("Name"),
});

const ServiceCategories = () => {
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    id: 0,
    name: "",
  });
  const [tableHeaders] = useState([
    { label: "Name", field: "name" },
    { label: "", field: "edit" },
  ]);

  useEffect(() => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    Services.get(Config.apiUrl + "/serviceCategories", { headers: auth })
      .then(({ data }) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong");
      });
  }, [category]);

  const handleSubmit = (category) => {
    const auth = { Authorization: `bearer ${localStorage["token"]}` };

    if (category.id === 0) {
      Services.post(Config.apiUrl + "/serviceCategories", category, {
        headers: auth,
      })
        .then(({ data }) => {
          toast.success("Successful Registred.");
          setShow(false);
          setCategories([data, ...categories]);
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
      Services.put(
        Config.apiUrl + "/serviceCategories/" + category.id,
        category,
        {
          headers: auth,
        }
      )
        .then(({ data }) => {
          toast.info("Successful Updates.");
          setShow(false);
          setCategories([
            data,
            ...categories.filter((c) => c.id !== category.id),
          ]);
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
    setCategory(cust);
    setShow(true);
  };

  return (
    <>
      <NewServiceCategories
        show={show}
        setShow={setShow}
        category={category}
        schema={schema}
        handleSubmit={handleSubmit}
      />
      <Card>
        <Card.Header>
          <Button
            className="float-right"
            onClick={() => {
              setShow(true);
              setCategory({
                id: 0,
                name: "",
              });
            }}
          >
            <FontAwesome name="fas fa-plus-circle" /> New Category
          </Button>
          <Card.Title>Service Categories</Card.Title>
        </Card.Header>
        <Card.Body>
          <MDBDataTableV5
            hover
            entriesOptions={[10, 25, 50, 100, 250, 500, 1000]}
            entries={10}
            pagesAmount={10}
            data={{
              columns: tableHeaders,
              rows: categories.map((categ) => {
                categ.edit = (
                  <Button
                    onClick={() => handleEdit(categ)}
                    className="btn-light btn-sm"
                  >
                    <Fontawesome
                      className="fas fa-edit text-primary"
                      style={{ fontSize: 17 }}
                      name="edit"
                    />
                  </Button>
                );
                return categ;
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

export default ServiceCategories;
