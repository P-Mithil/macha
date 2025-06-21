import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { Download, RotateCcw } from 'lucide-react';

useGLTF.preload.experimental = true

function Model({ url, autoRotate = true }) {
  const { scene } = useGLTF(url, true, undefined, (loader) => {
    loader.setCrossOrigin('anonymous');
  });

  const meshRef = useRef();

  React.useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / maxDim;
      scene.scale.set(scale, scale, scale);
    }
  }, [scene]);

  useFrame(() => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive 
      ref={meshRef}
      object={scene}
      position={[0, -0.75, 0]}
    />
  );
}

const ModelViewer = ({ modelUrl, onDownload, isLoading }) => {
  const handleDownload = () => {
    if (onDownload && modelUrl) {
      onDownload(modelUrl);
    }
  };

  const handleResetView = () => {
    if (window.resetCamera) {
      window.resetCamera();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 glass-effect rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white text-lg">Generating your 3D model...</p>
          <p className="text-white/70 text-sm mt-2">This may take a few minutes</p>
        </div>
      </div>
    );
  }

  if (!modelUrl) {
    return (
      <div className="w-full h-96 glass-effect rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg">No 3D model available</p>
          <p className="text-sm opacity-70">Upload an image to generate a 3D model</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full h-96 glass-effect rounded-lg overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <PresentationControls
              global
              config={{ mass: 2, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              rotation={[0.2, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 2, Math.PI / 2]}
            >
              <Model url={modelUrl} />
            </PresentationControls>
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
            />
          </Suspense>
        </Canvas>
        
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleResetView}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            title="Download model"
          >
            <Download className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-white text-sm opacity-70">
          Use mouse to rotate, scroll to zoom, and right-click to pan
        </p>
      </div>
    </div>
  );
};

export default ModelViewer; 