/**
 * Format numbers if divibiles of 4 or 5 or both
 * @param {number} n
 * @returns {*}
 */
const testDivisible = (n) => {
  return (n % 4 === 0 && n % 5 === 0) ? 'HelloWorld' : (n % 4 === 0) ? 'Hello' : (n % 5 === 0) ? 'World' : n;
}

/**
 * Print numbers from 1 to 100 with exceptions replaced by statements
 * @returns {string}
 */
const walkInThePark = () => {
  return Array.apply(null, {length: 100}).map(Number.call, Number).map((val) => testDivisible(val+1)).join(' ')
}

// RUN CODE
console.log(walkInThePark())
