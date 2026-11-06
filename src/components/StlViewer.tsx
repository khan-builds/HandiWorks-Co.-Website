import { Suspense, useState, Component, type ReactNode } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Bounds, Center, Html } from '@react-three/drei';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

type Props = {
  src: string;
  title: string;
  color?: string;
  height?: number;
  autoRotate?: boolean;
};

function Part({ src, color }: { src: string; color: string }) {
  const geometry = useLoader(STLLoader, src);
  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color={color} roughness={0.5} metalness={0} />
    </mesh>
  );
}

class LoadError extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function StlViewer({ src, title, color, height = 360, autoRotate = false }: Props) {
  const [key, setKey] = useState(0);
  const partColor = color ?? '#ffffff';
  const fallback = (
    <p>
      Could not load the 3D preview.{' '}
      <a className="button" href={src} download>
        Download STL
      </a>
    </p>
  );

  return (
    <figure className="stl-viewer">
      <div style={{ height }} role="img" aria-label={`3D model: ${title}. Drag to rotate, scroll to zoom.`}>
        <LoadError fallback={fallback}>
          <Canvas key={key} camera={{ fov: 40, position: [0, 0, 100] }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.85} />
            <directionalLight position={[40, 70, 50]} intensity={1.15} />
            <directionalLight position={[-60, -10, -30]} intensity={0.4} />
            <Suspense fallback={<Html center>Loading 3D part…</Html>}>
              <Bounds fit clip observe margin={1.2}>
                <Center>
                  <Part src={src} color={partColor} />
                </Center>
              </Bounds>
            </Suspense>
            <OrbitControls makeDefault autoRotate={autoRotate} enablePan={false} />
          </Canvas>
        </LoadError>
      </div>
      <figcaption>
        <span className="stl-caption">{title}</span>
        <span className="stl-actions">
          <button type="button" className="button" onClick={() => setKey((value) => value + 1)}>
            Reset view
          </button>
          <a className="button" href={src} download>
            Download STL
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
