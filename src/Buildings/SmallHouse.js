import React from "react";

export default function SmallHouse({ position = [0, 0.2, 0], transparent = false, opacity = 1 }) {
  return (
    <group position={position}>
      <mesh position={[0.5, 0.5, 0.5]}> {/* Center of 1x1 tile */}
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffaa00" transparent={transparent} opacity={opacity} />
      </mesh>
    </group>
  );
}