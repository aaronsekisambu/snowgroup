import * as THREE from 'three'

import type { ModelType } from '@/types/content'

/* -------------------------------------------

Parametric 3D models for products, services and projects.

Every builder adds its parts to a group and says, per part, where it sits when the model is
assembled (home), which way it travels when the model is exploded (dir), and optionally where
its callout label points (anchor, in the part's own space). Sizes are in metres, except the
small products (block, paver), which are in units of 100 mm.

------------------------------------------- */

export type Part = {
  object: THREE.Object3D
  home: THREE.Vector3
  dir: THREE.Vector3
  anchor?: THREE.Vector3
  stagger?: number // pavers: 0 lands first, 1 lands last
  materials?: THREE.MeshStandardMaterial[] // pavers fade in as they land
  fixed?: boolean // never moves (the centre paver)
}

export type Built = {
  parts: Part[]
  labelAt: Record<string, number> // label text → part index
  labelAnchors?: Record<string, THREE.Vector3> // a point on the part for that label, when one part has several
  explodeDistance: number
  size: number // largest dimension, used to frame the camera
  floorY: number
  stagger?: boolean
  dispose: () => void
}

export type Variant = { storeys?: number }

// Callouts per model, in the order React renders them: a name and one line on what the part does
export type Callout = { title: string; detail: string }

export const MODEL_CALLOUTS: Record<ModelType, Callout[]> = {
  'hollow-block': [
    { title: 'Closed side', detail: 'A solid face that gives mortar a full, even bed.' },
    { title: 'Face shell', detail: 'The outer walls of the block, 400 mm long.' },
    { title: 'End web', detail: 'Joins the two face shells at each end.' },
    { title: 'Centre web', detail: 'Ties the shells together across the middle.' },
    { title: 'Hollow cores', detail: 'Two open cores take weight out of the block.' },
  ],
  'interlocking-paver': [
    { title: 'Wide end', detail: 'Each wide end slides into the waist of the next row.' },
    { title: 'Narrow waist', detail: 'Takes the wide ends of the pavers beside it.' },
    { title: '60 mm thick', detail: 'For driveways, compounds and walkways.' },
  ],
  villa: [
    { title: 'Foundation', detail: 'Reinforced concrete footing that spreads the load into the ground.' },
    { title: 'Ground floor', detail: 'Block walls with arched openings and the main entrance.' },
    { title: 'First floor', detail: 'Upper rooms and balcony on a reinforced concrete slab.' },
    { title: 'Roof', detail: 'A hipped roof finished in tiles.' },
    { title: 'Columns', detail: 'A two-storey portico framing the entrance.' },
    { title: 'Interior walls', detail: 'Partitions divide each floor into rooms, with doorways between them.' },
    { title: 'Staircase', detail: 'A straight flight of stairs between the floors.' },
  ],
  bungalow: [
    { title: 'Foundation', detail: 'Concrete footing under every wall.' },
    { title: 'Walls', detail: 'Concrete block walling, plastered and finished.' },
    { title: 'Roof', detail: 'A pitched roof finished in tiles.' },
    { title: 'Interior walls', detail: 'Partitions divide the house into rooms, with doorways between them.' },
  ],
  apartment: [
    { title: 'Foundation', detail: 'Footings sized for a multi-storey load.' },
    { title: 'Ground floor', detail: 'The entrance level, in block walling.' },
    { title: 'Upper floors', detail: 'Repeated floors on reinforced concrete slabs, with balconies.' },
    { title: 'Roof', detail: 'A flat concrete roof behind a parapet.' },
    { title: 'Interior walls', detail: 'Each floor is divided into rooms around a corridor.' },
    { title: 'Staircase', detail: 'Stairs rise floor by floor through the building.' },
  ],
  office: [
    { title: 'Foundation', detail: 'Footings along the full length of the building.' },
    { title: 'Ground floor', detail: 'Offices and the entrance behind tall windows.' },
    { title: 'First floor', detail: 'A second floor of offices on a concrete slab.' },
    { title: 'Roof', detail: 'A flat roof behind a parapet.' },
    { title: 'Interior walls', detail: 'Partitions make offices along the back of each floor.' },
    { title: 'Staircase', detail: 'Stairs between the two office floors.' },
  ],
  construction: [
    { title: 'Foundation', detail: 'Footings set out and cast first.' },
    { title: 'Frame', detail: 'Reinforced concrete columns and slabs, floor by floor.' },
    { title: 'Walls', detail: 'Block walling follows the frame as it rises.' },
    { title: 'Edge beams', detail: 'Beams along the slab edges carry the walls above.' },
  ],
  frame: [
    { title: 'Foundation', detail: 'Footings carry every column load into the ground.' },
    { title: 'Columns', detail: 'Reinforced concrete columns on a regular grid.' },
    { title: 'Floor slabs', detail: 'Slabs and edge beams tie the columns together.' },
    { title: 'Edge beams', detail: 'Beams along the slab edges carry the walls above.' },
  ],
  blueprint: [
    { title: 'Site plan', detail: 'The footprint, set out on its grid.' },
    { title: 'Ground floor plan', detail: 'Walls, rooms and every opening, drawn to scale.' },
    { title: 'First floor plan', detail: 'The upper floor, laid out over the one below.' },
    { title: 'Roof plan', detail: 'The roof shape and its pitch.' },
    { title: 'Dimensions', detail: 'Overall sizes, measured along each side.' },
    { title: 'Grid lines', detail: 'The setting-out grid that columns and walls follow.' },
    { title: 'Interior walls', detail: 'Room partitions, with a doorway in each.' },
    { title: 'Staircase', detail: 'Stairs between the floors, with rise and run set out.' },
  ],
  mep: [
    { title: 'Building shell', detail: 'The structure the services run through.' },
    { title: 'Water', detail: 'A supply riser with a run to each floor.' },
    { title: 'Power', detail: 'Conduits for lighting and sockets on every floor.' },
    { title: 'Drainage', detail: 'A soil stack falling to the run below ground.' },
  ],
  farm: [
    { title: 'Floor slab', detail: 'A concrete floor that is easy to keep clean.' },
    { title: 'Steel columns', detail: 'Carry the roof over a wide, open span.' },
    { title: 'Walls', detail: 'Low block walls, open above for air.' },
    { title: 'Roof', detail: 'A sheeted gable roof that sheds rain.' },
  ],
  road: [
    { title: 'Subgrade', detail: 'The natural ground, levelled and compacted.' },
    { title: 'Sub-base', detail: 'Compacted gravel that spreads the load.' },
    { title: 'Base course', detail: 'A stronger layer right under the surface.' },
    { title: 'Surface', detail: 'The running surface that traffic drives on.' },
    { title: 'Kerbs & drains', detail: 'Kerbs hold the edge; drains carry water away.' },
  ],
  pallet: [
    { title: 'Pallet', detail: 'A timber pallet for safe lifting and delivery.' },
    { title: 'H6 blocks', detail: 'Four layers of eighteen blocks, stacked for transport.' },
  ],
}

