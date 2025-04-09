import { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import * as THREE from "three";
import Base from "./Buildings/Base";
import SmallHouse from "./Buildings/SmallHouse";

export function TileSelector({ onTileClick, setSelectedTile, buildingToPlace }) {
  const { camera, raycaster, mouse } = useThree();
  const [hoveredTile, setHoveredTile] = useState(null);
  const hoverRef = useRef();
  const planeRef = useRef();

  // 🔊 Click sound
  const clickSound = useRef(null);
  useEffect(() => {
    clickSound.current = new Audio("/click.wav");
    clickSound.current.volume = 0.5;
  }, []);

  // 🌀 Spring animation for scale, opacity, and color
  const [spring, api] = useSpring(() => ({
    scale: [1, 1, 1],
    opacity: 0.3,
    color: "#00ffff",
    config: { mass: 1, tension: 100, friction: 10 },
    loop: { reverse: true },
  }));

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeRef.current);
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const tileX = Math.floor(point.x);
      const tileZ = Math.floor(point.z);

      setHoveredTile([tileX, tileZ]);

      if (hoverRef.current) {
        hoverRef.current.position.set(tileX, 0.202, tileZ);
      }
      setSelectedTile([tileX, tileZ]);
    }
  });

  useEffect(() => {
    if (hoveredTile) {
      api.start({
        scale: [1.15, 1.15, 1.15],
        opacity: 0.5,
        color: "#00ffff",
      });
    }
  }, [hoveredTile]);

  const handleClick = () => {
    if (hoveredTile && onTileClick) {
      onTileClick(hoveredTile);
      if (clickSound.current) {
        clickSound.current.currentTime = 0;
        clickSound.current.play();
      }
    }
  };

  return (
    <>
      {/* Invisible Raycast Plane */}
      <mesh
        ref={planeRef}
        position={[0, 0.201, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[10, 10]} />
      </mesh>

      {/* Animated Hover Square */}
      {/* <a.mesh
        ref={hoverRef}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={spring.scale}
      >
        <planeGeometry args={[1, 1]} />
        <a.meshBasicMaterial
          color={spring.color}
          transparent
          opacity={spring.opacity}
        />
      </a.mesh> */}

      {/* Ghost Preview Building */}
      {buildingToPlace && hoveredTile && (
        <>
          {buildingToPlace === "base" && (
            <Base
              position={[hoveredTile[0], 0.2, hoveredTile[1]]}
              transparent={true}
              opacity={0.5}
            />
          )}
          {buildingToPlace === "house" && (
            <SmallHouse
              position={[hoveredTile[0], 0.2, hoveredTile[1]]}
              transparent={true}
              opacity={0.5}
            />
          )}
        </>
      )}

      {/* Click Handler Plane */}
      <mesh
        position={[0, 0.201, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleClick}
      >
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
