export const formatDate = (date: Date, locale?: Intl.LocalesArgument) => {
  const time = new Intl.DateTimeFormat(locale || "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  const datePart = new Intl.DateTimeFormat(locale || "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);

  return `${time} · ${datePart}`;
};
