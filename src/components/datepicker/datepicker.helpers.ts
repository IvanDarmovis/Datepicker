export const patternToValuesConverter = (date: string, pattern: string) => {
  let day = "";
  let month = "";
  let year = "";

  pattern.split("").forEach((char, idx) => {
    if (char.toLowerCase() === "d") day += date[idx];
    if (char.toLowerCase() === "m") month += date[idx];
    if (char.toLowerCase() === "y") year += date[idx];
  });

  return { day: Number(day), month: Number(month), year: Number(year) };
};

export const getInputPattern = (pattern: string) => {
  let iterator = pattern.split("").find((el) => !"dmy".includes(el));
  if (!iterator) iterator = ".";
  const sections = pattern.split(iterator).map((el) => `\\d{${el.length}}`);
  return sections.join(iterator);
};

export const valueToShow = (
  pattern: string,
  day: number,
  month: number,
  year: number
) =>
  pattern
    .replace("dd", day.toString().padStart(2, "0"))
    .replace("mm", (month + 1).toString().padStart(2, "0"))
    .replace("yyyy", year.toString());

export const getCurrentYearsRange = (year: number) => {
  const array = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
  return array.map((el) => el + year);
};

export const getLastDayInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0);

export const getFirstDayInMonth = (month: number, year: number) =>
  new Date(year, month, 1);

export const getWholeMonth = (month: number, year: number) => {
  const week: Array<number> = [];
  const firstDay = getFirstDayInMonth(month, year);
  const lastDay = getLastDayInMonth(month, year);

  const startWeekDay = firstDay.getDay();
  const monthDaysAmount = lastDay.getDate();

  if (startWeekDay === 0) week.length = 6;
  else week.length = startWeekDay - 1;

  week.fill(0);

  for (let i = 1; i <= monthDaysAmount; i++) {
    week.push(i);
  }

  while (week.length % 7 !== 0) {
    week.push(0);
  }

  return week;
};

export const commonDateChecker = (
  startDay: string | undefined,
  endDay: string | undefined,
  currentDate: Date,
  pattern: string
) => {
  if (startDay) {
    const { day, month, year } = patternToValuesConverter(startDay, pattern);
    const date = new Date(year, month - 1, day);

    if (date > currentDate) return { day, month: month - 1, year };
  }

  if (endDay) {
    const { day, month, year } = patternToValuesConverter(endDay, pattern);
    const date = new Date(year, month - 1, day);

    if (date < currentDate) return { day, month: month - 1, year };
  }

  return {
    day: currentDate.getDate(),
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  };
};

export const decreaseButtonChecker = (
  minDate: Date | undefined,
  layer: number,
  month: number,
  year: number,
  range: Array<number>
) => {
  if (!minDate) return true;

  if (layer === 0) {
    if (
      minDate.getFullYear() < year ||
      (minDate.getFullYear() <= year && minDate.getMonth() < month)
    )
      return true;
  }

  if (layer === 1 && minDate.getFullYear() < year) return true;

  if (layer === 2 && getPrevYearsRange(range).includes(minDate.getFullYear()))
    return true;

  return false;
};

export const increaseButtonChecker = (
  maxDate: Date | undefined,
  layer: number,
  month: number,
  year: number,
  range: Array<number>
) => {
  if (!maxDate) return true;

  if (layer === 0) {
    if (maxDate.getFullYear() > year) return true;

    if (maxDate.getFullYear() >= year && maxDate.getMonth() > month)
      return true;
  }

  if (layer === 1 && maxDate.getFullYear() > year) return true;

  if (layer === 2 && getNextYearsRange(range).includes(maxDate.getFullYear()))
    return true;

  return false;
};

export const getPrevYearsRange = (range: Array<number>) =>
  range.map((el) => el - 12);

export const getNextYearsRange = (range: Array<number>) =>
  range.map((el) => el + 12);

export const layerButtonChecker = (
  element: number,
  layer: number,
  canDecrease: boolean,
  canIncrease: boolean,
  minDate: Date | undefined,
  maxDate: Date | undefined
) => {
  if (layer === 0) {
    if (canDecrease && canIncrease) return true;

    if (
      !canDecrease &&
      !canIncrease &&
      minDate &&
      maxDate &&
      minDate.getDate() <= element &&
      maxDate.getDate() >= element
    )
      return true;

    if (!canDecrease && canIncrease && minDate && minDate.getDate() <= element)
      return true;

    if (canDecrease && !canIncrease && maxDate && maxDate.getDate() >= element)
      return true;
  }

  if (layer === 1) {
    if (canDecrease && canIncrease) return true;

    if (
      !canDecrease &&
      !canIncrease &&
      minDate &&
      maxDate &&
      minDate.getMonth() <= element &&
      maxDate.getMonth() >= element
    )
      return true;

    if (!canDecrease && canIncrease && minDate && minDate.getMonth() <= element)
      return true;

    if (canDecrease && !canIncrease && maxDate && maxDate.getMonth() >= element)
      return true;
  }

  if (layer === 2) {
    if (canDecrease && canIncrease) return true;

    if (
      !canDecrease &&
      !canIncrease &&
      minDate &&
      maxDate &&
      minDate.getFullYear() <= element &&
      maxDate.getFullYear() >= element
    )
      return true;

    if (
      canIncrease &&
      !canDecrease &&
      minDate &&
      minDate.getFullYear() <= element
    )
      return true;

    if (
      canDecrease &&
      !canIncrease &&
      maxDate &&
      maxDate.getFullYear() >= element
    )
      return true;
  }

  return false;
};
