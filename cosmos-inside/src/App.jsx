
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import "./index.css";

const planets = [
  {
    name: "Mercury",
    color: "#aaa9b0",
    size: 0.42,
    distance: 3.5,
    speed: 0.75,
    type: "Terrestrial planet",
    year: "88 Earth days",
    description: "The smallest planet in our Solar System, orbiting closest to the Sun.",
  },
  {
    name: "Venus",
    color: "#e8b77d",
    size: 0.65,
    distance: 5,
    speed: 0.52,
    type: "Terrestrial planet",
    year: "225 Earth days",
    description: "A rocky world with a thick atmosphere and extreme surface temperatures.",
  },
  {
    name: "Earth",
    color: "#388bff",
    size: 0.72,
    distance: 6.8,
    speed: 0.38,
    type: "Terrestrial planet",
    year: "365.25 days",
    description: "Our home planet, with liquid water and life as we know it.",
  },
  {
    name: "Mars",
    color: "#e77856",
    size: 0.55,
    distance: 8.7,
    speed: 0.29,
    type: "Terrestrial planet",
    year: "687 Earth days",
    description: "The Red Planet, known for ancient valleys and enormous volcanoes.",
  },
  {
    name: "Jupiter",
    color: "#d7b18a",
    size: 1.25,
    distance: 11.2,
    speed: 0.19,
    type: "Gas giant",
    year: "11.86 Earth years",
    description: "The largest planet in our Solar System, famous for its giant storms.",
  },
  {
    name: "Saturn",
    color: "#e9d39a",
    size: 1.05,
    distance: 14.2,
    speed: 0.14,
    type: "Gas giant",
    year: "29.4 Earth years",
    description: "A gas giant surrounded by beautiful rings made mostly of ice and rocky particles.",
  },
];

function Sun() {
  const sunRef = useRef();

  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.15, 48, 48]} />
        <meshBasicMaterial color="#ffbf61" />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial
          color="#ff8d3d"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight color="#ffd18a" intensity={180} distance={45} decay={2} />
    </group>
  );
}

function OrbitPath({ distance }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[distance, 0.009, 8, 180]} />
      <meshBasicMaterial color="#a99bdf" transparent opacity={0.24} />
    </mesh>
  );
}

function Planet({ planet, onSelect, index }) {
  const orbitRef = useRef();
  const planetRef = useRef();

  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * planet.speed * 0.18;
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <OrbitPath distance={planet.distance} />

      <group ref={orbitRef}>
        <group position={[planet.distance, 0, 0]}>
          <mesh
            ref={planetRef}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(planet);
            }}
            onPointerOver={(event) => {
              event.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <sphereGeometry args={[planet.size, 40, 40]} />
            <meshStandardMaterial
              color={planet.color}
              roughness={0.78}
              metalness={0.05}
            />
          </mesh>

          {planet.name === "Earth" && (
            <mesh>
              <sphereGeometry args={[planet.size * 1.025, 32, 32]} />
              <meshBasicMaterial
                color="#6cbaff"
                transparent
                opacity={0.12}
                side={THREE.BackSide}
              />
            </mesh>
          )}

          {planet.name === "Saturn" && (
            <mesh rotation={[Math.PI / 2.5, 0.2, 0.15]}>
              <torusGeometry args={[planet.size * 1.55, 0.13, 8, 100]} />
              <meshStandardMaterial
                color="#cbb68b"
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
          )}
        </group>
      </group>
    </>
  );
}

function UniverseScene({ onSelect }) {
  return (
    <Canvas
      camera={{ position: [0, 19, 27], fov: 45, near: 0.1, far: 150 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => {}}
    >
      <color attach="background" args={["#080713"]} />
      <fog attach="fog" args={["#080713", 32, 85]} />

      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#a8baff", "#20132f", 1.1]} />

      <Stars
        radius={90}
        depth={55}
        count={2600}
        factor={3}
        saturation={0.4}
        fade
        speed={0.6}
      />

      <Sparkles
        count={100}
        scale={35}
        size={2}
        speed={0.25}
        opacity={0.6}
        color="#b7a0ff"
      />

      <Sun />

      {planets.map((planet, index) => (
        <Planet
          key={planet.name}
          planet={planet}
          index={index}
          onSelect={onSelect}
        />
      ))}

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={8}
        maxDistance={48}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2.05}
        rotateSpeed={0.55}
        zoomSpeed={0.8}
      />
    </Canvas>
  );
}

function App() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="universe">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-symbol">✦</span>
          COSMOS <span className="brand-light">INSIDE</span>
        </a>

        <span className="top-label">AN INTERACTIVE UNIVERSE</span>

        <span className="system-status">
          <span className="status-dot" /> SYSTEM ONLINE
        </span>
      </header>

      <section className="hero" id="home">
        <p className="eyebrow">✧ YOUR JOURNEY BEGINS HERE ✧</p>
        <h1>
          There is a universe
          <br />
          inside <span>every wonder.</span>
        </h1>
        <p className="subtitle">
          Explore distant worlds. Discover the extraordinary.
        </p>
        <span className="hero-tag">✧ INTERACTIVE 3D SOLAR SYSTEM</span>
      </section>

      <section className="scene-wrap" aria-label="Interactive 3D universe">
        <div className="scene-hint">
          <span>↔</span> DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM
        </div>

        <UniverseScene onSelect={setSelected} />

        <div className="scene-caption">
          <span className="status-dot" />
          SOLAR SYSTEM <span>·</span> SCHEMATIC SCALE
        </div>
      </section>

      <section className="discovery" aria-live="polite">
        {selected ? (
          <div className="planet-info" key={selected.name}>
            <div
              className="planet-indicator"
              style={{ "--planet-color": selected.color }}
            />

            <div className="planet-copy">
              <p className="eyebrow">CELESTIAL DATABASE / SOL-01</p>
              <h2>{selected.name}</h2>
              <p className="planet-description">{selected.description}</p>

              <div className="planet-facts">
                <div>
                  <span>CLASSIFICATION</span>
                  <strong>{selected.type}</strong>
                </div>
                <div>
                  <span>ORBITAL PERIOD</span>
                  <strong>{selected.year}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="close-btn"
              onClick={() => setSelected(null)}
            >
              CLOSE ×
            </button>
          </div>
        ) : (
          <div className="empty-discovery">
            <span className="discovery-star">✧</span>
            <p>YOUR NEXT DISCOVERY IS ONE CLICK AWAY</p>
            <span className="discovery-subtitle">
              Click a 3D planet to uncover its story.
            </span>
          </div>
        )}
      </section>

      <footer className="footer">
        <span>MADE FOR THE CURIOUS</span>
        <span>ONE STAR. INFINITE QUESTIONS.</span>
      </footer>
    </main>
  );
}

export default App;