export const MODEL_LABELS = Object.fromEntries(
  Object.entries(MODEL_CALLOUTS).map(([model, callouts]) => [model, callouts.map((callout) => callout.title)]),
) as Record<ModelType, string[]>

/* ---------- materials ---------- */

// A fine, uneven grain so surfaces read as cast concrete rather than flat plastic
export function concreteTexture(base: string): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)
  const image = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < image.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 38
    image.data[i] += n
    image.data[i + 1] += n
    image.data[i + 2] += n
  }
  ctx.putImageData(image, 0, 0)
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(60, 60, 58, ${Math.random() * 0.35})`
    ctx.beginPath()
    ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 1.6, 0, Math.PI * 2)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Greyscale surface patterns, multiplied into each material colour
function patternTexture(draw: (ctx: CanvasRenderingContext2D, size: number) => void, repeat: [number, number]): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  draw(ctx, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(...repeat)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

const grain = (strength: number, pores: number) => (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, size, size)
  const image = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < image.data.length; i += 4) {
    const n = (Math.random() - 0.5) * strength
    image.data[i] += n
    image.data[i + 1] += n
    image.data[i + 2] += n
  }
  ctx.putImageData(image, 0, 0)
  for (let i = 0; i < pores; i++) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.25})`
    ctx.beginPath()
    ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 1.8, 0, Math.PI * 2)
    ctx.fill()
  }
}

