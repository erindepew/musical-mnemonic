import fs from 'file-system';


Array.prototype.flatMap = function (f)
{
return this.reduce ((acc, x) => acc.concat (f (x)), [])
}

const combinations = (choices, n = 1) =>
n === 0
    ? [[]]
    : combinations (choices, n - 1) .flatMap (comb =>
        choices .map (c => [ c, ...comb ]))

        
const faces = [ 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']

fs.writeFile('./combinations.js', JSON.stringify(combinations (faces, 5)), (err) => {  
    if (err) throw err;
    console.log('Combinations saved!');
});
