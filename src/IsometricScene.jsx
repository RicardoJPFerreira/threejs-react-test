import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TileSelector } from "./TileSelector";
import { useState, useRef, useEffect} from "react";
import Sidebar from './Sidebar';
import Base from "./Buildings/Base";
import SmallHouse from "./Buildings/SmallHouse";



function Terrain() {
  return (
    <mesh receiveShadow position={[0, 0.1, 0]}>
      <boxGeometry args={[10, 0.2, 10]} />
      <meshStandardMaterial color="#4CAF50" />
    </mesh>
  );
}

function House({ position = [0, 0.2, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.8, 1, 4]} />
        <meshStandardMaterial color="#a93226" />
      </mesh>
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
    </>
  );
}

function Grid({ size = 10, divisions = 10 }) {
  const lines = [];

  for (let i = -size / 2; i <= size / 2; i++) {
    // vertical lines (z direction)
    lines.push(
      [-size / 2, 0.201, i],
      [size / 2, 0.201, i]
    );

    // horizontal lines (x direction)
    lines.push(
      [i, 0.201, -size / 2],
      [i, 0.201, size / 2]
    );
  }

  const positions = new Float32Array(lines.flat());

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff22" />
    </lineSegments>
  );
}


export default function IsometricScene() {
  const [selectedTile, setSelectedTile] = useState(null);
  const [buildingToPlace, setBuildingToPlace] = useState(null);
  const [placedBuildings, setPlacedBuildings] = useState([]);
  const clickSound = useRef(null);

  useEffect(() => {
    clickSound.current = new Audio("/click.wav");
    clickSound.current.volume = 0.5;
  }, []);
  
  return (
    <>
      <Sidebar onSelectBuilding={(building) => setBuildingToPlace(building)} />
      <Canvas
        shadows
        orthographic
        camera={{
          position: [10, 10, 10], // key for isometric top-down view
          zoom: 40,
          near: 0.1,
          far: 1000,
        }}
      >
        <color attach="background" args={["#1a1a1a"]} />
        <Suspense fallback={null}>
          <Lighting />
          <Terrain />
          <Grid />
          {placedBuildings.map((building, index) => {
            const pos = [building.position[0], 0.2, building.position[1]];

            switch (building.type) {
              case "base":
                return <Base key={index} position={pos} label="Base" />;
              case "house":
                return <SmallHouse key={index} position={pos} label="House" />;
              default:
                return null;
            }
          })}
          <TileSelector
            onTileClick={(tilePos) => {
              if (buildingToPlace) {
                setPlacedBuildings((prev) => [
                  ...prev,
                  { type: buildingToPlace, position: tilePos },
                ]);
                setBuildingToPlace(null);

                if (clickSound.current) {
                  clickSound.current.currentTime = 0;
                  clickSound.current.play();
                }
              }
            }}
            setSelectedTile={setSelectedTile}
            buildingToPlace={buildingToPlace}
          />


        </Suspense>
        <OrbitControls
          target={[0, 0, 0]}
          enableRotate={false}
          enablePan={false}
          enableZoom={true}
        />
      </Canvas>
    </>
  );
}