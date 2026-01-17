import { useGLTF, useTexture, useAnimations } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
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
  const dogRef = useRef();
  const { viewport, size } = useThree();

  const isMobile = size.width < 768;
  const modelScale = isMobile ? 0.8 : 1;
  const modelPosition = isMobile ? [0.1, -0.5, 0.1] : [0.2, -0.55, 0.2];

  const modelRotation = isMobile ? [0, Math.PI / 6, 0] : [0, Math.PI / 6, 0];


  // const groupRef = useRef();

  useThree(({ camera, size, scene, gl }) => {
    camera.position.z = size.width < 768 ? 0.7 : 0.42;
    gl.toneMapping = THREE.ReinhardToneMapping;
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
    texture.flipY = true;
    // texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const DogMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: mat2,
  });

  const BranchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    matcap: branchMap,
  });

  const EyeMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: mat1,
  });

  const material = useRef({
    uMatcap1: { value: mat19 },
    uMatcap2: { value: mat2 },
    uProgress: { value: 2.0 },
  });

  const material2 = useRef({
    uMatcap1: { value: mat19 },
    uMatcap2: { value: mat1 },
    uProgress: { value: 2.0 },
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
  function onBeforeCompileEye(shader) {
    shader.uniforms.uMatcapTexture1 = material2.current.uMatcap1;
    shader.uniforms.uMatcapTexture2 = material2.current.uMatcap2;
    shader.uniforms.uProgress = material2.current.uProgress;

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
  EyeMaterial.onBeforeCompile = onBeforeCompileEye;

  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = DogMaterial;
      if (child.name.includes("RIGDOGSTUDIO")) {
        child.material = EyeMaterial;
      }
    } else {
      child.material = BranchMaterial;
    }
  });

  const dogModel = useRef(model);

  useEffect(()=>{
      gsap.to(dogModel.current.scene.position,{
    z:0,
    delay:0.2,
    duration:1.4,
    ease:"power3.out"
  })
  },[])


 useGSAP(() => {
  if (!dogModel.current?.scene) return;

  const scene = dogModel.current.scene;

  const yMove = isMobile
  ? viewport.height * 0.04
  : viewport.height * 0.02;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#section1",
      start: "top top",
      endTrigger: "#section4",
      end: "bottom bottom",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  const zMove = isMobile ? 0.2 : 0.4;

  tl.to(scene.position, {
    z: -zMove,
    ease: "none",
  });

  tl.to(scene.rotation, {
    x: `+=${Math.PI / 16}`
,    ease: "none",
  });

  tl.fromTo(
    "#canvas",
    { "--imgOpacity": 1 },
    { "--imgOpacity": 0, ease: "none" },
    "three"
  );

  tl.to(
    dogModel.current.scene.rotation,
    {
      x: `-=${Math.PI/100}`,
      y: `-=${Math.PI/1.2}`,
      ease: "none",
    },
    "three"
  );

  tl.to(
    dogModel.current.scene.position,
    {
      z: isMobile?"+=0.10":"+=0.15",
      y: isMobile?"+=0.3":"+=0.13",
      x: isMobile?"-=0.3":"-=0.6",

      ease: "none",
    },
    "three"
  );
}, [size.width]);

