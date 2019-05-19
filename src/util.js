'use strict';

const trimMultiLine = string => string.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, '');

const print = string => console.log(trimMultiLine(string));

// TODO: actually implement this function to get rid of special characters in command output strings
const cleanString = string => string;

const buildDateTimeString = date => {
  const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  const timeString = date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
  return dateString + '-' + timeString;
};

module.exports = { print, cleanString, buildDateTimeString };
