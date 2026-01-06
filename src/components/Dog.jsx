import {
  OrbitControls,
  useGLTF,
  useTexture,
  useAnimations,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const Dog = () => {
  const model = useGLTF("/models/dog.drc.glb");
  console.log(model.animations);
  

  useThree(({ camera, scene, gl }) => {
    camera.position.z = 0.55;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });


  const [normalMap, sampleMatCap] = useTexture([
    "/dog_normals.jpg",
    "/matcap/mat-2.png",
  ]).map((texture) => {
      texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
  });

  const DogMaterial = new THREE.MeshMatcapMaterial({
        normalMap:normalMap,
        matcap:sampleMatCap,
      });

  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = DogMaterial
    }
  });

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.2, -0.5, 0]}
        rotation={[0, Math.PI / 4, 0]}
      />
      <directionalLight positon={[0, 5, 0]} color={0xffffff} intensity={10} />
      <OrbitControls />
    </>
  );
};

export default Dog;
