import React from 'react';
import { Board } from './components/Board.jsx';

/**
 * App Component
 * Root component of the application.
 * Sets up global styles and renders the main Board component.
 */

function App() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      backgroundColor: '#fff',
      color: '#333',
      minHeight: '100vh'
    }}>
      <Board />
    </div>
  );
}

export default App;
