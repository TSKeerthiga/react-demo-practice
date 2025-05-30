import React from 'react';
import './App.css'; // Only if you need custom styles, not Tailwind directives
import './index.css';  // This should include Tailwind directives

function App() {
  return (
    <div className="App">
      <h1>Hello, World!</h1>
      <h1 className="text-3xl font-bold text-red-500">Hello Tailwind!</h1>
      <div className='text-red-500'>Sample text</div>
    </div>
  );
}

export default App;
