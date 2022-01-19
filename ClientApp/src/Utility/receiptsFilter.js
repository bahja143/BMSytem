function Filter(receipts, filter) {
  if (filter.date === "" && filter.tellphone === "") {
    let result =
      filter.name === "All"
        ? receipts
        : receipts.filter((r) => r.name === filter.name);

    return filter.roomNumber === "All"
      ? result
      : result.filter((r) => r.roomNumber === filter.roomNumber);
  } else if (filter.date !== "" && filter.tellphone !== "") {
    let patient =
      filter.name === "All"
        ? receipts
        : receipts.filter((r) => r.name === filter.name);

    let departments =
      filter.roomNumber === "All"
        ? patient
        : patient.filter((r) => r.roomNumber === filter.roomNumber);

    return departments.filter((d) => {
      let date = new Date(d.date);

      return (
        date >= filter.date &&
        d.tellphone.toLocaleLowerCase().startsWith(filter.tellphone)
      );
    });
  } else if (filter.date !== "") {
    let patient =
      filter.name === "All"
        ? receipts
        : receipts.filter((r) => r.name === filter.name);

    let departments =
      filter.roomNumber === "All"
        ? patient
        : patient.filter((r) => r.roomNumber === filter.roomNumber);

    return departments.filter((d) => {
      let date = new Date(d.date);

      return date >= filter.date;
    });
  } else if (filter.tellphone !== "") {
    let patient =
      filter.name === "All"
        ? receipts
        : receipts.filter((r) => r.name === filter.name);

    let departments =
      filter.roomNumber === "All"
        ? patient
        : patient.filter((r) => r.roomNumber === filter.roomNumber);

    return departments.filter((d) =>
      d.tellphone.toLocaleLowerCase().startsWith(filter.tellphone)
    );
  } else {
    return [];
  }
}

export default Filter;
