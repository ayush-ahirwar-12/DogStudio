import React from "react";
import { Canvas } from "@react-three/fiber";
import Dog from "./components/Dog";

const App = () => {
  return (
    <main>
      <Canvas>
        <Dog />
      </Canvas>
      <section></section>
      <section></section>
      <section></section>
    </main>
  );
};

export default App;
