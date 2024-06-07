import React, { useRef } from "react";
import { fragment, vertex } from "./shader";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture, useAspect } from "@react-three/drei";
import * as THREE from "three";
import { transform } from "framer-motion";

export default function Model({ scrollProgress }: { scrollProgress: any }) {
  const image = useRef<THREE.Mesh | null>(null);
  const texture = useTexture("/images/car.jpg");
  const { width, height } = texture.image;
  const { viewport } = useThree();
  const scale = useAspect(width, height, 0.3);

  // Define los valores de amplitude y waveLength directamente
  const amplitude = 0.25;
  const waveLength = 5;

  const uniforms = useRef({
    uTime: { value: 0 },
    uAmplitude: { value: amplitude },
    uWaveLength: { value: waveLength },
    uTexture: { value: texture },
    vUvScale: { value: new THREE.Vector2(0, 0) },
  });

  useFrame(() => {
    if (
      image.current &&
      image.current.material instanceof THREE.ShaderMaterial
    ) {
      // scale image based on progress of the scroll
      const scaleX = transform(
        scrollProgress.get(),
        [0, 1],
        [scale[0], viewport.width]
      );
      const scaleY = transform(
        scrollProgress.get(),
        [0, 1],
        [scale[1], viewport.height]
      );
      image.current.scale.x = scaleX;
      image.current.scale.y = scaleY;
      // Adjust texture to new scale
      const scaleRatio = scaleX / scaleY;
      const aspectRatio = width / height;
      // scale texture inside shader
      image.current.material.uniforms.vUvScale.value.set(
        1,
        aspectRatio / scaleRatio
      );
      // animate wave based on progress of the scroll
      const modifiedAmplitude = transform(
        scrollProgress.get(),
        [0, 1],
        [amplitude, 0]
      );
      image.current.material.uniforms.uTime.value += 0.04;
      image.current.material.uniforms.uAmplitude.value = modifiedAmplitude;
      image.current.material.uniforms.uWaveLength.value = waveLength;
    }
  });

  return (
    <mesh ref={image} scale={scale}>
      <planeGeometry args={[1, 1, 15, 15]} />
      <shaderMaterial
        wireframe={false}
        fragmentShader={fragment}
        vertexShader={vertex}
        uniforms={uniforms.current}
      />
    </mesh>
  );
}
