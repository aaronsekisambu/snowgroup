import type { ModelType } from '@/types/content'
import type { Framing, ModelControls } from '@/components/ProductModel'

const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(Math.max(t, 0), 1)

const SHOW_HOLLOW = 0.42 // block tilted so the open cores face the viewer
const SHOW_CLOSED = Math.PI - 0.42 // turned over: the closed side faces the viewer
const PAVER_TILT = 0.55 // pavers seen from above at an angle
const BUILDING_TILT = 0.12 // buildings seen from just above eye level

export type Motion = {
  hero: ModelControls
  story: ModelControls
  viewer: ModelControls
  play: (c: ModelControls, p: number) => void // the pinned story, p from 0 to 1
  views: { label: string; controls: Partial<ModelControls> }[]
  framing?: Framing // room for callouts in the story and the closer look
}

const pose = (rotateX: number, extra: Partial<ModelControls> = {}): ModelControls => ({
  explode: 0,
  rotateX,
  rotateY: -0.6,
  autoRotate: false,
  showLabels: false,
  ...extra,
})

// How each model starts, what the scroll story does, and the views offered in "Take a closer look"
export function motionFor(model: ModelType): Motion {
  if (model === 'hollow-block') {
    return {
      hero: pose(SHOW_HOLLOW, { autoRotate: true }),
      story: pose(SHOW_CLOSED, { rotateY: -0.5, showLabels: true }),
      viewer: pose(SHOW_HOLLOW),
      // closed side → turns over to the hollow side → pulls apart into its parts
      play: (c, p) => {
        c.rotateY = -0.5 + p * 0.9
        c.rotateX = lerp(SHOW_CLOSED, SHOW_HOLLOW, (p - 0.26) / 0.22)
        c.explode = lerp(0, 1, (p - 0.52) / 0.3)
      },
      framing: { zoom: 1.12 },
      views: [
        { label: 'Hollow side', controls: { rotateX: SHOW_HOLLOW, explode: 0 } },
        { label: 'Closed side', controls: { rotateX: SHOW_CLOSED, explode: 0 } },
        { label: 'Parts', controls: { rotateX: SHOW_HOLLOW, explode: 1, showLabels: true } },
      ],
    }
  }
  if (model === 'interlocking-paver') {
    return {
      hero: pose(PAVER_TILT, { autoRotate: true, rotateY: -0.5 }),
      // the callouts describe the single paver, so they show while it is on its own
      story: pose(PAVER_TILT, { explode: 1, rotateY: -0.4, showLabels: true }),
      viewer: pose(PAVER_TILT, { rotateY: -0.5, showLabels: true }),
      // one paver → the rest are laid around it, nearest first → a finished, locked surface
      play: (c, p) => {
        c.rotateY = -0.4 + p * 0.7
        c.explode = lerp(1, 0, (p - 0.22) / 0.6)
      },
      framing: { zoom: 1.15 },
      views: [
        { label: 'Laid surface', controls: { explode: 0 } },
        { label: 'One paver', controls: { explode: 1 } },
      ],
    }
  }
  // buildings, frames, roads and pallets: turn a little, then lift apart layer by layer
  return {
    hero: pose(BUILDING_TILT, { autoRotate: true, rotateY: -0.7 }),
    story: pose(BUILDING_TILT, { rotateY: -0.8, showLabels: true }),
    viewer: pose(BUILDING_TILT, { rotateY: -0.7, showLabels: true }),
    play: (c, p) => {
      c.rotateY = -0.8 + p * 1.1
      c.explode = lerp(0, 1, (p - 0.3) / 0.45)
    },
    // callouts for buildings sit on the right, so the model moves left to make room
    framing: { zoom: 1.3, shift: 0.1 },
    views: [
      { label: 'Assembled', controls: { explode: 0 } },
      { label: 'Exploded', controls: { explode: 1 } },
    ],
  }
}
