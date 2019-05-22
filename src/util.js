'use strict';

const trimMultiLine = string => string.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, '');

const print = string => console.log(trimMultiLine(string));

const cleanString = string => string.replace(/\x1B(.*?)m/g, '').replace(/\x1B(.*?)K/g, '');

const buildDateTimeString = date => {
  const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  const timeString = date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
  return dateString + '-' + timeString;
};

const elapsedTime = (now, pastDate) => {
  let delta = Math.abs((now - pastDate) / 1000);
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  return days + ' days ' + hours + ' hours ' + minutes + ' minutes';
};

module.exports = { print, cleanString, buildDateTimeString, elapsedTime };
