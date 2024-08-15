const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
};

export { formatDate };
