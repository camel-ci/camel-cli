'use strict';

const trimMultiLine = string => string.replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, '');

const print = string => console.log(trimMultiLine(string));

module.exports = { print };
