import {
  useGLTF,
  useTexture,
  useAnimations,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

const Dog = () => {
  gsap.registerPlugin(useGSAP());
  gsap.registerPlugin(ScrollTrigger);

  const model = useGLTF("/models/dog.drc.glb");
  console.log(model);
  

  useThree(({ camera, scene, gl }) => {
    camera.position.z = 0.45;
    // gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  const { actions } = useAnimations(model.animations, model.scene);
  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  const [
    mat1,
    mat2,
    mat3,
    mat4,
    mat5,
    mat6,
    mat7,
    mat8,
    mat9,
    mat10,
    mat11,
    mat12,
    mat13,
    mat14,
    mat15,
    mat16,
    mat17,
    mat18,
    mat19,
    mat20,
  ] = useTexture([
    "/matcap/mat-1.png",
    "/matcap/mat-2.png",
    "/matcap/mat-3.png",
    "/matcap/mat-4.png",
    "/matcap/mat-5.png",
    "/matcap/mat-6.png",
    "/matcap/mat-7.png",
    "/matcap/mat-8.png",
    "/matcap/mat-9.png",
    "/matcap/mat-10.png",
    "/matcap/mat-11.png",
    "/matcap/mat-12.png",
    "/matcap/mat-13.png",
    "/matcap/mat-14.png",
    "/matcap/mat-15.png",
    "/matcap/mat-16.png",
    "/matcap/mat-17.png",
    "/matcap/mat-18.png",
    "/matcap/mat-19.png",
    "/matcap/mat-20.png",
  ]).map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const [normalMap] = useTexture(["/dog_normals.jpg"]).map((texture) => {
    texture.flipY = false;
    // texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const [branchNormalMap, branchMap] = useTexture([
    "/branches_normals.jpeg",
    "/branches_diffuse.jpeg",
  ]).map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const material = useRef({
    uMatcap1: { value: mat19 },
    uMatcap2: { value: mat2 },
    uProgress: { value: 2.0 },
  });

  const DogMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: mat2,
  });

  const BranchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    matcap: branchMap,
  });

  function onBeforeCompile(shader) {
    shader.uniforms.uMatcapTexture1 = material.current.uMatcap1;
    shader.uniforms.uMatcapTexture2 = material.current.uMatcap2;
    shader.uniforms.uProgress = material.current.uProgress;

    // Store reference to shader uniforms for GSAP animation

    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "vec4 matcapColor = texture2D( matcap, uv );",
      `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.9;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
    );
  }

  DogMaterial.onBeforeCompile = onBeforeCompile;
  BranchMaterial.onBeforeCompile = onBeforeCompile;

  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = DogMaterial;
    } else {
      child.material = BranchMaterial;
    }
  });

  const dogModel = useRef(model);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "nav",
        endTrigger: "#section5",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
    tl.to(dogModel.current.scene.position, {
      z: "-=0.40",
    });
    tl.to(dogModel.current.scene.rotation, {
      x: `+=${Math.PI / 16}`,
    });
    tl.to(
      dogModel.current.scene.rotation,
      {
        x: `-=${Math.PI / 60}`,
        y: `-=${Math.PI}`,
      },
      "three"
    );
    tl.to(
      dogModel.current.scene.position,
      {
        z: "+=0.20",
        x: "-=0.6",
        y: "+=0.13",
      },
      "three"
    );
  }, []);

  useEffect(() => {
    document
      .querySelector(`.center-headings[img-title="tomorrowland"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat19;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 0.5,
          onComplete: () => {
            (material.current.uMatcap2.value = material.current.uMatcap1.value),
              (material.current.uProgress = 1.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="navy-pier"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat8;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 1.0,
          onComplete: () => {
            (material.current.uMatcap2.value = material.current.uMatcap1.value),
              (material.current.uProgress = 1.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="chicago"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat9;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 1.0,
          onComplete: () => {
            (material.current.uMatcap2.value = material.current.uMatcap1.value),
              (material.current.uProgress = 1.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="phone"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat12;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 1.0,
          onComplete: () => {
            (material.current.uMatcap2.value = material.current.uMatcap1.value),
              (material.current.uProgress = 1.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="kikk"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat10;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 1.0,
          onComplete: () => {
            (material.current.uMatcap2.value = material.current.uMatcap1.value),
              (material.current.uProgress = 1.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="kennedy"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat17;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 1.0,
          onComplete: () => {
            (material.current.uMatcap2.value = material.current.uMatcap1.value),
              (material.current.uProgress = 1.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="opera"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat13;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 1.0,
          onComplete: () => {
            (material.current.uMatcap2.value = material.current.uMatcap1.value),
              (material.current.uProgress = 1.0);
          },
        });
      });
      document
      .querySelector(`#section2-center`)
      .addEventListener("mouseleave", () => {
        material.current.uMatcap1.value = mat2;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 1.0,
          onComplete: () => {
            (material.current.uMatcap2.value = material.current.uMatcap1.value),
              (material.current.uProgress = 2.0);
          },
        });
      }); 
  },[]);

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.2, -0.55, 0]}
        rotation={[0, Math.PI / 5, 0]}
      />
      <directionalLight positon={[0,5,5]} color={0xFFFFFF} intensity={10} />
      
      {/* <ambientLight positon={[0,5,5]} color={0xFFFFFF} intensity={10} /> */}

      {/* <OrbitControls/> */}
    </>
  );
};
//nice to meet you Dog Studio
export default Dog;
