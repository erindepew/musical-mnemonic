import combinations from './combinations';
import randomBytes from 'randombytes';
import createHash from 'create-hash';
import {Buffer} from 'safe-buffer';
import {pbkdf2Sync} from 'pbkdf2';

const INVALID_MNEMONIC = 'Invalid mnemonic'
const INVALID_ENTROPY = 'Invalid entropy'
const INVALID_CHECKSUM = 'Invalid mnemonic checksum'

const salt = (passchord) => 'mnemonic' + (passchord || '');

const mnemonicToSeed = (mnemonic, passchord) => {
  const mnemonicBuffer = Buffer.from(mnemonic)
  const saltBuffer = Buffer.from(salt(passchord))

  return pbkdf2Sync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512')
}

const lpad = (str, padString, length) => {
    while (str.length < length) str = padString + str
    return str
}

const binaryToByte = (bin) => parseInt(bin, 2);
  
const bytesToBinary = (bytes) => bytes.map((x) => lpad(x.toString(2), '0', 8)).join('');
  
const deriveChecksumBits = (entropyBuffer) => {
    const ENT = entropyBuffer.length * 8
    const CS = ENT / 32
    const hash = createHash('sha256').update(entropyBuffer).digest()
  
    return bytesToBinary([].slice.call(hash)).slice(0, CS)
  }

const entropyToMnemonic = (entropy) => {
    if (!Buffer.isBuffer(entropy)) entropy = Buffer.from(entropy, 'hex')

    // 128 <= ENT <= 256
    if (entropy.length < 16) throw new TypeError(INVALID_ENTROPY)
    if (entropy.length > 32) throw new TypeError(INVALID_ENTROPY)
    if (entropy.length % 4 !== 0) throw new TypeError(INVALID_ENTROPY)

   const entropyBits = bytesToBinary([].slice.call(entropy))
   const checksumBits = deriveChecksumBits(entropy)

   const bits = entropyBits + checksumBits
   const chunks = bits.match(/(.{1,11})/g)
   const chords = chunks.map((binary) => {
        const index = binaryToByte(binary)
        return combinations[index];
    })
    return chords.join(' ')
}

export const generateMnemonic = (strength = 128 ) => {
    if (strength % 32 !== 0) throw new TypeError(INVALID_ENTROPY)
    return entropyToMnemonic(randomBytes(strength / 8))
}

export const mnemonicToSeedHex = (mnemonic, passchord) => mnemonicToSeed(mnemonic, passchord).toString('hex');

export const compressMnemonic = (mnemonic) => {
    const concat = (x,y) => x.concat(y);
    const flatMap = (f,xs) => xs.map(f).reduce(concat, []);
    return flatMap((chunk) => {
        let chord = [];
        let scale = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0};
        let checksum = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        const notes = chunk.split("");
        notes.forEach((note) => {
            scale[note] = scale[note] + 1;
        });

        let isChord = true;
        let base = 4;

        Object.keys(scale).forEach(function(note) {
            if (scale[note] !== 0 && scale[note] === notes.length) {
                isChord = false;
            }
            if (scale[note] !== 0 && scale[note] !== notes.length && scale[note] >= 3 ) {
                base = 6 - scale[note];
            }
        });
        if (isChord) {
            notes.forEach((note, index) => {
                if (notes.indexOf(note) !== index) {
                    base = base + 1;
                }
                chord.push(`${note}${base}`);
             });
             return [{note: [`${checksum[notes.length - 1]}4`], length: "4n"}, { note: chord, length: "4n" }]
        }
        else {
            return [{ note: [`${checksum[notes.length - 1]}4`], length: "4n"}, {note: `${notes[0]}4`, length: `${4 / notes.length}n`} ] 
        }
    }, mnemonic.split(" "));
}

export const mnemonicToEntropy = (mnemonic) => {
    var chords = mnemonic.split(' ')
    if (chords.length % 3 !== 0) throw new Error(INVALID_MNEMONIC)
  
    // convert chord indices to 11 bit binary strings
    var bits = chords.map(function (chord) {
      var index = combinations.indexOf(chord)
      if (index === -1) throw new Error(INVALID_MNEMONIC)
  
      return lpad(index.toString(2), '0', 11)
    }).join('')
  
    // split the binary string into ENT/CS
    var dividerIndex = Math.floor(bits.length / 33) * 32
    var entropyBits = bits.slice(0, dividerIndex)
    var checksumBits = bits.slice(dividerIndex)
  
    // calculate the checksum and compare
    var entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte)
    if (entropyBytes.length < 16) throw new Error(INVALID_ENTROPY)
    if (entropyBytes.length > 32) throw new Error(INVALID_ENTROPY)
    if (entropyBytes.length % 4 !== 0) throw new Error(INVALID_ENTROPY)
  
    var entropy = Buffer.from(entropyBytes)
    var newChecksum = deriveChecksumBits(entropy)
    if (newChecksum !== checksumBits) throw new Error(INVALID_CHECKSUM)
  
    return entropy.toString('hex')
  }


export const validateMnemonic = (mnemonic) => {
    try {
      mnemonicToEntropy(mnemonic, combinations)
    } catch (e) {
        console.log(e);
      return false
    }
  
    return true
  }
