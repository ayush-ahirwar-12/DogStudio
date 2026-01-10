import {
  OrbitControls,
  useGLTF,
  useTexture,
  useAnimations,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import {useGSAP} from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";


const Dog = () => {
  gsap.registerPlugin(useGSAP());
  gsap.registerPlugin(ScrollTrigger);


  const model = useGLTF("/models/dog.drc.glb");


  

  useThree(({ camera,scene, gl }) => {
    camera.position.z = 0.45;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  const { actions } = useAnimations(model.animations, model.scene);
  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  const [normalMap, sampleMatCap] = useTexture([
    "/dog_normals.jpg",
    "/matcap/mat-2.png",
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const [branchNormalMap, branchMap] = useTexture([
    "/branches_normals.jpeg",
    "/branches_diffuse.jpeg",
  ]).map((texture)=>{
    texture.colorSpace=THREE.SRGBColorSpace;
    return texture;
  })

  const DogMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: sampleMatCap,
  });

  const BranchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    matcap: branchMap,
  });

  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = DogMaterial;
    } else {
      child.material = BranchMaterial;
    }
    console.log(child.name);
  });

  const dogModel = useRef(model);

  useGSAP(()=>{
    const tl = gsap.timeline({
      scrollTrigger:{
        trigger:"#section1",
        endTrigger:"#section3",
        start:"top top",
        end:"bottom bottom",
        scrub:true,
        markers:true
      }

    })
    tl.to(dogModel.current.scene.position,{
      z:"-=0.60"
    })
    tl.to(dogModel.current.scene.rotation,{
      x:`+=${Math.PI/16}`
    })
    tl.to(dogModel.current.scene.rotation,{
      
      y:`-=${Math.PI}`
    })
    tl.to(dogModel.current.scene.position,{
      z:"+=0.40",
      x:"-=0.5"
    })
  },[])

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.2, -0.55, 0]}
        rotation={[0, Math.PI / 5, 0]}
      />
      <directionalLight positon={[0, 5, 0]} color={0xffffff} intensity={10} />
      {/* <OrbitControls/> */}
    </>
  );
};
//nice to meet you Dog Studio
export default Dog;
