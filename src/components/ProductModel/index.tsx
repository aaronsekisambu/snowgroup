'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

import type { ModelType } from '@/types/content'
import { buildModel, MODEL_CALLOUTS, type Variant } from './builders'

// What the page asks the model to do; read every frame, so changing it never re-renders React
export type ModelControls = {
  explode: number // 0 = assembled, 1 = parts pulled apart (pavers: lifted, waiting to be laid)
  rotateX: number // tilt toward the viewer
  rotateY: number // turn around the vertical axis
  autoRotate: boolean
  showLabels: boolean
}

// how the model sits in its frame: smaller (zoom > 1) and nudged sideways (shift) to leave room for callouts
export type Framing = { zoom?: number; shift?: number }

type Props = {
  model: ModelType
  variant?: Variant
  framing?: Framing
  controls: React.MutableRefObject<ModelControls>
  interactive?: boolean // drag to turn, with momentum
  className?: string
  label: string
}

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1)
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)

export const ProductModel: React.FC<Props> = ({ model, variant, framing, controls, interactive = false, className, label }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])
  const lineRefs = useRef<(SVGLineElement | null)[]>([])
  const dotRefs = useRef<(SVGCircleElement | null)[]>([])
  const storeys = variant?.storeys
  const zoom = framing?.zoom ?? 1
  const shift = framing?.shift ?? 0

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // phones and tablets get a lighter setup, so scrolling stays smooth
    const touch = window.matchMedia('(pointer: coarse)').matches
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, touch ? 1.5 : 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 400)
    const group = new THREE.Group()
    scene.add(group)
    const built = buildModel(model, group, { storeys })
    const scale = built.size / 4.6 // lights and shadows are tuned for a model about 4.6 units across

    // soft studio light: a key from above-front, a front fill, a cool rim to separate the edges
    scene.add(new THREE.HemisphereLight(0xf4f8fc, 0x5a6470, 2.2))
    const fill = new THREE.DirectionalLight(0xffffff, 1.6)
    fill.position.set(0, 1.5 * scale, 8 * scale)
    scene.add(fill)
    const key = new THREE.DirectionalLight(0xffffff, 3)
    key.position.set(3 * scale, 6 * scale, 5 * scale)
    key.castShadow = true
    key.shadow.mapSize.set(touch ? 1024 : 2048, touch ? 1024 : 2048)
    const reach = 7 * scale
    key.shadow.camera.left = key.shadow.camera.bottom = -reach
    key.shadow.camera.right = key.shadow.camera.top = reach
    key.shadow.camera.far = 40 * scale
    key.shadow.radius = 6
    key.shadow.bias = -0.0005
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x99b0c5, 1.2)
    rim.position.set(-5 * scale, 2 * scale, -4 * scale)
    scene.add(rim)

    // Measure the model assembled and fully exploded, so the camera can frame either state
    // (and everything in between) without cutting a part off or leaving it lost in empty space
    const box = new THREE.Box3()
    const measure = (exploded: boolean) => {
      built.parts.forEach((part) => {
        const lifted = exploded && !part.fixed && !built.stagger
        part.object.position.copy(part.home).addScaledVector(part.dir, lifted ? built.explodeDistance : 0)
      })
      group.updateMatrixWorld(true)
      // pavers waiting to be laid are hidden, so the exploded paver view frames the centre paver alone
      const onlyFixed = exploded && built.stagger
      box.makeEmpty()
      built.parts.forEach((part) => {
        if (!onlyFixed || part.fixed) box.expandByObject(part.object)
      })
      const cy = (box.min.y + box.max.y) / 2
      // the model turns about its vertical axis, so its width on screen is at most its footprint diagonal
      const reach = Math.max(Math.hypot(box.min.x, box.min.z), Math.hypot(box.max.x, box.min.z), Math.hypot(box.min.x, box.max.z), Math.hypot(box.max.x, box.max.z))
      return { cy, reach, half: (box.max.y - box.min.y) / 2, bottom: box.min.y }
    }
    const fitAssembled = measure(false)
    const fitExploded = measure(true)
    built.parts.forEach((part) => part.object.position.copy(part.home))

    // a contact shadow on an invisible floor grounds the model; it sits below the lowest part and never hides anything
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60 * scale, 60 * scale), new THREE.ShadowMaterial({ opacity: 0.2, depthWrite: false }))
    floor.rotation.x = -Math.PI / 2
    floor.position.y = Math.min(fitAssembled.bottom, fitExploded.bottom) - fitAssembled.reach * 0.03
    floor.receiveShadow = true
    floor.renderOrder = -1
    scene.add(floor)

    let viewW = 0
    let viewH = 0
    let dirty = true
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount
      if (!w || !h) return
      // ignore the tiny height changes when a mobile browser bar slides in or out
      if (Math.abs(w - viewW) < 1 && Math.abs(h - viewH) < 2) return
      viewW = w
      viewH = h
      dirty = true
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()

    // the camera eases back as the model comes apart, and closes in again as it goes back together
    const direction = new THREE.Vector3(0, 0.28, 1).normalize()
    const elevation = Math.atan2(0.28, 1)
    const frameCamera = (amount: number) => {
      // pavers: the camera closes in on the single paver only once the others have lifted away
      const t = built.stagger ? ease(clamp01((amount - 0.8) / 0.2)) : ease(amount)
      const mix = (a: number, b: number) => a + (b - a) * t
      const reach = mix(fitAssembled.reach, fitExploded.reach)
      const half = mix(fitAssembled.half, fitExploded.half)
      const cy = mix(fitAssembled.cy, fitExploded.cy)
      // on narrow screens the callouts are compact, so the model keeps its full size and stays centred
      const narrow = viewW / viewH < 1
      const halfV = THREE.MathUtils.degToRad(camera.fov / 2)
      const halfH = Math.atan(Math.tan(halfV) * camera.aspect)
      // seen from slightly above: the height on screen is the model's height plus a slice of its footprint
      const tall = half * Math.cos(elevation) + reach * Math.sin(elevation)
      // the near side of the model is closer to the camera, so leave room for it as well
      const distance = (Math.max(tall / Math.tan(halfV), reach / Math.tan(halfH)) + reach * 0.6) * 1.14 * (narrow ? 1 : zoom)
      const x = narrow ? 0 : shift * reach * 1.4
      camera.position.set(x, cy, 0).addScaledVector(direction, distance)
      camera.lookAt(x, cy, 0)
    }
    frameCamera(controls.current.explode)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)

    // drag to turn: follows the pointer 1:1, then carries its velocity and settles
    let dragging = false
    let lastX = 0
    let lastY = 0
    let velocityY = 0
    let dragY = 0
    let dragX = 0
    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      velocityY = 0
      mount.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = (e.clientX - lastX) * 0.01
      dragY += dx
      dragX = Math.min(Math.max(dragX + (e.clientY - lastY) * 0.006, -0.6), 0.6)
      velocityY = dx
      lastX = e.clientX
      lastY = e.clientY
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      if (mount.hasPointerCapture(e.pointerId)) mount.releasePointerCapture(e.pointerId)
    }
    if (interactive) {
      mount.addEventListener('pointerdown', onDown)
      mount.addEventListener('pointermove', onMove)
      mount.addEventListener('pointerup', onUp)
      mount.addEventListener('pointercancel', onUp)
    }

    // only draw while on screen
    let visible = false
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      dirty = true
    })
    io.observe(mount)

    let frame = 0
    let spin = 0
    const start = controls.current
    const current = { x: start.rotateX, y: start.rotateY, explode: start.explode }
    const projected = new THREE.Vector3()
    const callouts = MODEL_CALLOUTS[model]
    const anchors = callouts.map(() => ({ x: 0, y: 0 }))

    let lastSignature = ''
    const tick = () => {
      frame = requestAnimationFrame(tick)
      if (!visible) return
      const c = controls.current

      if (c.autoRotate && !reduceMotion && !dragging) spin += 0.0035
      if (!dragging) {
        dragY += velocityY
        velocityY *= 0.94
      }

      // critically damped follow: motion starts from where the model is now, never jumps
      current.x += (c.rotateX + dragX - current.x) * 0.09
      current.y += (c.rotateY + spin + dragY - current.y) * 0.09
      current.explode += (c.explode - current.explode) * 0.1
      group.rotation.set(current.x, current.y, 0)

      if (built.stagger) {
        // pavers are laid one after another, nearest the centre first: each drops in and fades up as it lands
        const laid = 1 - current.explode
        built.parts.forEach((part) => {
          const t = part.fixed ? 1 : clamp01((laid - (part.stagger ?? 0) * 0.7) / 0.3)
          const lift = 1 - ease(t)
          part.object.position.copy(part.home).addScaledVector(part.dir, lift * built.explodeDistance)
          part.materials?.forEach((material) => {
            material.opacity = part.fixed ? 1 : clamp01(t * 1.6)
            material.transparent = material.opacity < 0.999
            material.depthWrite = !material.transparent
          })
          part.object.visible = part.fixed || t > 0.001
        })
      } else {
        const e = ease(current.explode) * built.explodeDistance
        built.parts.forEach((part) => part.object.position.copy(part.home).addScaledVector(part.dir, e))
      }

      // draw only when something moved: an idle model costs nothing while the page scrolls
      const signature = `${current.x.toFixed(4)} ${current.y.toFixed(4)} ${current.explode.toFixed(4)}`
      if (!dirty && signature === lastSignature) return
      lastSignature = signature
      dirty = false
      frameCamera(current.explode)
      renderer.render(scene, camera)

      // callouts: each sits in a column beside the model, on the side of its part, joined to it by a line
      const labelsOn = c.showLabels && current.explode > 0.55
      const { clientWidth: w, clientHeight: h } = mount
      const compact = w < 640
      mount.classList.toggle('is-compact', compact)
      callouts.forEach((callout, i) => {
        const index = built.labelAt[callout.title]
        if (index === undefined) return
        const part = built.parts[index]
        projected.copy(built.labelAnchors?.[callout.title] ?? part.anchor ?? new THREE.Vector3())
        part.object.localToWorld(projected)
        projected.project(camera)
        anchors[i].x = ((projected.x + 1) / 2) * w
        anchors[i].y = ((1 - projected.y) / 2) * h
      })
      const margin = compact ? 8 : 16
      const gap = compact ? 6 : 12
      ;(['left', 'right'] as const).forEach((side) => {
        const placed = callouts
          .map((_, i) => i)
          .filter((i) => built.labelAt[callouts[i].title] !== undefined && (anchors[i].x < w / 2) === (side === 'left'))
          .sort((p, q) => anchors[p].y - anchors[q].y)
        let floor = margin
        placed.forEach((i) => {
          const el = labelRefs.current[i]
          const line = lineRefs.current[i]
          const dot = dotRefs.current[i]
          if (!el || !line || !dot) return
          const lw = el.offsetWidth
          const lh = el.offsetHeight
          const y = Math.min(Math.max(anchors[i].y - lh / 2, floor), h - lh - margin)
          floor = y + lh + gap
          const x = side === 'left' ? margin : w - lw - margin
          el.style.transform = `translate(${x}px, ${y}px)`
          el.style.opacity = labelsOn ? '1' : '0'
          // the line leaves the label at its inner edge and ends on the part
          const fromX = side === 'left' ? x + lw + 4 : x - 4
          line.setAttribute('x1', String(fromX))
          line.setAttribute('y1', String(y + lh / 2))
          line.setAttribute('x2', String(anchors[i].x))
          line.setAttribute('y2', String(anchors[i].y))
          dot.setAttribute('cx', String(anchors[i].x))
          dot.setAttribute('cy', String(anchors[i].y))
          line.style.opacity = dot.style.opacity = labelsOn ? '1' : '0'
        })
      })
    }
    tick()

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      resizeObserver.disconnect()
      mount.removeEventListener('pointerdown', onDown)
      mount.removeEventListener('pointermove', onMove)
      mount.removeEventListener('pointerup', onUp)
      mount.removeEventListener('pointercancel', onUp)
      // free every geometry in this scene, then the model's own materials and textures
      const seen = new Set<THREE.BufferGeometry>()
      scene.traverse((child) => {
        const geometry = (child as THREE.Mesh).geometry
        if (geometry && !seen.has(geometry)) {
          seen.add(geometry)
          geometry.dispose()
        }
      })
      built.dispose()
      ;(floor.material as THREE.Material).dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [model, storeys, zoom, shift, controls, interactive])

  return (
    <div
      ref={mountRef}
      className={`snow-block-canvas ${interactive ? 'is-interactive' : ''} ${className || ''}`}
      role="img"
      aria-label={label}
    >
      {MODEL_CALLOUTS[model].length > 0 && (
        <svg className="snow-callout-lines" aria-hidden="true">
          {MODEL_CALLOUTS[model].map((callout, i) => (
            <g key={callout.title}>
              <line ref={(el) => { lineRefs.current[i] = el }} />
              <circle ref={(el) => { dotRefs.current[i] = el }} r="3.5" />
            </g>
          ))}
        </svg>
      )}
      {MODEL_CALLOUTS[model].map((callout, i) => (
        <div key={callout.title} ref={(el) => { labelRefs.current[i] = el }} className="snow-callout" aria-hidden="true">
          <strong>{callout.title}</strong>
          <span>{callout.detail}</span>
        </div>
      ))}
    </div>
  )
}
