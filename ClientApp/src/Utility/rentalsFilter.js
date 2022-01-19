function Filter(rentals, filter) {
  if (filter.startDate === "" && filter.tellphone === "") {
    let result =
      filter.name === "All"
        ? rentals
        : rentals.filter((r) => r.name === filter.name);

    return filter.roomNumber === "All"
      ? result
      : result.filter((r) => r.roomNumber === filter.roomNumber);
  } else if (filter.startDate !== "" && filter.tellphone !== "") {
    let patient =
      filter.name === "All"
        ? rentals
        : rentals.filter((r) => r.name === filter.name);

    let departments =
      filter.roomNumber === "All"
        ? patient
        : patient.filter((r) => r.roomNumber === filter.roomNumber);

    return departments.filter((d) => {
      let date = new Date(d.startDate);

      return (
        date >= filter.startDate &&
        d.tellphone.toLocaleLowerCase().startsWith(filter.tellphone)
      );
    });
  } else if (filter.startDate !== "") {
    let patient =
      filter.name === "All"
        ? rentals
        : rentals.filter((r) => r.name === filter.name);

    let departments =
      filter.roomNumber === "All"
        ? patient
        : patient.filter((r) => r.roomNumber === filter.roomNumber);

    return departments.filter((d) => {
      let date = new Date(d.startDate);

      return date >= filter.startDate;
    });
  } else if (filter.tellphone !== "") {
    let patient =
      filter.name === "All"
        ? rentals
        : rentals.filter((r) => r.name === filter.name);

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