useEffect(() => {
  ScrollTrigger.refresh();
}, [size.width]);


  useEffect(() => {
    document
      .querySelector(`.center-headings[img-title="tomorrowland"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat19;
        material2.current.uMatcap1.value = mat19;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 0.0,
          onComplete: () => {
            (material.current.uMatcap2.value =
              material.current.uMatcap1.value) &&
              (material2.current.uMatcap2.value =
                material2.current.uMatcap1.value),
              (material.current.uProgress = 2.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="navy-pier"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat8;
        material2.current.uMatcap1.value = mat8;

        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 0.0,
          onComplete: () => {
            (material.current.uMatcap2.value =
              material.current.uMatcap1.value) &&
              (material2.current.uMatcap2.value =
                material2.current.uMatcap1.value),
              (material.current.uProgress = 2.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="chicago"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat9;
        material2.current.uMatcap1.value = mat9;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 0.0,
          onComplete: () => {
            (material.current.uMatcap2.value =
              material.current.uMatcap1.value) &&
              (material2.current.uMatcap2.value =
                material2.current.uMatcap1.value),
              (material.current.uProgress = 2.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="phone"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat12;
        material2.current.uMatcap1.value = mat12;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 0.0,
          onComplete: () => {
            (material.current.uMatcap2.value =
              material.current.uMatcap1.value) &&
              (material2.current.uMatcap2.value =
                material2.current.uMatcap1.value),
              (material.current.uProgress = 2.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="kikk"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat10;
        material2.current.uMatcap1.value = mat10;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 0.0,
          onComplete: () => {
            (material.current.uMatcap2.value =
              material.current.uMatcap1.value) &&
              (material2.current.uMatcap2.value =
                material2.current.uMatcap1.value),
              (material.current.uProgress = 2.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="kennedy"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat17;
        material2.current.uMatcap1.value = mat17;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 0.0,
          onComplete: () => {
            (material.current.uMatcap2.value =
              material.current.uMatcap1.value) &&
              (material2.current.uMatcap2.value =
                material2.current.uMatcap1.value),
              (material.current.uProgress = 2.0);
          },
        });
      });

    document
      .querySelector(`.center-headings[img-title="opera"]`)
      .addEventListener("mouseenter", () => {
        material.current.uMatcap1.value = mat13;
        material2.current.uMatcap1.value = mat13;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 0.0,
          onComplete: () => {
            (material.current.uMatcap2.value =
              material.current.uMatcap1.value) &&
              (material2.current.uMatcap2.value =
                material2.current.uMatcap1.value),
              (material.current.uProgress = 2.0);
          },
        });
      });
    document
      .querySelector(`#section2-center`)
      .addEventListener("mouseleave", () => {
        material.current.uMatcap1.value = mat2;
        material2.current.uMatcap1.value = mat1;
        gsap.to(material.current.uProgress, {
          value: 0.0,
          duration: 0.0,
          onComplete: () => {
            (material.current.uMatcap2.value =
              material.current.uMatcap1.value) &&
              (material2.current.uMatcap2.value =
                material2.current.uMatcap1.value),
              (material.current.uProgress = 2.0);
          },
        });
      });
  }, []);

  // const mouse = useRef({ x: 0, y: 0 });

  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
  //     mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  //   };
  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);

  // useFrame(() => {
  //   if (!dogRef.current) return;

  //   const mouseX = mouse.current.x;
  //   const mouseY = mouse.current.y;

  //   /** 🔥 Reduce rotation when mouse goes UP */
  //   const upFactor = mouseY > 0 ? 0.2 : 1; // 0 = no rotation, 0.2 = very less

  //   const targetY =
  //     baseRotation.current.y + mouseX * 0.10 * upFactor;

  //   const targetX =
  //     baseRotation.current.x + mouseY * 0.10 * upFactor;

  //   dogRef.current.rotation.y = THREE.MathUtils.lerp(
  //     dogRef.current.rotation.y,
  //     targetY,
  //     0.02
  //   );

  //   dogRef.current.rotation.x = THREE.MathUtils.lerp(
  //     dogRef.current.rotation.x,
  //     targetX,
  //     0.02
  //   );
  // });

  return (
    <>
      <primitive
        // ref={dogRef}
        object={model.scene}
        scale={modelScale}
        position={modelPosition}
        rotation={modelRotation}
      />
      <directionalLight positon={[0, 5, 5]} color={0xffffff} intensity={10} />

      {/* <OrbitControls/> */}
    </>
  );
};
//nice to meet you Dog Studio
export default Dog;
