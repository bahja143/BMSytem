function Filter(deaths, filter) {
  if (filter.startDate === "" && filter.endDate === "") {
    let result =
      filter.name === "All"
        ? deaths
        : deaths.filter((r) => r.name === filter.name);

    return filter.nationality === "All"
      ? result
      : result.filter((r) => r.nationality === filter.nationality);
  } else if (filter.startDate !== "" && filter.endDate !== "") {
    let patient =
      filter.name === "All"
        ? deaths
        : deaths.filter((r) => r.name === filter.name);

    let departments =
      filter.nationality === "All"
        ? patient
        : patient.filter((r) => r.nationality === filter.nationality);

    return departments.filter((d) => {
      let dateOfDeath = new Date(d.dateOfDeath);

      return dateOfDeath >= filter.startDate && dateOfDeath <= filter.endDate;
    });
  } else if (filter.startDate !== "") {
    let patient =
      filter.name === "All"
        ? deaths
        : deaths.filter((r) => r.name === filter.name);

    let departments =
      filter.nationality === "All"
        ? patient
        : patient.filter((r) => r.nationality === filter.nationality);

    return departments.filter((d) => {
      let dateOfDeath = new Date(d.dateOfDeath);

      return dateOfDeath >= filter.startDate;
    });
  } else if (filter.endDate !== "") {
    let patient =
      filter.name === "All"
        ? deaths
        : deaths.filter((r) => r.name === filter.name);

    let departments =
      filter.nationality === "All"
        ? patient
        : patient.filter((r) => r.nationality === filter.nationality);

    return departments.filter((d) => {
      let dateOfDeath = new Date(d.dateOfDeath);

      return dateOfDeath <= filter.endDate;
    });
  } else {
    return [];
  }
}

export default Filter;
