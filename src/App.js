import React, { Component } from 'react';
import Tone from 'tone';
import combinations from './lib/combinations';
import { generateMnemonic } from './lib/index';

class App extends Component {
  state = {
    key: []
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
    this.generateSynth(this.state.key, synth);
  }

  generateKey = () => {
    const key = generateMnemonic().split(" ");;
    this.setState({key})
  }

render() {
  return (
    <div>
      <button onClick={() => this.generateKey()}> Generate Secret Key</button>
      <button onClick={() => this.play()}> Play Secret Key</button>
    </div>
  );
}
}

export default App;
