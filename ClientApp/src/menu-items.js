const menuItems = {
  items: [
    {
      id: "navigation",
      title: "Home",
      type: "group",
      icon: "icon-navigation",
      children: [
        {
          id: "dashboard",
          title: "Dashboard",
          type: "item",
          icon: "feather icon-home",
          url: "/",
        },
      ],
    },
    {
      id: "Setup",
      title: "Setup",
      type: "group",
      icon: "icon-ui",
      children: [
        {
          id: "Registration",
          title: "Registration",
          type: "collapse",
          icon: "feather icon-box",
          children: [
            {
              id: "basic",
              title: "Customers",
              type: "item",
              url: "/setup/customers",
            },
            {
              id: "basic",
              title: "Rooms",
              type: "item",
              url: "/setup/rooms",
            },
            {
              id: "basic",
              title: "Item Categories",
              type: "item",
              url: "/item/categories",
            },
            {
              id: "basic",
              title: "Items",
              type: "item",
              url: "/setup/items",
            },
            {
              id: "basic",
              title: "Service Categories",
              type: "item",
              url: "/service/categories",
            },
            {
              id: "User",
              title: "Users",
              type: "item",
              url: "/setup/users",
            },
          ],
        },
      ],
    },
    {
      id: "Rental",
      title: "Rental",
      type: "group",
      icon: "icon-group",
      children: [
        {
          id: "Rental Form",
          title: "Rental Form",
          type: "item",
          icon: "feather icon-check-square",
          url: "/rentals/rentalform",
        },
        {
          id: "Rentals",
          title: "Rentals",
          type: "item",
          icon: "feather icon-file-text",
          url: "/rentals/rentals",
        },
      ],
    },
    {
      id: "Invoices & Receipts",
      title: "Invoices & Receipts",
      type: "group",
      icon: "icon-table",
      children: [
        {
          id: "New invoice",
          title: "New Invoice",
          type: "item",
          icon: "feather icon-repeat",
          url: "/invoices/newInvoice",
        },
        {
          id: "Invoice",
          title: "Invoices",
          type: "item",
          icon: "feather icon-server",
          url: "/invoices/invoicesList",
        },
        {
          id: "Receipt",
          title: "Receipt",
          type: "item",
          icon: "feather icon-credit-card",
          url: "/receipt/form",
        },
      ],
    },
    {
      id: "Services & Budget",
      title: "Services & Budget",
      type: "group",
      icon: "icon-table",
      children: [
        {
          id: "Service Form",
          title: "Service Request",
          type: "item",
          icon: "feather icon-clipboard",
          url: "/services&budgets/serviceRequest",
        },
        {
          id: "Budget Form",
          title: "Budget Form",
          type: "item",
          icon: "feather icon-file-text",
          url: "/services&budgets/budget",
        },
      ],
    },
    {
      id: "Messages",
      title: "Messages",
      type: "group",
      icon: "icon-table",
      children: [
        {
          id: "Message Form",
          title: "New Message",
          type: "item",
          icon: "feather icon-mail",
          url: "/message/newMessage",
        },
        {
          id: "Messages",
          title: "Messages",
          type: "item",
          icon: "feather icon-message-square",
          url: "/message/messages",
        },
      ],
    },
    {
      id: "Report",
      title: "Report",
      type: "group",
      icon: "icon-ui",
      children: [
        {
          id: "Reports",
          title: "Reports",
          type: "collapse",
          icon: "feather icon-bar-chart-2",
          children: [
            {
              id: "basic",
              title: "Rentals",
              type: "item",
              url: "/reports/rentals",
            },
            {
              id: "basic",
              title: "Receipts",
              type: "item",
              url: "/reports/receipts",
            },
            {
              id: "basic",
              title: "Invoices",
              type: "item",
              url: "/reports/invoices",
            },
            {
              id: "basic",
              title: "Services",
              type: "item",
              url: "/reports/services",
            },
          ],
        },
      ],
    },
  ],
};

export default menuItems;
