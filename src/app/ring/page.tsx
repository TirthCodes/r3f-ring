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
  ToneMapping,
} from "@react-three/postprocessing";
import { useControls } from "leva";
import { ComponentProps } from "react";

// Type for Ring props
type RingProps = {
  frame: string;
  diamonds: string;
} & ComponentProps<"group">;

function Ring({ frame, diamonds, ...props }: RingProps) {
  // const env = useEnvironment({
  //   files:
  //     "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/peppermint_powerplant_2_4k.hdr",
  // });
  // Type for useGLTF return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGLTF('/ring2.glb') as any;
  return (
    <group {...props} dispose={null}>
      <group position={[0, -1.021, 0]}>
        <group scale={0.346}>
          <group position={[0, 2.982, 0]} rotation={[0, -0.012, 0]} scale={0.317}>
            <group position={[0.001, -2.609, -0.864]} rotation={[-0.3, 0, 0]}>
              <group position={[0, 0, 0.003]}>
                {/* ... all mesh elements unchanged ... */}
                {/* The rest of the mesh code is unchanged for brevity */}
                {/* ... */}
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.GeoSphere153.geometry}
                  material={materials.metal}
                  position={[-1.674, 0.686, 7.497]}
                  rotation={[0, -0.003, Math.PI]}
                  scale={0.921}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.Brillant_024.geometry}
                  material={nodes.Brillant_024.material}
                  position={[7.659, 0.496, 3.639]}
                  rotation={[-1.288, 0.647, -2.208]}
                  scale={0.001}
                />
                {/* ... */}
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.gemcenter.geometry}
                  material={nodes.gemcenter.material}
                  position={[0, 0, 9.158]}
                  rotation={[Math.PI / 2, 0, 0]}
                  scale={0.002}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={nodes.soli_metal.geometry}
                  material={materials.metal}
                  position={[0, 0, -1.599]}
                />
              </group>
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.object_1_Retopo.geometry}
              material={materials.metal}
              position={[0, -12.901, 0.003]}
              rotation={[-0.069, 0, 0]}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

export default function Home() {
  // Leva's useControls returns a Record<string, any>
  const { shadow, frame, diamonds } = useControls({
    shadow: "#000000",
    frame: {
      options: {
        Gold: "#C6A645",
        Rose: "#f67d7d",
        White: "#ffffff",
      },
    },
    diamonds: "#ffffff",
  }) as {
    shadow: string;
    frame: string;
    diamonds: string;
  };

  // #C6A645 gold
  // #f67d7d rose gold

  // const env = useEnvironment({
  //   files:
  //     "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/peppermint_powerplant_2_4k.hdr",
  // });

  return (
    <div className="flex-col items-center justify-center h-screen">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{ position: [-5, 5, 14], fov: 20 }}
      >
        <Environment
          background
          blur={1}
          files={
            "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/peppermint_powerplant_2_4k.hdr"
          }
        />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <group >
          <Center 
            top 
            // position={[0, -0.12, 0]}
            rotation={[-0.1, 0, 0.085]}
          >
            <Ring frame={frame} diamonds={diamonds} scale={0.1} />
          </Center>
          <AccumulativeShadows
            temporal
            frames={100}
            color={shadow}
            opacity={1.05}
          >
            <RandomizedLight radius={5} position={[10, 5, -5]} />
          </AccumulativeShadows>
        </group>
        <OrbitControls
          enablePan={false}
          minPolarAngle={0}
          // autoRotate
          maxPolarAngle={Math.PI / 2.25}
        />
        <EffectComposer>
          <N8AO aoRadius={0.15} intensity={4} distanceFalloff={2} />
          <Bloom
            luminanceThreshold={3.5}
            intensity={0.85}
            levels={9}
            mipmapBlur
          />
          <ToneMapping />
        </EffectComposer>
        {/* <Environment map={env} background blur={1} /> */}
      </Canvas>
    </div>
  );
}
