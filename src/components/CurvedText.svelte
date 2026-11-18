<script lang="ts">
import { onMount } from 'svelte';
import { animate } from 'animejs';
import type { JSAnimation } from 'animejs';
import { eases } from 'animejs';

interface Coords {
  x: number;
  y: number;
}

const text = 'João Pedro';
const textChars = text.split('');

let centerDiv: HTMLDivElement;

function easeValue(t: number, b: number, c: number, d: number) {
  return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
}

let mouse_abs: Coords = { x: 0, y: 0 };
let mouse_active: boolean = false;

function handlePointerMove(ev: PointerEvent) {
  mouse_abs.x = ev.clientX;
  mouse_abs.y = ev.clientY;
  mouse_active = true;
}

function handlePointerDeactivate(ev: PointerEvent) {
  if (!ev.relatedTarget) mouse_active = false;
}
document.addEventListener('pointerout', handlePointerDeactivate);

function getOriginCoords(): Coords | null {
  const r = centerDiv?.parentElement?.getBoundingClientRect();
  if (r === undefined || r === null) {
    return null;
  }
  return {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
  };
}

const DISRUPT_RADIUS = 200;
const DISRUPT_POWER = 40;

/** Calculates a delta vector for disruption based on mouse coords! */
function handleSpanDisruption(span: HTMLSpanElement, origin: Coords): Coords {
  const r = span.getBoundingClientRect();
  const center: Coords = {
    x: r.left + r.width / 2 - origin.x,
    y: r.top + r.height / 2 - origin.y,
  };
  const m: Coords = {
    x: mouse_abs.x - origin.x,
    y: mouse_abs.y - origin.y,
  };
  const dx = center.x - m.x;
  const dy = center.y - m.y;
  const d = Math.hypot(dx, dy);
  const inf = mouse_active ? 1 / (1 + (d / DISRUPT_RADIUS) ** 2) : 0;
  return {
    x: (d > 0.001 ? dx / d : 0) * inf * DISRUPT_POWER,
    y: (d > 0.001 ? dy / d : 0) * inf * DISRUPT_POWER,
  };
}

onMount(() => {
  interface Attrs {
    h: number;
    deg: number;
    div_deg: number;
  }
  const attrs: Attrs = {
    h: -100,
    deg: 360 - 180,
    div_deg: 90,
  };
  const attrs_top: Attrs = {
    h: 100,
    deg: 90 + 180,
    div_deg: 180,
  };
  const spans = centerDiv.querySelectorAll('span');
  function updateAnimation(self: JSAnimation) {
    const origin = getOriginCoords();
    if (centerDiv === null || origin === null) return;

    const div_w = centerDiv.offsetWidth;
    const attrs: Attrs = self.targets.values().next().value as Attrs;
    if (attrs.h >= 0) {
      centerDiv.style.paddingTop = `${attrs.h}px`;
    } else if (attrs.h <= 0) {
      centerDiv.style.paddingBottom = `${-attrs.h}px`;
    }
    for (const span of spans.values()) {
      if (span === null) {
        return;
      }
      const disrupt = handleSpanDisruption(span, origin);
      const w = span.offsetWidth;
      const l = span.offsetLeft;
      const y_delta = easeValue(l, 0, attrs.h, div_w);
      const deg_delta =
        (Math.atan((y_delta - easeValue(w + l, 0, attrs.h, div_w)) / w) *
          attrs.deg) /
        Math.PI;
      const tx = disrupt.x;
      const ty = -y_delta + disrupt.y;
      const ts = Math.abs(disrupt.x) + Math.abs(disrupt.y);
      span.style.transform = `
        translate(${tx}px, ${ty}px)
        skewY(${deg_delta}deg)
        rotateZ(${deg_delta / 20}deg)
        rotateY(${ts * 2}deg)
        scaleX(${Math.max(1, ts / 14) * 100}%)
      `;
      span.style.paddingLeft = `${ts / 10}px`;
    }
  }

  animate(attrs, {
    h: attrs_top.h,
    deg: attrs_top.deg,
    div_deg: attrs_top.div_deg,
    ease: eases.inOutElastic(1.0, 1.5),
    duration: 3000,
    loop: true,
    alternate: true,
    onUpdate: updateAnimation,
  });
});
</script>

<svelte:window on:pointermove={handlePointerMove}  />
<div id="container">
  <div id="center-wrapper">
    <div bind:this={centerDiv} id="center">
      {#each textChars as char}
        <span>{ char }</span>
      {/each}
    </div>
  </div>
</div>

<style>
#container {
  height: 350px;
  perspective: 100%;
  perspective-origin: center;
  position: relative;
}

#center-wrapper {
  white-space: pre;
  display: inline-block;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 3rem;
  font-family: var(--font-serif);
  font-weight: 400;
  font-style: normal;
  transform: translate(-50%, -50%);
}

#center {
  transform-origin: center;
}


#center span {
  position: relative;
  display: inline-block;
  transform-origin: center;
}
</style>
