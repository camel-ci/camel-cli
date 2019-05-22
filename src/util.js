'use strict';

const trimMultiLine = string => string.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, '');

const print = string => console.log(trimMultiLine(string));

const cleanString = string => string.replace(/\x1B(.*?)m/g, '').replace(/\x1B(.*?)K/g, '');

const buildDateTimeString = date => {
  const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  const timeString = date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
  return dateString + '-' + timeString;
};

module.exports = { print, cleanString, buildDateTimeString };
