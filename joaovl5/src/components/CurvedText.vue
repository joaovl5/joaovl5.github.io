<template>
  <div class="container">
    <div ref="target" class="center">
      <span
        v-for="(char, index) in textArray"
        :key="index"
        class="title-char"
        >{{ char }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import anime from "animejs/lib/anime.es.js";

const props = defineProps({ text: String });
const text = props.text;
const textArray = computed(() => text.split(""));

function easeInOutSine(t, b, c, d) {
  return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
}

const target = ref(null);

onMounted(() => {
  const el = target.value;
  // Get the total width of the text container
  const width = el.offsetWidth;

  const attrs = {
    height: 50,
    angle_factor: 90,
  };

  // Query all spans (each character)
  const spans = el.querySelectorAll("span");
  function updateAnimation() {
    spans.forEach((span) => {
      const w = span.offsetWidth;
      const l = span.offsetLeft;
      // Calculate offset and skew based on easing function
      const offset = easeInOutSine(l, 0, attrs.height, width);
      const offset2 = easeInOutSine(w + l, 0, attrs.height, width);
      const skew = offset - offset2;
      const angle = (Math.atan(skew / w) * attrs.angle_factor) / Math.PI;
      // Invert the offset as in the original
      span.style.transform = `translateY(${-offset}px) skewY(${angle}deg)`;
    });
    // Add top padding to adjust vertical positioning
    el.style.paddingTop = `${attrs.height}px`;
  }

  anime({
    targets: attrs,
    height: 140,
    angle_factor: 180,
    direction: "alternate",
    easing: "easeInOutSine",
    duration: 3000,
    loop: true,
    update: updateAnimation,
  });
});
</script>

<style scoped>
.container {
  height: auto;
  position: relative;
}

/* This style is similar to the original #target styling */
.center {
  white-space: pre;
  display: inline-block;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 30px;
  transform: translate(-50%, -50%);
}

/* Each character span inherits its transformation origin and basic styling */
.center span {
  position: relative;
  display: inline-block;
  transform-origin: left;
}

@keyframes textShadowMove {
  0% {
    text-shadow: -1px 1px 0px rgba(255, 255, 255, 0.9);
  }
  50% {
    text-shadow: 1px -1px 0px rgba(255, 255, 255, 0.9);
  }
  100% {
    text-shadow: -1px 1px 0px rgba(255, 255, 255, 0.9);
  }
}

.title-char {
  animation: textShadowMove 5000ms infinite ease-in-out;
}
</style>