// roof tiles: courses with a shadow line under each, and a little colour from tile to tile
const tiles = (ctx: CanvasRenderingContext2D, size: number) => {
  grain(14, 40)(ctx, size)
  const rows = 8
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < 8; c++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.12})`
      ctx.fillRect(c * 32 + (r % 2) * 16, r * 32, 32, 32)
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
    ctx.fillRect(0, r * 32 + 28, size, 4)
  }
}

// roof sheets: regular ribs
const ribs = (ctx: CanvasRenderingContext2D, size: number) => {
  for (let x = 0; x < size; x++) {
    const v = 200 + Math.round(40 * Math.sin((x / size) * Math.PI * 16))
    ctx.fillStyle = `rgb(${v}, ${v}, ${v})`
    ctx.fillRect(x, 0, 1, size)
  }
}

// timber: long streaks along the board
const timber = (ctx: CanvasRenderingContext2D, size: number) => {
  grain(10, 0)(ctx, size)
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = `rgba(60, 30, 0, ${0.08 + Math.random() * 0.15})`
    ctx.beginPath()
    const y = Math.random() * size
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(size / 3, y + 6, (2 * size) / 3, y - 6, size, y + 2)
    ctx.stroke()
  }
}

function palette() {
  const texture = concreteTexture('#a3a39e')
  const textures = {
    plaster: patternTexture(grain(16, 60), [2, 2]),
    rough: patternTexture(grain(40, 260), [2, 2]),
    tiles: patternTexture(tiles, [3, 3]),
    ribs: patternTexture(ribs, [4, 1]),
    timber: patternTexture(timber, [1, 1]),
  }
  const std = (color: number, roughness = 0.85, metalness = 0, map?: THREE.Texture) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, map })
  const m = {
    plaster: std(0xf6f3ed, 0.9, 0, textures.plaster),
    trim: std(0xfdfbf7, 0.8, 0, textures.plaster),
    concrete: std(0xd2d0ca, 0.92, 0, texture),
    footing: std(0x9c9891, 0.95, 0, texture),
    roofTile: std(0xa5502f, 0.7, 0, textures.tiles),
    roofSheet: std(0x8795a1, 0.45, 0.45, textures.ribs),
    glass: std(0x2c3d4f, 0.15, 0.35),
    steel: std(0x3b4046, 0.5, 0.6),
    block: std(0xc9c6c0, 0.92, 0, texture),
    soil: std(0x7f5e42, 1, 0, textures.rough),
    gravel: std(0x8f8a80, 1, 0, textures.rough),
    base: std(0xb3ada2, 0.95, 0, texture),
    asphalt: std(0x3a3e42, 0.9, 0, textures.rough),
    wood: std(0xa87e54, 0.85, 0, textures.timber),
    water: std(0x2f7fd1, 0.4, 0.2),
    power: std(0xf0b429, 0.5, 0.1),
    drain: std(0x6b7178, 0.6, 0.2),
  }
  return {
    m,
    dispose: () => {
      Object.values(m).forEach((material) => material.dispose())
      texture.dispose()
      Object.values(textures).forEach((t) => t.dispose())
    },
  }
}

/* ---------- small helpers ---------- */

// geometries are freed by the viewer, which walks the scene when it unmounts
const keep = <T extends THREE.BufferGeometry>(g: T) => g

function box(w: number, h: number, d: number, material: THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(keep(new THREE.BoxGeometry(w, h, d)), material)
  mesh.position.set(x, y, z)
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

// A wall with real openings: windows (optionally arched) and doors are cut out of the block
type Opening = { x: number; y: number; w: number; h: number; arch?: boolean }

function wall(length: number, height: number, thick: number, openings: Opening[], m: ReturnType<typeof palette>['m']) {
  const shape = new THREE.Shape()
  shape.moveTo(-length / 2, 0)
  shape.lineTo(length / 2, 0)
  shape.lineTo(length / 2, height)
  shape.lineTo(-length / 2, height)
  shape.closePath()
  openings.forEach((o) => {
    const hole = new THREE.Path()
    const top = o.arch ? o.y + o.h - o.w / 2 : o.y + o.h
    hole.moveTo(o.x - o.w / 2, o.y)
    hole.lineTo(o.x + o.w / 2, o.y)
    hole.lineTo(o.x + o.w / 2, top)
    if (o.arch) hole.absarc(o.x, top, o.w / 2, 0, Math.PI, false)
    else hole.lineTo(o.x - o.w / 2, top)
    hole.closePath()
    shape.holes.push(hole)
  })
  const geometry = keep(new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false, curveSegments: 12 }))
  geometry.translate(0, 0, -thick / 2)
  const group = new THREE.Group()
  const body = new THREE.Mesh(geometry, m.plaster)
  body.castShadow = body.receiveShadow = true
  group.add(body)
  // glass set back inside each window (doors stay open)
  openings
    .filter((o) => o.y > 0.1)
    .forEach((o) => group.add(box(o.w, o.h, 0.04, m.glass, o.x, o.y + o.h / 2, -thick * 0.2)))
  return group
}

// Openings spaced evenly along a wall; a door can replace the middle one on the ground floor
function openingsFor(length: number, count: number, opts: { door?: boolean; arch?: boolean; tall?: boolean }) {
  const list: Opening[] = []
  const step = length / count
  for (let i = 0; i < count; i++) {
    const x = -length / 2 + step * (i + 0.5)
    const isDoor = opts.door && i === Math.floor(count / 2)
    list.push(
      isDoor
        ? { x, y: 0, w: 1.3, h: 2.4, arch: opts.arch }
        : { x, y: 0.9, w: Math.min(1.3, step * 0.55), h: opts.tall ? 1.8 : 1.4, arch: opts.arch },
    )
  }
  return list
}

// Four walls of one storey with their windows
function storeyWalls(w: number, d: number, h: number, m: ReturnType<typeof palette>['m'], opts: { front: number; side: number; door?: boolean; arch?: boolean; tall?: boolean }) {
  const t = 0.22
  const group = new THREE.Group()
  const front = wall(w, h, t, openingsFor(w, opts.front, { door: opts.door, arch: opts.arch, tall: opts.tall }), m)
  front.position.z = d / 2 - t / 2
  const back = wall(w, h, t, openingsFor(w, opts.front, { arch: opts.arch, tall: opts.tall }), m)
  back.position.z = -d / 2 + t / 2
  back.rotation.y = Math.PI
  const left = wall(d - 2 * t, h, t, openingsFor(d - 2 * t, opts.side, { tall: opts.tall }), m)
  left.position.x = -w / 2 + t / 2
  left.rotation.y = -Math.PI / 2
  const right = wall(d - 2 * t, h, t, openingsFor(d - 2 * t, opts.side, { tall: opts.tall }), m)
  right.position.x = w / 2 - t / 2
  right.rotation.y = Math.PI / 2
  group.add(front, back, left, right)
  return group
}

// A hipped roof (a low pyramid stretched over the footprint) or a gable roof
function hipRoof(w: number, d: number, rise: number, material: THREE.Material) {
  const geometry = keep(new THREE.ConeGeometry(1, rise, 4, 1))
  geometry.rotateY(Math.PI / 4)
  geometry.scale((w + 1.2) / Math.SQRT2, 1, (d + 1.2) / Math.SQRT2)
  geometry.translate(0, rise / 2, 0)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

function gableRoof(w: number, d: number, rise: number, material: THREE.Material) {
  const shape = new THREE.Shape()
  shape.moveTo(-(w + 1) / 2, 0)
  shape.lineTo((w + 1) / 2, 0)
  shape.lineTo(0, rise)
  shape.closePath()
  const geometry = keep(new THREE.ExtrudeGeometry(shape, { depth: d + 1, bevelEnabled: false }))
  geometry.translate(0, 0, -(d + 1) / 2)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

function parapet(w: number, d: number, material: THREE.Material) {
  const group = new THREE.Group()
  const h = 0.6
  group.add(
    box(w, h, 0.2, material, 0, h / 2, d / 2 - 0.1),
    box(w, h, 0.2, material, 0, h / 2, -d / 2 + 0.1),
    box(0.2, h, d, material, -w / 2 + 0.1, h / 2, 0),
    box(0.2, h, d, material, w / 2 - 0.1, h / 2, 0),
  )
  return group
}

/* ---------- interiors ---------- */

// Room partitions: a wall along the building with a doorway, and two cross walls making back rooms
function partitions(w: number, d: number, h: number, material: THREE.Material) {
  const group = new THREE.Group()
  const t = 0.12
  const inner = w / 2 - 0.25
  const zLine = -d * 0.1
  group.add(box(inner - 0.6, h, t, material, -(inner + 0.6) / 2, h / 2, zLine))
  group.add(box(inner - 0.6, h, t, material, (inner + 0.6) / 2, h / 2, zLine))
  const back = d / 2 - 0.25 + zLine
  for (const x of [-w / 4, w / 4]) group.add(box(t, h, back - 0.9, material, x, h / 2, zLine - (back - 0.9) / 2 - 0.9))
  return group
}

// A straight flight of stairs climbing one storey, in the front corner
function staircase(w: number, d: number, h: number, material: THREE.Material) {
  const group = new THREE.Group()
  const steps = 14
  const run = Math.min(3.2, d * 0.4)
  const width = 1.1
  const x = w / 2 - 0.3 - width / 2
  for (let i = 0; i < steps; i++) {
    const rise = (h / steps) * (i + 1)
    group.add(box(width, rise, run / steps, material, x, rise / 2, d / 2 - 0.4 - (run / steps) * (i + 0.5)))
  }
  return group
}

/* ---------- assembling parts ---------- */

class Assembly {
  parts: Part[] = []
  labelAt: Record<string, number> = {}
  anchors: Record<string, THREE.Vector3> = {}

  // a callout that points at a spot inside a part (a staircase inside a floor, for example)
  point(label: string, index: number, at: [number, number, number]) {
    if (this.labelAt[label] !== undefined) return
    this.labelAt[label] = index
    this.anchors[label] = new THREE.Vector3(...at)
  }

  constructor(private group: THREE.Group) {}

  add(object: THREE.Object3D, y: number, dir: [number, number, number], label?: string, anchor?: [number, number, number]) {
    object.position.y += y
    this.group.add(object)
    const index = this.parts.length
    this.parts.push({
      object,
      home: object.position.clone(),
      dir: new THREE.Vector3(...dir),
      anchor: anchor ? new THREE.Vector3(...anchor) : undefined,
    })
    if (label && this.labelAt[label] === undefined) this.labelAt[label] = index
    return index
  }

  // centre the model on its own height so it turns about its middle
  centre(height: number) {
    this.parts.forEach((part) => {
      part.home.y -= height / 2
      part.object.position.copy(part.home)
    })
  }
}

/* ---------- buildings ---------- */

type BuildingOptions = {
  w: number
  d: number
  storeys: number
  h?: number
  roof: 'hip' | 'gable' | 'flat'
  front: number
  side: number
  arch?: boolean
  tall?: boolean
  columns?: number
  balconies?: boolean
  labels: { ground: string; upper?: string; roof: string; foundation?: string }
}

function buildBuilding(group: THREE.Group, o: BuildingOptions): Built {
  const { m, dispose } = palette()
  const a = new Assembly(group)
  const h = o.h ?? 3
  const slab = 0.25
  const footH = 0.45
  const side = o.w / 2 + 1.2

  a.add(box(o.w + 0.8, footH, o.d + 0.8, m.footing, 0, footH / 2, 0), 0, [0, 0, 0], o.labels.foundation || 'Foundation', [side, 0.2, 0])

  let y = footH
  let level = 1
  for (let k = 0; k < o.storeys; k++) {
    const walls = storeyWalls(o.w, o.d, h, m, { front: o.front, side: o.side, door: k === 0, arch: o.arch, tall: o.tall })
    // inside each floor: rooms, and stairs up to the next floor
    walls.add(partitions(o.w, o.d, h, m.plaster))
    const stairs = o.storeys > 1 && k < o.storeys - 1
    if (stairs) walls.add(staircase(o.w, o.d, h, m.concrete))
    const label = k === 0 ? o.labels.ground : o.labels.upper
    const index = a.add(walls, y, [0, level++, 0], label, [side, h / 2, 0])
    if (k === 0) {
      a.point('Interior walls', index, [-o.w / 4, h, -o.d * 0.3])
      if (stairs) a.point('Staircase', index, [o.w / 2 - 0.85, h * 0.6, o.d / 2 - 1.6])
    }
    y += h
    const top = k === o.storeys - 1
    if (!top || o.roof === 'flat') {
      const floor = new THREE.Group()
      floor.add(box(o.w + 0.3, slab, o.d + 0.3, m.concrete, 0, slab / 2, 0))
      // balconies hang off the front of upper floors
      if (o.balconies && !top) {
        floor.add(box(o.w * 0.4, slab, 1.4, m.concrete, 0, slab / 2, o.d / 2 + 0.7))
        floor.add(box(o.w * 0.4, 1, 0.06, m.trim, 0, slab + 0.5, o.d / 2 + 1.37))
      }
      if (top) floor.add(parapet(o.w + 0.3, o.d + 0.3, m.trim).translateY(slab))
      a.add(floor, y, [0, level++, 0], top ? o.labels.roof : undefined, [side, 0.2, 0])
      y += slab
    }
  }

  if (o.roof !== 'flat') {
    const rise = o.roof === 'hip' ? Math.min(o.w, o.d) * 0.32 : o.w * 0.22
    const roof = o.roof === 'hip' ? hipRoof(o.w, o.d, rise, m.roofTile) : gableRoof(o.w, o.d, rise, m.roofSheet)
    a.add(roof, y, [0, level++, 0], o.labels.roof, [side, rise / 2, 0])
    y += rise
  }

  // a two-storey portico: columns and the slab they carry stand in front of the entrance
  if (o.columns) {
    const portico = new THREE.Group()
    const colH = footH + o.storeys * h + (o.storeys - 1) * slab
    const span = o.w * 0.5
    for (let i = 0; i < o.columns; i++) {
      const x = -span / 2 + (span / (o.columns - 1)) * i
      const column = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.22, 0.26, colH - footH, 20)), m.trim)
      column.position.set(x, footH + (colH - footH) / 2, o.d / 2 + 1.6)
      column.castShadow = column.receiveShadow = true
      portico.add(column)
    }
    portico.add(box(span + 1.2, slab, 2.4, m.trim, 0, colH + slab / 2, o.d / 2 + 1.2))
    a.add(portico, 0, [0, 0, 2.2], 'Columns', [span / 2 + 0.6, colH * 0.6, o.d / 2 + 1.6])
  }

  a.centre(y)
  return {
    parts: a.parts,
    labelAt: a.labelAt,
    labelAnchors: a.anchors,
    explodeDistance: 0.9,
    size: Math.max(o.w, o.d, y) + 2,
    floorY: -y / 2 - 0.01,
    dispose,
  }
}

// A reinforced concrete frame: columns on a grid and a slab at every level
function buildFrame(group: THREE.Group, storeys: number, withWalls: boolean): Built {
  const { m, dispose } = palette()
  const a = new Assembly(group)
  const w = 12
  const d = 8
  const h = 3
  const slab = 0.25
  const footH = 0.45
  const side = w / 2 + 1.2
  a.add(box(w + 0.8, footH, d + 0.8, m.footing, 0, footH / 2, 0), 0, [0, 0, 0], 'Foundation', [side, 0.2, 0])

  let y = footH
  let level = 1
  for (let k = 0; k < storeys; k++) {
    const columns = new THREE.Group()
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        columns.add(box(0.35, h, 0.35, m.concrete, -w / 2 + 0.3 + i * ((w - 0.6) / 3), h / 2, -d / 2 + 0.3 + j * ((d - 0.6) / 2)))
      }
    }
    a.add(columns, y, [0, level++, 0], withWalls ? 'Frame' : 'Columns', [side, h / 2, 0])
    // on a site still going up, block walls have reached the ground floor only
    if (withWalls && k === 0) {
      const walls = storeyWalls(w, d, h, m, { front: 4, side: 2, door: true })
      walls.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material === m.plaster) child.material = m.block
      })
      a.add(walls, y, [0, 0, 2.4], 'Walls', [w / 2 + 0.6, h / 2, d / 2])
    }
    y += h
    const floor = new THREE.Group()
    floor.add(box(w, slab, d, m.concrete, 0, slab / 2, 0))
    // beams along the slab edges
    floor.add(box(w, 0.45, 0.3, m.concrete, 0, -0.1, d / 2 - 0.15), box(w, 0.45, 0.3, m.concrete, 0, -0.1, -d / 2 + 0.15))
    const floorIndex = a.add(floor, y, [0, level++, 0], 'Floor slabs', [side, 0.2, 0])
    a.point('Edge beams', floorIndex, [-w / 4, -0.2, d / 2])
    y += slab
  }

  a.centre(y)
  return {
    parts: a.parts,
    labelAt: a.labelAt,
    labelAnchors: a.anchors,
    explodeDistance: 0.9,
    size: Math.max(w, y) + 2,
    floorY: -y / 2 - 0.01,
    dispose,
  }
}

// Drawing marks for the architectural model: dimension lines along two sides and a dashed setting-out grid
function drawingMarks(built: Built, w: number, d: number) {
  const site = built.parts[0].object
  const y = 0.25 // on top of the footing (the site part is the footing box, centred on itself)
  const ink = new THREE.LineBasicMaterial({ color: 0x0a66c2, transparent: true, opacity: 0.75 })
  const dash = new THREE.LineDashedMaterial({ color: 0x0a66c2, transparent: true, opacity: 0.45, dashSize: 0.35, gapSize: 0.22 })
  const V = (x: number, z: number) => new THREE.Vector3(x, y, z)
  const segments = (points: THREE.Vector3[], material: THREE.LineBasicMaterial | THREE.LineDashedMaterial) => {
    const line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), material)
    line.computeLineDistances()
    site.add(line)
  }
  // dimension lines with extension lines and end ticks
  const fz = d / 2 + 1.6
  const sx = w / 2 + 1.6
  segments(
    [
      V(-w / 2, fz), V(w / 2, fz), V(-w / 2, d / 2 + 0.6), V(-w / 2, fz + 0.4), V(w / 2, d / 2 + 0.6), V(w / 2, fz + 0.4),
      V(-w / 2 - 0.25, fz + 0.25), V(-w / 2 + 0.25, fz - 0.25), V(w / 2 - 0.25, fz + 0.25), V(w / 2 + 0.25, fz - 0.25),
      V(sx, -d / 2), V(sx, d / 2), V(w / 2 + 0.6, -d / 2), V(sx + 0.4, -d / 2), V(w / 2 + 0.6, d / 2), V(sx + 0.4, d / 2),
      V(sx - 0.25, -d / 2 - 0.25), V(sx + 0.25, -d / 2 + 0.25), V(sx - 0.25, d / 2 - 0.25), V(sx + 0.25, d / 2 + 0.25),
    ],
    ink,
  )
  // grid lines through the walls, with a bubble at the end of each
  const grid: THREE.Vector3[] = []
  const xs = [-w / 2, -w / 4, 0, w / 4, w / 2]
  const zs = [-d / 2, 0, d / 2]
  xs.forEach((x) => grid.push(V(x, -d / 2 - 2.4), V(x, d / 2 + 0.4)))
  zs.forEach((z) => grid.push(V(-w / 2 - 2.4, z), V(w / 2 + 0.4, z)))
  segments(grid, dash)
  const bubble = (x: number, z: number) => {
    const points = Array.from({ length: 25 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2
      return V(x + Math.cos(a) * 0.4, z + Math.sin(a) * 0.4)
    })
    site.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ink))
  }
  xs.forEach((x) => bubble(x, -d / 2 - 2.8))
  zs.forEach((z) => bubble(-w / 2 - 2.8, z))

  const anchors = built.labelAnchors || (built.labelAnchors = {})
  built.labelAt['Dimensions'] = 0
  anchors['Dimensions'] = V(0, fz)
  built.labelAt['Grid lines'] = 0
  anchors['Grid lines'] = V(-w / 4, -d / 2 - 2.4)

  const dispose = built.dispose
  built.dispose = () => {
    dispose()
    ink.dispose()
    dash.dispose()
  }
  return built
}

// Architectural design: the house as drawing lines, with the faces barely there
function toBlueprint(built: Built) {
  const ink = new THREE.LineBasicMaterial({ color: 0x0a66c2, transparent: true, opacity: 0.85 })
  const face = new THREE.MeshBasicMaterial({ color: 0x0a66c2, transparent: true, opacity: 0.05, depthWrite: false })
  const lines: THREE.BufferGeometry[] = []
  built.parts.forEach(({ object }) => {
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      const edges = new THREE.EdgesGeometry(child.geometry, 20)
      lines.push(edges)
      child.add(new THREE.LineSegments(edges, ink))
      child.material = face
      child.castShadow = false
    })
  })
  const dispose = built.dispose
  built.dispose = () => {
    dispose()
    lines.forEach((g) => g.dispose())
    ink.dispose()
    face.dispose()
  }
  return built
}

// Building services: a see-through shell with water, power and drainage runs inside
function buildMep(group: THREE.Group): Built {
  const { m, dispose } = palette()
  const a = new Assembly(group)
  const w = 12
  const d = 8
  const h = 3
  const glassShell = new THREE.MeshStandardMaterial({ color: 0xf1eee8, transparent: true, opacity: 0.16, roughness: 0.9, depthWrite: false })

  const shell = new THREE.Group()
  shell.add(box(w, 0.4, d, m.footing, 0, 0.2, 0))
  for (let k = 0; k < 2; k++) {
    const walls = storeyWalls(w, d, h, m, { front: 4, side: 2, door: k === 0 })
    walls.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = glassShell
        child.castShadow = false
      }
    })
    walls.position.y = 0.4 + k * (h + 0.25)
    shell.add(walls)
    shell.add(box(w + 0.3, 0.25, d + 0.3, glassShell, 0, 0.4 + (k + 1) * h + k * 0.25 + 0.125, 0))
  }
  const height = 0.4 + 2 * h + 0.5
  a.add(shell, 0, [0, 2.2, 0], 'Building shell', [w / 2 + 1.2, height * 0.8, 0])

  const pipe = (r: number, from: THREE.Vector3, to: THREE.Vector3, material: THREE.Material) => {
    const length = from.distanceTo(to)
    const mesh = new THREE.Mesh(keep(new THREE.CylinderGeometry(r, r, length, 12)), material)
    mesh.position.copy(from).add(to).multiplyScalar(0.5)
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize())
    mesh.castShadow = true
    return mesh
  }
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

  // water: a riser and a run on each floor
  const water = new THREE.Group()
  water.add(pipe(0.08, V(-4, 0.4, -2.5), V(-4, 6.4, -2.5), m.water))
  ;[2.8, 6].forEach((y) => water.add(pipe(0.06, V(-4, y, -2.5), V(3.5, y, -2.5), m.water)))
  a.add(water, 0, [-2.2, 0, 0], 'Water', [-4, 5, -2.5])

  // power: conduits on each floor and up to the ceiling lights
  const power = new THREE.Group()
  power.add(pipe(0.05, V(4.5, 0.4, 2.5), V(4.5, 6.4, 2.5), m.power))
  ;[3.2, 6.4].forEach((y) => power.add(pipe(0.04, V(-4.5, y, 2.5), V(4.5, y, 2.5), m.power)))
  a.add(power, 0, [2.2, 0, 0], 'Power', [4.5, 5, 2.5])

  // drainage: a stack falling to a run under the ground floor
  const drainage = new THREE.Group()
  drainage.add(pipe(0.11, V(2, 6.2, -2.8), V(2, 0.2, -2.8), m.drain), pipe(0.11, V(2, 0.2, -2.8), V(2, 0.2, 4.5), m.drain))
  a.add(drainage, 0, [0, -1.2, 1.8], 'Drainage', [2, 0.2, 4.5])

  a.centre(height)
  return {
    parts: a.parts,
    labelAt: a.labelAt,
    explodeDistance: 0.9,
    size: Math.max(w, height) + 2,
    floorY: -height / 2 - 0.6,
    dispose: () => {
      dispose()
      glassShell.dispose()
    },
  }
}

// A farm building: floor slab, steel columns, low block walls and a sheeted gable roof
function buildFarm(group: THREE.Group): Built {
  const { m, dispose } = palette()
  const a = new Assembly(group)
  const w = 16
  const d = 9
  const colH = 4.2
  a.add(box(w + 0.6, 0.3, d + 0.6, m.footing, 0, 0.15, 0), 0, [0, 0, 0], 'Floor slab', [w / 2 + 1.2, 0.2, 0])

  const columns = new THREE.Group()
  for (let i = 0; i < 5; i++) {
    for (const z of [-d / 2, d / 2]) columns.add(box(0.25, colH, 0.25, m.steel, -w / 2 + (w / 4) * i, colH / 2, z))
  }
  a.add(columns, 0.3, [0, 1, 0], 'Steel columns', [w / 2 + 1, colH * 0.7, d / 2])

  const walls = new THREE.Group()
  const wallH = 1.2
  walls.add(box(w, wallH, 0.2, m.block, 0, wallH / 2, d / 2), box(w, wallH, 0.2, m.block, 0, wallH / 2, -d / 2))
  walls.add(box(0.2, wallH, d, m.block, -w / 2, wallH / 2, 0), box(0.2, wallH, d, m.block, w / 2, wallH / 2, 0))
  a.add(walls, 0.3, [0, 0, 2.2], 'Walls', [w / 2 + 0.6, wallH / 2, d / 2])

  const rise = 2
  a.add(gableRoof(w, d, rise, m.roofSheet), 0.3 + colH, [0, 2.4, 0], 'Roof', [w / 2 + 1, rise / 2, 0])

  const height = 0.3 + colH + rise
  a.centre(height)
  return {
    parts: a.parts,
    labelAt: a.labelAt,
    explodeDistance: 0.9,
    size: w + 1,
    floorY: -height / 2 - 0.01,
    dispose,
  }
}

// A road cross-section: the layers under the surface, with kerbs and drains at the edges
function buildRoad(group: THREE.Group): Built {
  const { m, dispose } = palette()
  const a = new Assembly(group)
  const L = 10
  const right = 5.6
  const layers: [string, number, number, THREE.Material][] = [
    ['Subgrade', 0.8, 8, m.soil],
    ['Sub-base', 0.4, 7, m.gravel],
    ['Base course', 0.3, 6.4, m.base],
    ['Surface', 0.12, 6, m.asphalt],
  ]
  let y = 0
  layers.forEach(([label, h, width, material], i) => {
    a.add(box(L, h, width, material, 0, h / 2, 0), y, [0, i, 0], label, [right, h / 2, 0])
    y += h
  })
  // kerbs on both edges, with a drain channel beside each
  const edges = new THREE.Group()
  for (const side of [-1, 1]) {
    edges.add(box(L, 0.4, 0.2, m.concrete, 0, y - 0.1, side * 3.1))
    edges.add(box(L, 0.35, 0.5, m.concrete, 0, y - 0.3, side * 3.55))
    edges.add(box(L, 0.2, 0.3, m.drain, 0, y - 0.24, side * 3.55))
  }
  a.add(edges, 0, [0, layers.length, 0], 'Kerbs & drains', [right, y, 3.3])
  // a little lane marking on the surface
  const marks = new THREE.Group()
  for (let i = 0; i < 4; i++) marks.add(box(1.2, 0.02, 0.15, m.trim, -L / 2 + 1.2 + i * 2.5, y + 0.01, 0))
  a.add(marks, 0, [0, layers.length - 1, 0])

  a.centre(y + 0.3)
  return {
    parts: a.parts,
    labelAt: a.labelAt,
    explodeDistance: 0.7,
    size: L + 1,
    floorY: -(y + 0.3) / 2 - 0.01,
    dispose,
  }
}

// A pallet of H6 blocks: four layers of eighteen, lifted apart layer by layer
function buildPallet(group: THREE.Group): Built {
  const { m, dispose } = palette()
  const a = new Assembly(group)
  const pallet = new THREE.Group()
  for (let i = 0; i < 7; i++) pallet.add(box(0.12, 0.03, 1.0, m.wood, -0.6 + 0.2 * i, 0.135, 0))
  for (const z of [-0.42, 0, 0.42]) pallet.add(box(1.3, 0.1, 0.1, m.wood, 0, 0.07, z))
  a.add(pallet, 0, [0, 0, 0], 'Pallet', [0.9, 0.1, 0])

  // one hollow block, 400 × 200 high × 150, cores open on top
  const shape = new THREE.Shape()
  shape.moveTo(-0.2, -0.075)
  shape.lineTo(0.2, -0.075)
  shape.lineTo(0.2, 0.075)
  shape.lineTo(-0.2, 0.075)
  shape.closePath()
  for (const cx of [-0.095, 0.095]) {
    const hole = new THREE.Path()
    hole.moveTo(cx - 0.07, -0.04)
    hole.lineTo(cx + 0.07, -0.04)
    hole.lineTo(cx + 0.07, 0.04)
    hole.lineTo(cx - 0.07, 0.04)
    hole.closePath()
    shape.holes.push(hole)
  }
  const blockGeometry = keep(new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false }))
  blockGeometry.rotateX(-Math.PI / 2)
  blockGeometry.scale(0.985, 1, 0.97)

  let y = 0.15
  for (let layer = 0; layer < 4; layer++) {
    const course = new THREE.Group()
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 6; j++) {
        const block = new THREE.Mesh(blockGeometry, m.block)
        block.position.set(-0.4 + i * 0.4, 0, -0.375 + j * 0.15)
        block.castShadow = block.receiveShadow = true
        course.add(block)
      }
    }
    a.add(course, y, [0, layer + 1, 0], layer === 3 ? 'H6 blocks' : undefined, [0.8, 0.1, 0])
    y += 0.2
  }

  a.centre(y)
  return {
    parts: a.parts,
    labelAt: a.labelAt,
    explodeDistance: 0.12,
    size: 1.8,
    floorY: -y / 2 - 0.01,
    dispose,
  }
}

/* ---------- the two products ---------- */

// H6 hollow block, 400 × 150 × 200 mm: cores open on top, closed underneath (units: mm / 100)
function buildHollowBlock(group: THREE.Group): Built {
  const texture = concreteTexture('#a3a39e')
  const material = new THREE.MeshStandardMaterial({ map: texture, color: 0xd9d9d4, roughness: 0.92 })
  const spec: { size: number[]; at: number[]; dir: [number, number, number]; label?: string }[] = [
    { size: [400, 30, 150], at: [0, -85, 0], dir: [0, -1, 0], label: 'Closed side' },
    { size: [400, 170, 30], at: [0, 15, 60], dir: [0, 0, 1], label: 'Face shell' },
    { size: [400, 170, 30], at: [0, 15, -60], dir: [0, 0, -1] },
    { size: [30, 170, 90], at: [-185, 15, 0], dir: [-1, 0, 0], label: 'End web' },
    { size: [30, 170, 90], at: [185, 15, 0], dir: [1, 0, 0] },
    { size: [30, 170, 90], at: [0, 15, 0], dir: [0, 1.3, 0], label: 'Centre web' },
  ]
  const labelAt: Record<string, number> = {}
  const parts: Part[] = spec.map((part, index) => {
    const [w, h, d] = part.size.map((v) => v / 100)
    const mesh = new THREE.Mesh(keep(new THREE.BoxGeometry(w, h, d)), material)
    const home = new THREE.Vector3(...part.at.map((v) => v / 100))
    mesh.position.copy(home)
    mesh.castShadow = mesh.receiveShadow = true
    group.add(mesh)
    if (part.label) labelAt[part.label] = index
    return { object: mesh, home, dir: new THREE.Vector3(...part.dir) }
  })
  // the hollow cores are a point on the model rather than a part
  const cores = new THREE.Object3D()
  cores.position.set(-0.92, 1.0, 0)
  group.add(cores)
  labelAt['Hollow cores'] = parts.length
  parts.push({ object: cores, home: cores.position.clone(), dir: new THREE.Vector3() })
  return {
    parts,
    labelAt,
    explodeDistance: 1.35,
    size: 4.6,
    floorY: -2.1,
    dispose: () => {
      material.dispose()
      texture.dispose()
    },
  }
}

// Interlocking (I-shape) paver, 200 × 160 × 60 mm: wide ends and a narrow waist. Laid in offset rows,
// each wide end sits in the waist of the next row, so rows are 140 mm apart.
function paverShape(): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(-1, -0.8)
  s.lineTo(-0.55, -0.8)
  s.bezierCurveTo(-0.4, -0.8, -0.4, -0.6, -0.25, -0.6)
  s.lineTo(0.25, -0.6)
  s.bezierCurveTo(0.4, -0.6, 0.4, -0.8, 0.55, -0.8)
  s.lineTo(1, -0.8)
  s.lineTo(1, 0.8)
  s.lineTo(0.55, 0.8)
  s.bezierCurveTo(0.4, 0.8, 0.4, 0.6, 0.25, 0.6)
  s.lineTo(-0.25, 0.6)
  s.bezierCurveTo(-0.4, 0.6, -0.4, 0.8, -0.55, 0.8)
  s.lineTo(-1, 0.8)
  s.closePath()
  return s
}

function buildInterlockingPavers(group: THREE.Group): Built {
  const texture = concreteTexture('#a09a92')
  const geometry = keep(
    new THREE.ExtrudeGeometry(paverShape(), { depth: 0.52, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3, curveSegments: 16 }),
  )
  geometry.rotateX(-Math.PI / 2) // the shape becomes the paver's top face
  geometry.translate(0, -0.3, 0)
  geometry.scale(0.955, 1, 0.955) // a visible joint between pavers

  const layout = [
    { z: -1.4, xs: [-3, -1, 1, 3] },
    { z: 0, xs: [-2, 0, 2] },
    { z: 1.4, xs: [-3, -1, 1, 3] },
  ]
  const cells = layout.flatMap((row) => row.xs.map((x) => ({ x, z: row.z })))
  // lay outward from the centre: nearest first
  const order = [...cells].sort((p, q) => Math.hypot(p.x, p.z * 1.3) - Math.hypot(q.x, q.z * 1.3))
  const materials: THREE.MeshStandardMaterial[] = []
  const parts: Part[] = order.map(({ x, z }, i) => {
    // real pavers vary a little from one to the next
    const shade = new THREE.Color(0xd8d3cb).multiplyScalar(0.92 + Math.random() * 0.12)
    const material = new THREE.MeshStandardMaterial({ map: texture, color: shade, roughness: 0.9 })
    materials.push(material)
    const mesh = new THREE.Mesh(geometry, material)
    const home = new THREE.Vector3(x, 0, z)
    mesh.position.copy(home)
    mesh.castShadow = mesh.receiveShadow = true
    group.add(mesh)
    const outward = new THREE.Vector3(x, 0, z).normalize()
    return {
      object: mesh,
      home,
      // each paver drops in from above and a little to the side of where it lands
      dir: new THREE.Vector3(outward.x * 0.5, 1, outward.z * 0.5),
      stagger: i / (order.length - 1),
      materials: [material],
      fixed: i === 0,
    }
  })
  // the callouts point at features of the centre paver (it is laid first, so it is always there)
  return {
    parts,
    labelAt: { 'Wide end': 0, 'Narrow waist': 0, '60 mm thick': 0 },
    labelAnchors: {
      'Wide end': new THREE.Vector3(-0.8, 0.27, 0.5),
      'Narrow waist': new THREE.Vector3(0, 0.27, -0.57),
      '60 mm thick': new THREE.Vector3(0.94, -0.02, 0.6),
    },
    explodeDistance: 2.6,
    size: 8.4,
    floorY: -0.9,
    stagger: true,
    dispose: () => {
      materials.forEach((material) => material.dispose())
      texture.dispose()
    },
  }
}

/* ---------- registry ---------- */

export function buildModel(type: ModelType, group: THREE.Group, variant: Variant = {}): Built {
  switch (type) {
    case 'interlocking-paver':
      return buildInterlockingPavers(group)
    case 'villa':
      return buildBuilding(group, {
        w: 12, d: 9, storeys: 2, roof: 'hip', front: 5, side: 3, arch: true, columns: 4, balconies: true,
        labels: { ground: 'Ground floor', upper: 'First floor', roof: 'Roof' },
      })
    case 'bungalow':
      return buildBuilding(group, { w: 11, d: 8, storeys: 1, roof: 'hip', front: 5, side: 3, labels: { ground: 'Walls', roof: 'Roof' } })
    case 'apartment':
      return buildBuilding(group, {
        w: 13, d: 9, storeys: variant.storeys ?? 4, roof: 'flat', front: 4, side: 2, balconies: true,
        labels: { ground: 'Ground floor', upper: 'Upper floors', roof: 'Roof' },
      })
    case 'office':
      return buildBuilding(group, {
        w: 18, d: 9, storeys: 2, roof: 'flat', front: 7, side: 3, tall: true,
        labels: { ground: 'Ground floor', upper: 'First floor', roof: 'Roof' },
      })
    case 'blueprint':
      return drawingMarks(
        toBlueprint(
          buildBuilding(group, {
            w: 12, d: 9, storeys: 2, roof: 'hip', front: 5, side: 3, arch: true,
            labels: { foundation: 'Site plan', ground: 'Ground floor plan', upper: 'First floor plan', roof: 'Roof plan' },
          }),
        ),
        12,
        9,
      )
    case 'construction':
      return buildFrame(group, 3, true)
    case 'frame':
      return buildFrame(group, 3, false)
    case 'mep':
      return buildMep(group)
    case 'farm':
      return buildFarm(group)
    case 'road':
      return buildRoad(group)
    case 'pallet':
      return buildPallet(group)
    case 'hollow-block':
    default:
      return buildHollowBlock(group)
  }
}
