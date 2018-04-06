import React, { Component } from 'react';
import Tone from 'tone';
import { generateMnemonic, mnemonicToSeedHex, compressMnemonic, validateMnemonic } from './lib/index';

class App extends Component {
  state = {
    key: '',
    seedHex: '',
    validateKey: '',
    success: false,
    error: false,
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
    const isValid = validateMnemonic(this.state.validateKey);
    if (isValid) {
      this.setState({ success: true})
    }
    else {
      this.setState({ error: true})
    }
    setTimeout(() => {
      this.setState({ success: false, error: false });
      }, 1000); 
  }

  handleChange = (e) => {
    this.setState({ validateKey: e.target.value})
  }

render() {
  const { key, seedHex, success, error } = this.state;
  return (
    <div className="wrapper">
      <div className="controls">
        <button onClick={() => this.generateKey()}> Generate Secret Key</button>
        <button onClick={() => this.play(false)} disabled={!key.length}> Play Secret Key</button>
        { error ? <div class="error"> Key is invalid</div> : ''}
        { success ? <div class="success"> Key is valid</div> : ''}
        { !success && !error ?  <div className="validate">
          <input type="text" className="input" onChange={(e) => this.handleChange(e)}/>
          <button onClick={() => this.validate()} disabled={!key.length}> Validate</button>
        </div> : ''}
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
