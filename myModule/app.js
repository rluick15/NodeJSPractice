'use strict';
const Enigma = require('./enigma');
const eng = new Enigma('magrathea');

let encodedString = eng.encode("Don't Panic!");
let decodedString = eng.decode(encodedString);

console.log("Encoded ", encodedString);
console.log("Decoded ", decodedString);