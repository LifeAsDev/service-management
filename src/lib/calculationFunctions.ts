const formatDate = (date: Date | string | undefined): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  if (date)
    return date.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  else return "";
};

export { formatDate };
