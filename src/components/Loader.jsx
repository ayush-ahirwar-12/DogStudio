import { useProgress } from "@react-three/drei";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Loader = ({ onComplete }) => {
  const { progress } = useProgress();
  const loaderRef = useRef();
  const barRef = useRef();

  useEffect(() => {
    gsap.to(barRef.current, {
      width: `${progress}%`,
      duration: 0.3,
      ease: "power2.out",
    });


    if (progress === 100) {
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
        onComplete: onComplete,
      });
    }
  }, [progress]);
  return (
    <div ref={loaderRef} className="loader">
      <div className="loader-inner">
        <h1>DogStudio</h1>
        <div className="progress-track">
          <div ref={barRef} className="progress-bar" />
        </div>
        <p>{Math.floor(progress)}%</p>
      </div>
    </div>
  );
};

export default Loader;
