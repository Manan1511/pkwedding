function parseIsoDate(date: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    throw new RangeError(`Invalid wedding date: ${date}`);
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new RangeError(`Invalid wedding date: ${date}`);
  }

  return parsed;
}

export function formatWeddingDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseIsoDate(date));
}

export function istToUtc(date: string, time: string): Date {
  const parsedDate = parseIsoDate(date);
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);

  if (!timeMatch) {
    throw new RangeError(`Invalid wedding time: ${time}`);
  }

  const [, hourText, minuteText] = timeMatch;
  const hours = Number(hourText);
  const minutes = Number(minuteText);
  const localWallClockAsUtc = Date.UTC(
    parsedDate.getUTCFullYear(),
    parsedDate.getUTCMonth(),
    parsedDate.getUTCDate(),
    hours,
    minutes,
  );
  const istOffsetMilliseconds = (5 * 60 + 30) * 60 * 1000;

  return new Date(localWallClockAsUtc - istOffsetMilliseconds);
}
