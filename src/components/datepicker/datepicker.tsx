import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  patternToValuesConverter,
  valueToShow,
  getCurrentYearsRange,
  getFirstDayInMonth,
  getLastDayInMonth,
  getWholeMonth,
  commonDateChecker,
  getPrevYearsRange,
  getNextYearsRange,
  decreaseButtonChecker,
  increaseButtonChecker,
  layerButtonChecker,
  getInputPattern
} from './datepicker.helpers';
import { months, days, labelPattern } from './datepicker.constants';
import Calendar from '../../assets/icons/calendar.svg';
import Arrow from '../../assets/icons/arrow-right.svg';

export type DatepickerProps = {
  startDay?: string;
  endDay?: string;
  pattern?: string;
} & React.ComponentPropsWithRef<'input'>;

export const Datepicker: React.FC<DatepickerProps> = ({
  startDay,
  endDay,
  pattern = labelPattern
}) => {
  const currentDate = new Date();
  const checkedDate = commonDateChecker(startDay, endDay, currentDate, pattern);

  const [openCalendar, setOpenCalendar] = useState(false);
  const [pinedData, setPinedData] = useState<number>(checkedDate.day);
  const [pinedMonth, setPinedMonth] = useState<number>(checkedDate.month);
  const [pinedYear, setPinedYear] = useState<number>(checkedDate.year);
  const [selectedFullData, setSelectedFullDate] = useState<string>('');
  const [layer, setLayer] = useState<number>(0);
  const [yearsRange, setYearsRange] = useState<Array<number>>([]);
  const [minDate, setMinDate] = useState<Date>();
  const [maxDate, setMaxDate] = useState<Date>();
  const [label, setLabel] = useState<string>('');
  const [red, setRed] = useState(false);

  useEffect(() => {
    starterLayerCheck();
  }, [pinedData, pinedMonth, pinedYear]);

  const starterLayerCheck = () => {
    if (layer === 0 && !listElementChecker(pinedData)) {
      if (minDate) setPinedData(minDate.getDate());
      else if (maxDate) setPinedData(maxDate.getDate());
    }

    if (layer === 1 && !listElementChecker(pinedMonth)) {
      if (minDate) setPinedData(minDate.getMonth());
      else if (maxDate) setPinedData(maxDate.getMonth());
    }

    if (layer === 2 && !listElementChecker(pinedYear)) {
      if (minDate) setPinedData(minDate.getFullYear());
      else if (maxDate) setPinedData(maxDate.getFullYear());
    }
  };

  const timeBordersChecker = () => {
    if (startDay) {
      const { day, month, year } = patternToValuesConverter(startDay, pattern);
      const date = new Date(year, month - 1, day);
      setMinDate(date);

      if (date > currentDate) {
        setPinedData(day);
        setPinedMonth(month - 1);
        setPinedYear(year);

        setLabel(months[month] + ' ' + year);
        setSelectedFullDate(valueToShow(pattern, day, month, year));
      }
    }

    if (endDay) {
      const { day, month, year } = patternToValuesConverter(endDay, pattern);
      const date = new Date(year, month - 1, day);
      setMaxDate(date);

      if (!startDay && date < currentDate) {
        setPinedData(day);
        setPinedMonth(month - 1);
        setPinedYear(year);

        setLabel(months[month] + ' ' + year);
        setSelectedFullDate(valueToShow(pattern, day, month, year));
      }
    }

    if (!startDay && !endDay) setLabel(months[pinedMonth] + ' ' + pinedYear);
  };

  const iconClick = () => {
    if (!openCalendar) {
      timeBordersChecker();
      setLayer(0);
      if (selectedFullData.length === 0)
        setYearsRange(getCurrentYearsRange(pinedYear));
    }
    setOpenCalendar(!openCalendar);
  };

  const onDayClick = (
    day: number,
    idx: number,
    dayAnotherMonth?: number
  ): void => {
    if (day === 0 && idx < 7) {
      dayAnotherMonth && setPinedData(dayAnotherMonth);
      dayAnotherMonth &&
        setSelectedFullDate(
          valueToShow(pattern, dayAnotherMonth, pinedMonth, pinedYear)
        );
      decreaseClick();
      return;
    }
    if (day === 0 && idx > 7) {
      dayAnotherMonth && setPinedData(dayAnotherMonth);
      dayAnotherMonth &&
        setSelectedFullDate(
          valueToShow(pattern, dayAnotherMonth, pinedMonth, pinedYear)
        );
      increaseClick();
      return;
    }
    setPinedData(day);
    setSelectedFullDate(valueToShow(pattern, day, pinedMonth, pinedYear));
    setOpenCalendar(false);
  };

  const canDecrease = () => {
    return decreaseButtonChecker(
      minDate,
      layer,
      pinedMonth,
      pinedYear,
      yearsRange
    );
  };

  const canIncrease = () => {
    return increaseButtonChecker(
      maxDate,
      layer,
      pinedMonth,
      pinedYear,
      yearsRange
    );
  };

  const listElementChecker = (element: number) => {
    return layerButtonChecker(
      element,
      layer,
      canDecrease(),
      canIncrease(),
      minDate,
      maxDate
    );
  };

  const todayButtonChecker = () => {
    if (minDate && minDate > currentDate) return false;
    if (maxDate && maxDate < currentDate) return false;

    return true;
  };

  const onMonthClick = (idx: number) => {
    setPinedMonth(idx);
    setLayer(0);
  };

  const onYearClick = (year: number) => {
    setPinedYear(year);
    setLayer(1);
  };

  const decreaseClick = () => {
    if (layer === 0) {
      if (pinedMonth === 0) {
        setPinedYear(pinedYear - 1);
        setPinedMonth(11);
        return;
      }

      setPinedMonth(pinedMonth - 1);
    }

    if (layer === 1) setPinedYear(pinedYear - 1);

    if (layer === 2) setYearsRange(getPrevYearsRange(yearsRange));
  };

  const increaseClick = () => {
    if (layer === 0) {
      if (pinedMonth === 11) {
        setPinedYear(pinedYear + 1);
        setPinedMonth(0);
        return;
      }

      setPinedMonth(pinedMonth + 1);
    }

    if (layer === 1) setPinedYear(pinedYear + 1);

    if (layer === 2) setYearsRange(getNextYearsRange(yearsRange));
  };

  const onTodayClick = () => {
    setPinedMonth(currentDate.getMonth());
    setPinedYear(currentDate.getFullYear());
    onDayClick(currentDate.getDate(), currentDate.getDate());
  };

  const onLabelClick = () => {
    if (layer === 0) setLayer(1);
    if (layer === 1) setLayer(2);
  };

  const makeItRed = () => {
    setRed(true);
    const id = setTimeout(() => {
      setRed(false);
      clearTimeout(id);
    }, 1000);
  };

  const onManualInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, validity } = e.target;

    if (validity.valid) {
      const { day, month, year } = patternToValuesConverter(value, pattern);

      if (month > 12 || new Date(year, month, 0).getDate() < day) {
        setSelectedFullDate('');
        makeItRed();
        return;
      }

      setPinedData(day);
      setPinedMonth(month - 1);
      setPinedYear(year);
    }

    setSelectedFullDate(value);
  };

  const dayToShow = (day: number, idx: number) => {
    if (day === 0) {
      if (idx < 7) {
        let month = pinedMonth;
        let year = pinedYear;
        if (month === 0) {
          month = 11;
          year = year - 1;
        } else {
          month = month - 1;
        }

        const iterator =
          getFirstDayInMonth(pinedMonth, pinedYear).getDay() === 0
            ? idx - 6
            : idx - getFirstDayInMonth(pinedMonth, pinedYear).getDay() + 1;

        return getWholeMonth(month, year)
          .filter((el) => el !== 0)
          .at(iterator);
      }

      if (idx > 7) {
        let month = pinedMonth;
        let year = pinedYear;
        if (month === 11) {
          month = 0;
          year = year + 1;
        } else {
          month = month + 1;
        }

        const iterator =
          getFirstDayInMonth(pinedMonth, pinedYear).getDay() === 0
            ? idx - 6 - getLastDayInMonth(pinedMonth, pinedYear).getDate()
            : 1 +
              idx -
              getLastDayInMonth(pinedMonth, pinedYear).getDate() -
              getFirstDayInMonth(pinedMonth, pinedYear).getDay();

        return getWholeMonth(month, year)
          .filter((el) => el !== 0)
          .at(iterator);
      }
    }

    return day;
  };

  return (
    <div className=''>
      <div className='relative w-[320px]'>
        <input
          onInput={onManualInput}
          placeholder={pattern}
          pattern={getInputPattern(pattern)}
          className={`w-full border-2 border-r-2 px-1 outline-none transition-colors duration-1000 ${
            red ? 'border-red-500' : 'border-gray-200'
          }`}
          value={selectedFullData}
        />
        <button className='absolute right-2 top-1 h-4' onClick={iconClick}>
          <img
            src={Calendar}
            alt='calendar'
            className='ml-auto h-4 hover:cursor-pointer'
          />
        </button>
      </div>
      {openCalendar && (
        <div
          className={`
            ${openCalendar ? 'border-2' : ''}
            border-r-2
            border-gray-300
            ${openCalendar ? 'max-h-auto' : 'max-h-0'}
            p-3
        `}
        >
          <div className='my-2 flex w-full justify-between'>
            <button
              disabled={!canDecrease()}
              onClick={decreaseClick}
              className='flex h-5 w-5 justify-center rounded-full hover:bg-orange-400 hover:text-white disabled:hover:bg-gray-500'
            >
              <img
                src={Arrow}
                alt='decrease'
                className='rotate-180 self-center'
              />
            </button>
            <button
              className='flex rounded-full px-3 hover:bg-orange-400 hover:text-white'
              onClick={onLabelClick}
            >
              {layer === 0 && label}
              {layer === 1 && pinedYear}
              {layer === 2 && `${yearsRange[0]} - ${yearsRange.at(-1)}`}
            </button>
            <button
              disabled={!canIncrease()}
              onClick={increaseClick}
              className='flex h-5 w-5 justify-center rounded-full hover:bg-orange-400 hover:text-white disabled:hover:bg-gray-500'
            >
              <img src={Arrow} alt='increase' className='self-center' />
            </button>
          </div>

          <div className='my-2 flex w-full justify-between'>
            {days.map((day, idx) => (
              <span key={idx}>{day.toUpperCase()}</span>
            ))}
          </div>

          {layer === 0 && (
            <div className='grid grid-cols-7 gap-y-1 border-b border-t border-dashed border-gray-200 py-2'>
              {pinedMonth !== undefined &&
                pinedYear !== undefined &&
                getWholeMonth(pinedMonth, pinedYear).map((day, idx) => (
                  <button
                    disabled={!listElementChecker(day)}
                    key={idx}
                    onClick={() => onDayClick(day, idx, dayToShow(day, idx))}
                    className={`h-8 w-8 rounded-full hover:bg-orange-400 hover:text-white disabled:hover:bg-gray-500 ${
                      day === pinedData && listElementChecker(day)
                        ? 'bg-orange-400 text-white'
                        : ''
                    } ${
                      day === pinedData && !listElementChecker(day)
                        ? 'bg-gray-500 text-white'
                        : ''
                    }  ${day === 0 ? 'text-gray-500' : ''} ${
                      idx % 7 === 6 && day !== 0 ? 'text-orange-400' : ''
                    } ${idx % 7 === 6 && day === 0 ? 'text-orange-200' : ''}`}
                  >
                    {dayToShow(day, idx)}
                  </button>
                ))}
            </div>
          )}

          {layer === 1 && (
            <div className='grid grid-cols-4 gap-y-7 border-b border-t border-dashed border-gray-200 py-5'>
              {months.map((el, idx) => (
                <button
                  disabled={!listElementChecker(idx)}
                  key={idx}
                  onClick={() => onMonthClick(idx)}
                  className={`rounded-full ${
                    idx === pinedMonth && listElementChecker(idx)
                      ? 'bg-orange-400 text-white'
                      : ''
                  } ${
                    idx === pinedMonth && !listElementChecker(idx)
                      ? 'bg-gray-500 text-white'
                      : ''
                  } hover:bg-orange-400 hover:text-white disabled:hover:bg-gray-500`}
                >
                  {el.substring(0, 3)}
                </button>
              ))}
            </div>
          )}

          {layer === 2 && (
            <div className='grid grid-cols-4 gap-y-7 border-b border-t border-dashed border-gray-200 py-5'>
              {yearsRange.map((el, idx) => (
                <button
                  disabled={!listElementChecker(el)}
                  key={idx}
                  onClick={() => onYearClick(el)}
                  className={`rounded-full ${
                    el === pinedYear && listElementChecker(el)
                      ? 'bg-orange-400 text-white'
                      : ''
                  } ${
                    el === pinedYear && !listElementChecker(el)
                      ? 'bg-gray-500 text-white'
                      : ''
                  } hover:bg-orange-400 hover:text-white disabled:hover:bg-gray-500`}
                >
                  {el}
                </button>
              ))}
            </div>
          )}

          <div className='flex justify-center py-1 '>
            <button
              disabled={!todayButtonChecker()}
              onClick={onTodayClick}
              className='w-min rounded-full px-3 hover:bg-orange-400 hover:text-white disabled:hover:bg-gray-500'
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
