// Basic Example

import { useState } from "react";

// ❌ Problem: State in wrong place
function TempratureInput({ scale }) {
  const [temperature, setTemprature] = useState('');

  return (
    <input 
      value={temperature}
      onChange={(e) => setTemprature(e.target.value)}
    />
  );
}

// Two separate inputs with independent state - can't sync them!
function App() {
  return (
    <div>
      <TempratureInput scale="c" />
      <TempratureInput scale="f" />
    </div>
  );
}

// ✅ Solution: Lift state up
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <div>
      <label>Temperature in {scale === 'c' ? 'Celsius' : 'Fahrenheit'}:</label>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </div>
  );
}

function App() {
  const [temperature, setTemprature] = useState('');
  const [scale, setState] = useState('c');

  const handleCelciusChange =  (temp) => {
    setTemprature(temp);
    setScale('c');
  };

  const handleFahrenheitChange = (temp) => {
    setTemprature(temp);
    setState('f');
  };

  const celsius = scale === 'f'
    ? ((temperature - 32) * 5/9).toFixed(1)
    : temperature;

  return (
    <div>
      <TemperatureInput
        scale="c"    
        temperature={celsius}
        onTemperatureChange={handleCelciusChange}
      />
      <TemperatureInput
        scale="f"    
        temperature={fahrenheit}
        onTemperatureChange={handleFahrenheitChange}
      />
      <p>Water will {temperature >= 100 && scale === 'c' ? 'boil' : 'not boil'}</p>
    </div>
  );
}