import * as jstz from "jstimezonedetect";
import * as moment from "moment";

const calculateTimeLeftUnits = (timeLeft: number): [number, number, number] => {
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(timeLeft / day);
  const hours = Math.floor((timeLeft % day) / hour);
  const minutes = Math.floor(((timeLeft % day) % hour) / minute);

  return [days, hours, minutes];
};

const calculateTimeLeft = (value: moment.Moment | Date, asUtc: boolean) => {
  return asUtc
    ? moment.utc(value).diff(moment().utc(), "seconds")
    : moment(value).diff(moment(), "seconds");
};

const utcTime = (value: Date) => moment.utc(value).format("MMMM Do YYYY, HH:mm");
const localTime = (value: Date) => moment(value).format("MMMM Do YYYY, HH:mm");
const timeZone = () => jstz.determine().name();
const weekdayLocal = (date: Date) => moment(date).format("ddd");
const weekdayUTC = (date: Date) => moment.utc(date).format("ddd");

export {
  calculateTimeLeftUnits,
  utcTime,
  localTime,
  timeZone,
  weekdayLocal,
  weekdayUTC,
  calculateTimeLeft,
};

// TODO: Move whole file to general app utils folder
