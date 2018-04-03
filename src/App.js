import React, { Component } from 'react';
import Tone from 'tone';
import { generateMnemonic, mnemonicToSeedHex, compressMnemonic } from './lib/index';

class App extends Component {
  state = {
    key: '',
    compressedKey: [],
    seedHex: '',
    receiveInput: false,
  }
  generateSynth = (notes, synth) => {
    let offset = 0;
    notes.forEach((note) => {
      setTimeout(function(){
        synth.triggerAttackRelease(note, "4n")
      }, offset);    
    offset += 250;
    });
  }

  generateCompressedSynth = (notes, synth) => {
    let offset = 0;
    debugger;
    notes.forEach((note) => {
      const length = 4 / note.length;
      setTimeout(function(){
        synth.triggerAttackRelease(note.note, `${length}n`)
      }, offset);    
    offset += (1000 / length);
    });
  }

  play = (compressed) => {
    const synth = new Tone.Synth().toMaster();
    if (compressed) {
      this.generateCompressedSynth(this.state.compressedKey, synth);
    }
    else {
      this.generateSynth(this.state.key.split(" "), synth);
    }
  }

  generateSeedHex = () => {
    const seedHex = mnemonicToSeedHex(this.state.key);
    this.setState({seedHex});
  }

  generateKey = () => {
    const key = generateMnemonic();
    this.generateSeedHex(key)
    const compressedKey = compressMnemonic(key);
    this.setState({key, compressedKey})
  }

  inputSecretKey = () => {
    this.setState({receiveInput: true})
  }

  toggleInputSecretKey = (value) => {
    this.setState({receiveInput: !value})
  }

render() {
  const { key, seedHex, receiveInput } = this.state;
  return (
    <div className="wrapper">
      <div className="controls">
        <button onClick={() => this.generateKey()}> Generate Secret Key</button>
        <button onClick={() => this.play(false)} disabled={!key.length}> Play Secret Key</button>
        <button onClick={() => this.play(true)} disabled={!key.length}> Play Compressed Secret Key</button>
        <div className={receiveInput ? 'toggleOn' : 'toggleOff'} onClick={() => this.toggleInputSecretKey(receiveInput)}>
          Input Secret Key: 
          <div className="toggle"> </div>
        </div>
      </div>
      <div className="seedHex">
        <h3 className="header">Seed Hex</h3>
        <span className="code">{seedHex}</span>
      </div>
      <div className="notes">
        <h3 className="header">Notes</h3>
        <span className="code">{key}</span>
      </div>
    </div>
  );
}
}

export default App;
