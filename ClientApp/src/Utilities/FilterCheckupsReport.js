function Filter(checkups, filter) {
  if (filter.startDate === "" && filter.endDate === "") {
    let result =
      filter.name === "All"
        ? checkups
        : checkups.filter((r) => r.name === filter.name);

    return filter.nationality === "All"
      ? result
      : result.filter((r) => r.nationality === filter.nationality);
  } else if (filter.startDate !== "" && filter.endDate !== "") {
    let patient =
      filter.name === "All"
        ? checkups
        : checkups.filter((r) => r.name === filter.name);

    let departments =
      filter.nationality === "All"
        ? patient
        : patient.filter((r) => r.nationality === filter.nationality);

    return departments.filter((d) => {
      let date = new Date(d.date);

      return date >= filter.startDate && date <= filter.endDate;
    });
  } else if (filter.startDate !== "") {
    let patient =
      filter.name === "All"
        ? checkups
        : checkups.filter((r) => r.name === filter.name);

    let departments =
      filter.nationality === "All"
        ? patient
        : patient.filter((r) => r.nationality === filter.nationality);

    return departments.filter((d) => {
      let date = new Date(d.date);

      return date >= filter.startDate;
    });
  } else if (filter.endDate !== "") {
    let patient =
      filter.name === "All"
        ? checkups
        : checkups.filter((r) => r.name === filter.name);

    let departments =
      filter.nationality === "All"
        ? patient
        : patient.filter((r) => r.nationality === filter.nationality);

    return departments.filter((d) => {
      let date = new Date(d.date);

      return date <= filter.endDate;
    });
  } else {
    return [];
  }
}

export default Filter;
