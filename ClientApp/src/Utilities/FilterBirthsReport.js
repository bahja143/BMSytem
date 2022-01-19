function Filter(births, filter) {
  if (filter.startDate === "" && filter.endDate === "") {
    let result =
      filter.father === "All"
        ? births
        : births.filter((r) => r.father === filter.father);

    return filter.mother === "All"
      ? result
      : result.filter((r) => r.mother === filter.mother);
  } else if (filter.startDate !== "" && filter.endDate !== "") {
    let fathers =
      filter.father === "All"
        ? births
        : births.filter((r) => r.father === filter.father);

    let mothers =
      filter.mother === "All"
        ? fathers
        : fathers.filter((r) => r.mother === filter.mother);

    return mothers.filter((d) => {
      let dateOfBirth = new Date(d.dateOfBirth);

      return dateOfBirth >= filter.startDate && dateOfBirth <= filter.endDate;
    });
  } else if (filter.startDate !== "") {
    let fathers =
      filter.father === "All"
        ? births
        : births.filter((r) => r.father === filter.father);

    let mothers =
      filter.mother === "All"
        ? fathers
        : fathers.filter((r) => r.mother === filter.mother);

    return mothers.filter((d) => {
      let dateOfBirth = new Date(d.dateOfBirth);

      return dateOfBirth >= filter.startDate;
    });
  } else if (filter.endDate !== "") {
    let fathers =
      filter.father === "All"
        ? births
        : births.filter((r) => r.father === filter.father);

    let mothers =
      filter.mother === "All"
        ? fathers
        : fathers.filter((r) => r.mother === filter.mother);

    return mothers.filter((d) => {
      let dateOfBirth = new Date(d.dateOfBirth);

      return dateOfBirth <= filter.endDate;
    });
  } else {
    return [];
  }
}

export default Filter;
