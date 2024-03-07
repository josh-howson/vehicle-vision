export const prefixWithAnOrA = (value: string) => {
  if (!value) return '';

  let prefix;
  if (value.trim()[0].toLowerCase() === "a")
    prefix = "an";
  else
    prefix = 'a';

  return `${prefix} ${value}`;
}
