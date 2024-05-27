import React from 'react';
import './App.css';
import CityAutocomplete from './components/CityAutocomplete';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>City Autocomplete Form</h1>
        <CityAutocomplete />
      </header>
    </div>
  );
}

export default App;
