import combinations from './combinations';
import randomBytes from 'randombytes';
import createHash from 'create-hash';
import {Buffer} from 'safe-buffer';
import {pbkdf2Sync} from 'pbkdf2';

const INVALID_MNEMONIC = 'Invalid mnemonic'
const INVALID_ENTROPY = 'Invalid entropy'
const INVALID_CHECKSUM = 'Invalid mnemonic checksum'

const salt = (password) => 'mnemonic' + (password || '');

const mnemonicToSeed = (mnemonic, password) => {
  const mnemonicBuffer = Buffer.from(mnemonic)
  const saltBuffer = Buffer.from(salt(password))

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
        return combinations[index].join(' ')
    })

    return chords.join(' ')
}

export const generateMnemonic = (strength = 128 ) => {
    if (strength % 32 !== 0) throw new TypeError(INVALID_ENTROPY)
    return entropyToMnemonic(randomBytes(strength / 8))
}

export const mnemonicToSeedHex = (mnemonic, password) => mnemonicToSeed(mnemonic, password).toString('hex');

// const mnemonic = generateMnemonic();

// console.log(mnemonicToSeedHex(mnemonic).length)
