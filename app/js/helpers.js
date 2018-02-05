function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
let pipe = (...fns) => data => fns.reduce((y, f) => f(y), data)

const compareVectors = ([aX, aY], [bX, bY]) => aX === bX && aY === bY;
module.exports = { rand, pipe, compareVectors }