import React from "react";

export default function Base({ position = [0, 0.2, 0], transparent = false, opacity = 1 }) {
  return (
    <group position={position}>
      <mesh position={[1, 1, 1]}> {/* Center of a 2x2 box */}
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#00aaff" transparent={transparent} opacity={opacity} />
      </mesh>
    </group>
  );
}