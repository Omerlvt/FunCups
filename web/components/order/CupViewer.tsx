'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { drawLabel, type LabelFields } from './LabelCanvas'

interface CupViewerProps extends LabelFields {
  className?: string
}

export default function CupViewer({ name, warning, className }: CupViewerProps) {
  return (
    <div className={className} style={{ background: '#F5F0E8' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, 3, -5]} intensity={0.6} />
        <Suspense fallback={<CupSkeleton />}>
          <CupScene name={name} warning={warning} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  )
}

function CupScene({ name, warning }: LabelFields) {
  const { scene } = useGLTF('/ceramic fun cup keyshot.glb')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const labelMatRef = useRef<THREE.MeshStandardMaterial | null>(null)

  // On mount: find the label mesh, create the canvas texture, wire it up
  useEffect(() => {
    if (!canvasRef.current) {
      const c = document.createElement('canvas')
      c.width = 1024
      c.height = 512
      canvasRef.current = c
    }
    if (!textureRef.current) {
      textureRef.current = new THREE.CanvasTexture(canvasRef.current)
      textureRef.current.flipY = false
    }

    if (!labelMatRef.current) {
      // Log all meshes so developer can identify label mesh name if heuristic misses
      if (process.env.NODE_ENV === 'development') {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = Array.isArray(child.material) ? child.material[0] : child.material
            console.log('[CupViewer] mesh:', child.name, '| material:', (mat as THREE.MeshStandardMaterial)?.name)
          }
        })
      }

      let found: THREE.MeshStandardMaterial | null = null

      // Primary: find by name containing "label" or "sticker"
      scene.traverse((child) => {
        if (found) return
        if (child instanceof THREE.Mesh) {
          const mat = Array.isArray(child.material) ? child.material[0] : child.material
          if (!(mat instanceof THREE.MeshStandardMaterial)) return
          const n = child.name.toLowerCase()
          const m = (mat.name ?? '').toLowerCase()
          if (n.includes('label') || n.includes('sticker') || m.includes('label') || m.includes('sticker')) {
            found = mat
          }
        }
      })

      // Fallback: first mesh with a texture map
      if (!found) {
        scene.traverse((child) => {
          if (found) return
          if (child instanceof THREE.Mesh) {
            const mat = Array.isArray(child.material) ? child.material[0] : child.material
            if (!(mat instanceof THREE.MeshStandardMaterial)) return
            if (mat.map) found = mat
          }
        })
      }

      if (found) {
        const mat: THREE.MeshStandardMaterial = found
        labelMatRef.current = mat
        const texture = textureRef.current
        if (texture) {
          mat.map = texture
          mat.needsUpdate = true
        }
      }
    }

    return () => {
      textureRef.current?.dispose()
      textureRef.current = null
      canvasRef.current = null
      labelMatRef.current = null
    }
  }, [scene])

  // Redraw label on every name/warning change
  useEffect(() => {
    if (!canvasRef.current || !textureRef.current) return
    drawLabel(canvasRef.current, { name, warning })
    textureRef.current.needsUpdate = true
  }, [name, warning])

  return <primitive object={scene} scale={1.8} position={[0, -0.4, 0]} />
}

// R3F mesh shown while GLB is loading
function CupSkeleton() {
  return (
    <mesh>
      <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />
      <meshStandardMaterial color="#C4724A" opacity={0.3} transparent />
    </mesh>
  )
}

useGLTF.preload('/ceramic fun cup keyshot.glb')
