"use strict";
const map = new Map();
console.log(map);
map.set("lol", new Set());
console.log(map.get("lol").add(""));
console.log(map.values());
