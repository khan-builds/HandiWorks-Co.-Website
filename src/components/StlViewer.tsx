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
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
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
  const partColor =
    color ??
    (typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue('--hh-part').trim() || '#4F7CAC'
      : '#4F7CAC');
  const fallback = (
    <p>
      Could not load the 3D preview. <a href={src} download>Download {title} (STL)</a>
    </p>
  );

  return (
    <figure className="stl-viewer">
      <div style={{ height }} role="img" aria-label={`3D model: ${title}. Drag to rotate, scroll to zoom.`}>
        <LoadError fallback={fallback}>
          <Canvas key={key} camera={{ fov: 40, position: [0, 0, 100] }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[50, 80, 60]} intensity={1.2} />
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
        {title} ·{' '}
        <button type="button" onClick={() => setKey((value) => value + 1)}>
          Reset view
        </button>{' '}
        · <a href={src} download>Download STL</a>
      </figcaption>
    </figure>
  );
}
