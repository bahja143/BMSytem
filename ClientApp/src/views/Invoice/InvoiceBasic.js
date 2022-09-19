import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Link } from "react-router-dom";

// import darkLogo from "../../assets/images/logo-dark.png";
// import Logo from "../../assets/images/agbc logo.png";
import Config from "../../config/config.json";
import Services from "../../services/HttpServices";

const InvoiceBasic = (props) => {
  const inputEl = useRef(null);
  const [invoice, setInvoice] = useState({});
  const [balance, setBalance] = useState(0);

  const handlePrint = useReactToPrint({
    content: () => inputEl.current,
  });

  useEffect(() => {
    const id = props.match.params.id;
    const auth = { Authorization: `bearer ${localStorage["token"]}` };
    Services.get(Config.apiUrl + "/allInvoices/" + id, {
      headers: auth,
    })
      .then(({ data }) => {
        setInvoice(data);

        Services.get(Config.apiUrl + "/balance/" + data.rentalId, {
          headers: auth,
        })
          .then(({ data }) => {
            console.log("data: ", data);
            setBalance(data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <React.Fragment>
      <div className="container" id="printTable">
        <div>
          <div className="card" ref={inputEl}>
            <div className="row invoice-contact">
              <div className="col-md-8">
                <div className="invoice-box row">
                  <div className="col-sm-12">
                    <table className="table table-responsive invoice-table table-borderless p-l-20">
                      <tbody>
                        <tr>
                          <td>
                            <Link to="#" className="b-brand">
                              {/* <img
                                className="img-fluid"
                                src={Logo}
                                alt="Gradient Able Logo"
                                width="250"
                              /> */}
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>BMS </td>
                        </tr>
                        <tr>
                          <td>Ethopia Jijiga, 26th june 2th avenue</td>
                        </tr>
                        <tr>
                          <td>+252907005112</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-md-4" />
            </div>
            <div className="card-body">
              <div className="row invoive-info">
                <div className="col-md-4 col-xs-12 invoice-client-info">
                  <h6>Client Information :</h6>
                  <h6 className="mb-2">{invoice.rental?.customer.name}</h6>
                  <p className="m-0">{invoice.rental?.customer.tellphone}</p>
                </div>
                <div className="col-md-4 col-sm-6">
                  <h6>Rental Information :</h6>
                  <table className="table table-responsive invoice-table invoice-order table-borderless">
                    <tbody>
                      <tr>
                        <th>Room No :</th>
                        <td>{invoice.roomNumber}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-4 col-sm-6">
                  <h6 className="m-b-20">
                    Invoice Number <span>#{invoice.id}</span>
                  </h6>
                  <table className="table table-responsive invoice-table invoice-order table-borderless">
                    <tbody>
                      <tr>
                        <th>Date of issue:</th>
                        <td>{new Date().toDateString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="table-responsive">
                    <table className="table invoice-detail-table">
                      <thead>
                        <tr className="thead-default">
                          <th>Description</th>
                          <th>Amount</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{invoice.description}</td>
                          <td>${invoice.amount}</td>
                          <td>${invoice.amount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <table className="table table-responsive invoice-table invoice-total">
                    <tbody>
                      <tr>
                        <th>Previous balance :</th>
                        <td>${balance - invoice.amount}</td>
                      </tr>
                      <tr className="text-info">
                        <td>
                          <hr />
                          <h5 className="text-primary m-r-10">Total :</h5>
                        </td>
                        <td>
                          <hr />
                          <h5 className="text-primary">${balance}</h5>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="row text-center btn-page">
            <div className="col-sm-12 invoice-btn-group text-center">
              <button
                type="button"
                className="btn btn-primary btn-print-invoice m-b-10"
                onClick={handlePrint}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default InvoiceBasic;
