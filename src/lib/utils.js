export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function uid() {
  return globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random()}`;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function sum(values) {
  return values.reduce((total, value) => total + Number(value || 0), 0);
}

export function roundHours(value) {
  return Math.round(Number(value || 0) * 10) / 10;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export function parseDateValue(value = new Date()) {
  if (value instanceof Date) {
    return new Date(value);
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
}

export function formatHours(value) {
  const normalized = roundHours(value);
  return `${normalized.toFixed(normalized % 1 === 0 ? 0 : 1)}h`;
}

export function formatShortDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(parseDateValue(value));
}

export function formatLongDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(parseDateValue(value));
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parseDateValue(value));
}

export function formatRelativeTime(value) {
  const diff = parseDateValue(value).getTime() - Date.now();
  const minutes = Math.round(diff / 60000);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  }

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, "hour");
  }

  const days = Math.round(hours / 24);
  return rtf.format(days, "day");
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function hoursToLabel(value) {
  return `${Number(value || 0)} hour${Number(value || 0) === 1 ? "" : "s"}`;
}

export function startOfDay(value = new Date()) {
  const date = parseDateValue(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(value, amount) {
  const date = parseDateValue(value);
  date.setDate(date.getDate() + amount);
  return date;
}

export function isoDay(value = new Date()) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = startOfDay(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isSameDay(a, b) {
  return isoDay(a) === isoDay(b);
}

export function byNewest(items, key) {
  return [...items].sort((a, b) => new Date(b[key]).getTime() - new Date(a[key]).getTime());
}

export function groupBy(items, getKey) {
  return items.reduce((accumulator, item) => {
    const key = getKey(item);
    accumulator[key] ??= [];
    accumulator[key].push(item);
    return accumulator;
  }, {});
}

export function deferredDelay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function stripUndefined(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );
}

export function makeAvatarHue(seed = "") {
  return (
    seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % 360
  );
}
