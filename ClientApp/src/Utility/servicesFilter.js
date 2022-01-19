function Filter(services, filter) {
  if (filter.name === "All" && filter.date === "") {
    return services;
  } else if (filter.name !== "All" && filter.date !== "") {
    return services.filter(
      (s) =>
        s.category === filter.name && new Date(s.date) >= new Date(filter.date)
    );
  } else if (filter.name !== "All") {
    return services.filter((s) => s.category === filter.name);
  } else if (filter.date !== "") {
    return services.filter((s) => new Date(s.date) >= new Date(filter.date));
  } else {
    return [];
  }
}

export default Filter;
