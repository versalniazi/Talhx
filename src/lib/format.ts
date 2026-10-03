export const formatGBP = (amount: number, opts: { decimals?: boolean } = {}) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: opts.decimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }).format(
    new Date(iso),
  );

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");
