<template>
  <canvas id="background"></canvas>
</template>

<script setup>
import { CanvasSpace, Pt, Group, Create, Num } from "pts";
import { onMounted } from "vue";

function useCanvas() {
  let space = new CanvasSpace("#background");

  space.setup({
    bgcolor: "#000",
  });

  let form = space.getForm();

  space.add((time) => {
    let grid = Create.gridPts(space.innerBound, 20, 20);
    let addFactor = Num.cycle((time % 4000) / 4000) * 0.5;
    form = form.fill("#fff");
    grid.forEach((pt) => {
      let d = (1 / Math.pow(space.pointer.$subtract(pt).magnitude(), 2)) * 2000;
      d = Math.min(d, 3);
      form.point(pt, addFactor + d, "circle");
    });
  });

  space.bindMouse().bindTouch().play();
}

onMounted(() => {
  useCanvas();
});
</script>
