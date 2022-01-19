import React, { Suspense, Fragment, lazy } from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import Loader from "./components/Loader/Loader";
import AdminLayout from "./layouts/AdminLayout";

import AuthGuard from "./components/Auth/AuthGuard";

import { BASE_URL } from "./config/constant";

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [
  {
    exact: true,
    path: "/auth/signin",
    component: lazy(() => import("./views/auth/SignIn5")),
  },
  {
    exact: true,
    path: "/auth/changePassword",
    component: lazy(() => import("./views/auth/ChangePassword")),
  },
  {
    path: "*",
    layout: AdminLayout,
    guard: AuthGuard,
    routes: [
      {
        exact: true,
        path: "/",
        component: lazy(() => import("./views/Dashboard/Dashboard")),
      },
      {
        exact: true,
        path: "/setup/customers",
        component: lazy(() => import("./views/Customer/Customers")),
      },
      {
        exact: true,
        path: "/setup/rooms",
        component: lazy(() => import("./views/Room/Rooms")),
      },
      {
        exact: true,
        path: "/setup/items",
        component: lazy(() => import("./views/Item/Items")),
      },
      {
        exact: true,
        path: "/rentals/rentalform",
        component: lazy(() => import("./views/Rental/RentalForm")),
      },
      {
        exact: true,
        path: "/rentals/rentalform/edit/:id",
        component: lazy(() => import("./views/Rental/RentalForm")),
      },
      {
        exact: true,
        path: "/rentals/rentals",
        component: lazy(() => import("./views/Rental/Rentals")),
      },
      {
        exact: true,
        path: "/invoices/invoicesList",
        component: lazy(() => import("./views/Invoice/Invoices")),
      },
      {
        exact: true,
        path: "/invoices/newInvoice",
        component: lazy(() => import("./views/Invoice/NewInvoice")),
      },
      {
        exact: true,
        path: "/invoices/edit/:id",
        component: lazy(() => import("./views/Invoice/NewInvoice")),
      },
      {
        exact: true,
        path: "/receipt/form",
        component: lazy(() => import("./views/Receipt/ReceiptForm")),
      },
      {
        exact: true,
        path: "/item/categories",
        component: lazy(() => import("./views/ItemCategory/ItemCategories")),
      },
      {
        exact: true,
        path: "/service/categories",
        component: lazy(() =>
          import("./views/ServiceCategory/ServiceCategories")
        ),
      },
      {
        exact: true,
        path: "/services&budgets/budget",
        component: lazy(() => import("./views/Budget/BudgetForm")),
      },
      {
        exact: true,
        path: "/services&budgets/serviceRequest",
        component: lazy(() => import("./views/ServicesRequest/ServiceRequest")),
      },
      {
        exact: true,
        path: "/reports/rentals",
        component: lazy(() => import("./views/Rental/Report")),
      },
      {
        exact: true,
        path: "/reports/receipts",
        component: lazy(() => import("./views/Receipt/Report")),
      },
      {
        exact: true,
        path: "/reports/invoices",
        component: lazy(() => import("./views/Invoice/Report")),
      },
      {
        exact: true,
        path: "/reports/services",
        component: lazy(() => import("./views/ServicesRequest/Report")),
      },
      {
        exact: true,
        path: "/setup/users",
        component: lazy(() => import("./views/User/Users")),
      },
      {
        exact: true,
        path: "/user/profile",
        component: lazy(() => import("./views/User/Profile")),
      },
      {
        exact: true,
        path: "/message/newMessage",
        component: lazy(() => import("./views/Message/MessageForm")),
      },
      {
        exact: true,
        path: "/message/messages",
        component: lazy(() => import("./views/Message/Messages")),
      },
      {
        exact: true,
        path: "/invoice/print/:id",
        component: lazy(() => import("./views/Invoice/InvoiceBasic")),
      },
      {
        path: "*",
        exact: true,
        component: () => <Redirect to={BASE_URL} />,
      },
    ],
  },
];

export default routes;
