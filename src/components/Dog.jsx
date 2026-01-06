import {
  OrbitControls,
  useGLTF,
  useTexture,
  useAnimations,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const Dog = () => {
  const model = useGLTF("/models/dog.drc.glb");
  

  useThree(({ camera, scene, gl }) => {
    camera.position.z = 0.55;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  const {actions}=useAnimations(model.animations,model.scene)
  useEffect(()=>{
    actions["Take 001"].play();
  },[actions])


  const [normalMap, sampleMatCap,branchNormalMap,branchMap] = useTexture([
    "/dog_normals.jpg",
    "/matcap/mat-2.png",
    "/branches_normals.jpeg",
    "/branches_diffuse.jpeg"
  ]).map((texture) => {
      texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
  });

  const DogMaterial = new THREE.MeshMatcapMaterial({
        normalMap:normalMap,
        matcap:sampleMatCap,
      });

  const BranchMaterial = new THREE.MeshMatcapMaterial({
    normalMap:branchNormalMap,
    matcap:branchMap
  })


  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = DogMaterial
    }
    else{
      child.material = BranchMaterial
    }
    console.log(child.name);
    
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
