export function toDbTimestamp(value) {
  if (!value) return null;
  return String(value).replace('T', ' ').slice(0, 16);
}

export function toInputDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  const pad = (part) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
