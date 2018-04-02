import React, { Component } from 'react';
import Tone from 'tone';
import { generateMnemonic, mnemonicToSeedHex } from './lib/index';

class App extends Component {
  state = {
    key: [],
    seedHex: '',
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

  play = () => {
    const synth = new Tone.Synth().toMaster();
    debugger;
    this.generateSynth(this.state.key.split(" "), synth);
  }

  generateSeedHex = () => {
    const seedHex = mnemonicToSeedHex(this.state.key);
    debugger;
    this.setState({seedHex});
  }

  generateKey = () => {
    const key = generateMnemonic();
    this.generateSeedHex(key)
    this.setState({key})
  }

render() {
  const { key, seedHex } = this.state;
  console.log(key.length)
  return (
    <div className="wrapper">
      <div className="controls">
        <button onClick={() => this.generateKey()}> Generate Secret Key</button>
        <button onClick={() => this.play()} disabled={!key.length}> Play Secret Key</button>
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
