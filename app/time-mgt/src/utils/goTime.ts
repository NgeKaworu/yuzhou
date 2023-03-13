type Duration = number;

export const Nanosecond: Duration = 1;
export const Microsecond: Duration = 1000 * Nanosecond;
export const Millisecond: Duration = 1000 * Microsecond;
export const Second: Duration = 1000 * Millisecond;
export const Minute: Duration = 60 * Second;
export const Hour: Duration = 60 * Minute;

export function nsFormat(nanosecond?: Duration): string | undefined {
  if (!nanosecond) return;

  const HH = ~~(nanosecond / (1000 * 1000 * 1000 * 60 * 60));
  const mm = (
    (nanosecond % (1000 * 1000 * 1000 * 60 * 60)) /
    (1000 * 1000 * 1000 * 60)
  ).toFixed(2);

  let str = '';

  if (HH) {
    str += `${HH}小时`;
  }

  if (mm) {
    str += `${mm}分钟`;
  }

  return str;
}
