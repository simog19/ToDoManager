import DayJs from 'dayjs';
import DayJsCalendar from 'dayjs/plugin/calendar';
import DayJsIsBetween from 'dayjs/plugin/isBetween';
import DayJsIsToday from 'dayjs/plugin/isToday';

DayJs.extend(DayJsCalendar);
DayJs.extend(DayJsIsBetween);
DayJs.extend(DayJsIsToday);

export const formatDate = date => date.calendar(null, {
  sameDay: '[Today at] HH:mm',
  nextDay: '[Tomorrow at] HH:mm',
  nextWeek: 'dddd [at] HH:mm',
  lastDay: '[Yesterday at] HH:mm',
  lastWeek: '[Last] dddd [at] HH:mm',
  sameElse: 'dddd DD MMMM YYYY [at] HH:mm',
});

export default DayJs;
