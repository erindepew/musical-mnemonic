var fs = require('file-system');


Array.prototype.flatMap = function (f)
{
return this.reduce ((acc, x) => acc.concat (f (x)), [])
}

const combinations = (choices, n = 1) =>
n === 0
    ? [[]]
    : combinations (choices, n - 1) .flatMap (comb =>
        choices .map (c => [ c, ...comb ]))

        
const faces = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G']

const maxExponent = 5;

let permutations = []; 

for (i = 1; i <= maxExponent; i++) {
    const combo = combinations(faces, i)
    permutations = permutations.concat(combo.flatMap(item =>[item.join('')]));
}

const uniquePermutations = [... new Set(permutations)];

fs.writeFile('./combinations.js', JSON.stringify(uniquePermutations), (err) => {  
    if (err) throw err;
    console.log('Combinations saved!');
});
