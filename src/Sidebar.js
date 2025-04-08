// Sidebar.js
import React from "react";

export default function Sidebar({ onSelectBuilding }) {
  return (
    <div style={{
      position: 'absolute',
      right: 20,
      top: 20,
      background: 'rgba(0,0,0,0.7)',
      padding: '12px',
      borderRadius: '8px',
      color: '#fff',
      zIndex: 10
    }}>
      <h3>🛠 Build</h3>
      <button onClick={() => onSelectBuilding('base')} style={{
        marginTop: '8px',
        padding: '8px',
        background: '#222',
        border: '1px solid #555',
        borderRadius: '6px',
        color: '#00ffff',
        cursor: 'pointer'
      }}>
        🏠 Base 
      </button>
      <button onClick={() => onSelectBuilding('house')} style={{
        marginTop: '8px',
        padding: '8px',
        background: '#222',
        border: '1px solid #555',
        borderRadius: '6px',
        color: '#00ffff',
        cursor: 'pointer'
      }}>
        🏠 House
      </button>
    </div>
  );
}
