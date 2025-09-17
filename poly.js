const fs = require("fs");

const raw = fs.readFileSync("roots.json");
const data = JSON.parse(raw);

const total = data.keys.n;
const need = data.keys.k;

let rootList = [];
for (let i = 1; i <= total; i++) {
    if (data[i]) {
        let base = BigInt(parseInt(data[i].base));
        let value = data[i].value;

        let num = BigInt(0);
        for (let j = 0; j < value.length; j++) {
            let digit = value[j];
            let digitNum = parseInt(digit, 36);
            num = num * base + BigInt(digitNum);
        }

        rootList.push(num);
    }
}

rootList = rootList.slice(0, need);
console.log("Roots:", rootList);

// Expand polynomial using roots
let coeffs = [BigInt(1)];
for (let i = 0; i < rootList.length; i++) {
    let newCoeffs = [];
    for (let j = 0; j <= coeffs.length; j++) {
        let left = j < coeffs.length ? coeffs[j] : BigInt(0);
        let right = j > 0 ? -rootList[i] * coeffs[j - 1] : BigInt(0);
        newCoeffs[j] = left + right;
    }
    coeffs = newCoeffs;
}

// Build polynomial string
let polyStr = "";
let deg = coeffs.length - 1;
for (let i = 0; i < coeffs.length; i++) {
    let c = coeffs[i];
    if (c === BigInt(0)) continue;
    if (i > 0 && c > 0) polyStr += " + ";
    if (c < 0) polyStr += " - ";
    if (c !== BigInt(1) || deg - i === 0) polyStr += c < 0 ? -c : c;
    if (deg - i > 0) polyStr += "x" + (deg - i > 1 ? "^" + (deg - i) : "");
}

console.log("Polynomial Equation: F(x) = " + polyStr);
