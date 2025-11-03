<template>
  <div class="project-page-wrapper">
    <p class="page-title">projects</p>
    <div class="project-list">
      <div v-for="project in data" :key="project.name">
        <a
          class="project-title"
          v-tooltip="project.description"
          target="_blank"
          :href="project.url"
        >
          {{ project.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { vTooltip } from "floating-vue";

const data = [
  {
    name: "remember",
    description:
      "app leveraging RAG techniques to improve knowledge-base and computer history lookup",
    tags: ["python", "llms", "vue", "rag", "javascript"],
    url: "https://github.com/joaovl5/remember",
  },
  {
    name: "viewfinder",
    description:
      "computer-vision platform leveraging object detection and face recognition",
    tags: ["python", "opencv", "yolo", "elasticsearch"],
    url: "https://github.com/joaovl5/viewfinder",
  },
  {
    name: "haunt",
    description: "w.i.p. framework for building desktop apps in python",
    tags: ["python", "pywebview", "javascript"],
    url: "https://github.com/joaovl5/haunt",
  },
  {
    name: "simulacra",
    description: "n-body physics simulation written in rust",
    tags: ["rust", "raylib", "physics"],
    url: "https://github.com/joaovl5/simulacra",
  },
  {
    name: "brainfuck",
    description: "interpreter for the brainfuck esoteric programming language",
    tags: ["rust"],
    url: "https://github.com/joaovl5/brainfuck",
  },
  {
    name: "normal",
    description:
      "novel authentication system for minecraft servers, along with integrated launchers and discord connections",
    tags: ["python", "vue", "kotlin", "javascript", "java", "mongodb"],
    url: "https://github.com/joaovl5/the-normal-project",
  },
  {
    name: "secret",
    description:
      "an experimental simulation on how information can spread in a social network",
    tags: ["python", "networkx", "p5"],
    url: "https://github.com/joaovl5/secret",
  },
  {
    name: "prototext",
    description: "simple textboard with pseudonimity features",
    tags: ["node.js", "javascript", "pug", "mongodb"],
    url: "https://github.com/joaovl5/prototext",
  },
];
</script>

<style>
.v-popper__wrapper {
  background-color: black;
}

.v-popper__inner {
  font-size: 0.8rem;
}

.project-page-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.project-page-wrapper .page-title {
  font-family: "DM Serif Text", serif;
  font-weight: bold;
  margin: 16px;
}

.project-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 16px;
}

.project-title {
  font-size: 0.9rem;
  text-decoration: underline;
  text-decoration-style: dotted;
}

.project-title:hover {
  text-decoration-style: solid;
}

.hover-tooltip {
  text-align: center;
  font-family: "DM Serif Text", serif;
  margin: 16px;
}
</style>
