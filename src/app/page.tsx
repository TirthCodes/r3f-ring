"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Center,
  OrbitControls,
  AccumulativeShadows,
  RandomizedLight,
  MeshRefractionMaterial,
  useEnvironment,
  Environment,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  N8AO,
} from "@react-three/postprocessing";
import { useControls } from "leva";
import { useState } from "react";
import { ComponentProps } from "react";

// Define types for nodes and materials
type GLTFResult = {
  nodes: {
    mesh_0: THREE.Mesh;
    mesh_4: THREE.InstancedMesh;
    mesh_9: THREE.Mesh;
  };
  materials: {
    WhiteMetal: THREE.Material;
    [key: string]: THREE.Material;
  };
};

type RingProps = {
  frame: string;
  diamonds: string;
  scale: number;
} & ComponentProps<"group">;

function Ring({ frame, diamonds, ...props }: RingProps) {
  const env = useEnvironment({
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/studio_small_09_4k.hdr",
  });
  const { nodes, materials } = useGLTF("/3-stone-transformed.glb") as unknown as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh castShadow geometry={nodes.mesh_0.geometry}>
        <meshStandardMaterial
          color={frame}
          roughness={0.15}
          metalness={1}
          envMapIntensity={1.5}
        />
      </mesh>
      <mesh
        castShadow
        geometry={nodes.mesh_9.geometry}
        material={materials.WhiteMetal}
      />
      <instancedMesh
        castShadow
        args={[nodes.mesh_4.geometry, undefined, 65]}
        instanceMatrix={nodes.mesh_4.instanceMatrix}
      >
        <MeshRefractionMaterial
          color={diamonds}
          envMap={env}
          side={THREE.DoubleSide}
          aberrationStrength={0.02}
          toneMapped={false}
          transparent
          opacity={0.6}
        />
        {/* <MeshRefractionMaterial
          color={"transparent"}
          side={THREE.DoubleSide}
          envMap={env}
          aberrationStrength={0.02}
          toneMapped={false}
        /> */}
      </instancedMesh>
    </group>
  );
}

const shanksColor = [
  "#f3c865",
  "#f1bc9e",
  "#ffffff"
] 

export default function Home() {

  const [ringControls, setRingControls] = useState({
    shank: "#f3c865",
    diamonds: "#ffffff",
    scale: 0.1,
  });

  return (
    <div className="flex items-center justify-between h-screen w-full">
      <div className="bg-neutral-100 w-[20%] m-2 h-full p-4 flex flex-col">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium mb-1">Shank</h1>
          <div className="flex items-center gap-3">
            {shanksColor?.map((color, index) => (
              <div
                key={index}
                onClick={() => setRingControls({ ...ringControls, shank: color })}
                className={`w-10 h-10 rounded-full border border-neutral-300 cursor-pointer ${ringControls.shank === color ? "border-0 ring-1 ring-black" : ""}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-col items-center justify-center h-screen w-[80%]">  
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: false }}
          camera={{ position: [-5, 5, 14], fov: 20 }}
        >
          <Environment
            background
            blur={2}
            files={"https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/studio_small_09_4k.hdr"}
          />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <group position={[0, -0.25, 0]}>
            <Center 
              top 
              position={[0, -0.12, 0]}
              rotation={[-0.1, 0, 0.085]}
            >
              <Ring frame={ringControls.shank} diamonds={ringControls.diamonds} scale={0.1} />
            </Center>
            <AccumulativeShadows
              temporal
              frames={100}
              color={ringControls.diamonds}
              opacity={1.05}
            >
              <RandomizedLight radius={5} position={[10, 5, -5]} />
            </AccumulativeShadows>
          </group>
          <OrbitControls
            enablePan={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.25}
          />
          <EffectComposer>
            <N8AO aoRadius={0.15} intensity={4} distanceFalloff={2} />
            <Bloom
              luminanceThreshold={3.5}
              intensity={0.25}
              levels={9}
              mipmapBlur
            />
            {/* <ToneMapping /> */}
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
}
