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
    scale: 'C',
  }

  generateSynth = () => {
    const synth = new Tone.PolySynth(6, Tone.Synth).toMaster();
    let offset = 0;
    const notes = compressMnemonic(this.state.key, this.state.scale);
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
    const seedHex = mnemonicToSeedHex(this.state.key, this.state.scale);
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

  setScale = (e) => {
    this.setState({ scale: e.target.value })
  }

render() {
  const { key, seedHex, success, error, scale } = this.state;
  const scales = [
    {value: "C", label: 'C Major'},
    {value: "G", label: 'G Major'}, 
    {value: "D", label: 'D Major'}, 
    {value: "A", label: 'A Major'},
    {value: "E", label: 'E Major'},
    {value: "B", label: 'B Major'},
    {value: "F", label: 'F Major'},
    {value: 'Bb', label: 'B flat Major'},
    {value: 'Eb', label: 'E flat Major'},
    {value: 'Ab', label: 'A flat Major'},
    {value: 'Db', label: 'D flat Major'},
    {value: 'Gb', label: 'G flat Major'}];
  return (
    <div className="wrapper">
      <div className="controls">
        <select name="text" onChange={(e)=> this.setScale(e)} value={scale}> 
          { scales.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <button onClick={() => this.generateKey()}> Generate</button>
        <button onClick={() => this.play(false)} disabled={!key.length}> Play</button>
        { error ? <div className="error"> Passphrase is invalid</div> : ''}
        { success ? <div className="success"> Passphrase is valid</div> : ''}
        { !success && !error ?  <div className="validate">
          <input type="text" className="input" onChange={(e) => this.handleChange(e)}/>
          <button onClick={() => this.validate()} disabled={!key.length}> Validate</button>
        </div> : ''}
      </div>
      <div className="notes">
        <h3 className="header">Passphrase</h3>
        <span className="code">{key}</span>
      </div>
      <div className="seedHex">
        <h3 className="header">Seed Hex</h3>
        <span className="code">{seedHex}</span>
      </div>
    </div>
  );
}
}

export default App;
