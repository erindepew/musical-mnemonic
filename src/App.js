import React, { Component } from 'react';
import Tone from 'tone';
import { generateMnemonic, mnemonicToSeedHex, compressMnemonic, validateMnemonic } from './lib/index';

class App extends Component {
  state = {
    key: '',
    seedHex: '',
  }

  generateSynth = () => {
    const synth = new Tone.PolySynth(6, Tone.Synth).toMaster();
    let offset = 0;
    const notes = compressMnemonic(this.state.key);
    notes.forEach((note) => {
      setTimeout(function(){
        synth.triggerAttackRelease(note.note, note.length);
      }, offset);    
    offset += 250;
    });
  }

  play = (compressed) => {
    this.generateSynth(this.state.key.split(" "));
  }

  generateSeedHex = () => {
    const seedHex = mnemonicToSeedHex(this.state.key);
    this.setState({seedHex});
  }

  generateKey = () => {
    const key = generateMnemonic();
    this.generateSeedHex(key)
    this.setState({key})
  }

  validate = () => {
    validateMnemonic(this.state.key);
  }

render() {
  const { key, seedHex, receiveInput } = this.state;
  return (
    <div className="wrapper">
      <div className="controls">
        <button onClick={() => this.generateKey()}> Generate Secret Key</button>
        <button onClick={() => this.play(false)} disabled={!key.length}> Play Secret Key</button>
        <button onClick={() => this.validate()} disabled={!key.length}> Validate</button>
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
