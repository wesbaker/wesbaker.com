import { z } from "astro/zod";

/**
 * A front-matter date, keeping the UTC offset it was written with.
 *
 * Posts are dated in the author's local time (`2012-02-01T00:00:00-04:00`), so
 * the displayed day has to come from that offset rather than from UTC or from
 * a named zone — the offsets in existing posts don't always agree with what
 * `America/New_York` was actually observing on the day in question.
 *
 * Front matter must quote any date that carries a time, because js-yaml
 * resolves unquoted timestamps to `Date` and the offset is lost before this
 * ever sees it. Bare `YYYY-MM-DD` dates are unambiguous and need no quotes.
 */
export interface SiteDate {
  /** The instant, used for sorting. */
  value: Date;
  /** `YYYY-MM-DD` in the offset the date was written with. */
  day: string;
  /** RFC 3339 timestamp, for `datetime` attributes and the Atom feed. */
  rfc3339: string;
  /** RFC 822 timestamp, as required by RSS 2.0. */
  rfc822: string;
}

const PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?\s*(Z|[+-]\d{2}:?\d{2})?)?$/;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const pad = (value: number) => String(value).padStart(2, "0");

function parse(input: string): SiteDate | null {
  const match = PATTERN.exec(input.trim());
  if (!match) return null;

  const [, year, month, day, hh = "00", mm = "00", ss = "00", zone = "Z"] =
    match;

  // Normalise `+0400` to `+04:00`; `Z` stays as-is.
  const offset =
    zone === "Z"
      ? "Z"
      : zone.includes(":")
        ? zone
        : `${zone.slice(0, 3)}:${zone.slice(3)}`;

  const rfc3339 = `${year}-${month}-${day}T${hh}:${mm}:${ss}${offset}`;
  const value = new Date(rfc3339);
  if (Number.isNaN(value.valueOf())) return null;

  // Shift the instant by the offset so the UTC getters read out the wall clock
  // in the written offset, which is what the RFC 822 string needs.
  const offsetMinutes =
    offset === "Z"
      ? 0
      : (offset.startsWith("-") ? -1 : 1) *
        (Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4, 6)));
  const local = new Date(value.getTime() + offsetMinutes * 60_000);
  const zoneSuffix =
    offset === "Z" ? "+0000" : `${offset.slice(0, 3)}${offset.slice(4, 6)}`;

  const rfc822 =
    `${DAYS[local.getUTCDay()]}, ${pad(local.getUTCDate())} ` +
    `${MONTHS[local.getUTCMonth()]} ${local.getUTCFullYear()} ` +
    `${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:` +
    `${pad(local.getUTCSeconds())} ${zoneSuffix}`;

  return { value, day: `${year}-${month}-${day}`, rfc3339, rfc822 };
}

/** Zod schema producing a {@link SiteDate} from front matter. */
export const siteDate = z
  .union([z.string(), z.date()])
  .transform((input, ctx) => {
    const raw = input instanceof Date ? input.toISOString() : input;
    const parsed = parse(raw);
    if (!parsed) {
      ctx.addIssue({ code: "custom", message: `Invalid date: ${raw}` });
      return z.NEVER;
    }
    return parsed;
  });
