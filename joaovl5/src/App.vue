<template>
  <FunkyBackground />
  <div id="main-container">
    <div class="title-container">
      <CurvedText text="joão pedro" />
    </div>
    <div
      v-if="currentSection != null"
      class="close-btn"
      @click="() => (currentSection = null)"
    >
      <i class="nf nf-md-close_outline"></i>
    </div>
    <div class="page-wrapper">
      <transition>
        <div class="links" v-if="currentSection == null">
          <b class="subtitle"> <p>full-stack software engineer</p> </b>
          <ul>
            <li
              v-for="section in sections"
              :key="section.key"
              @click="
                () => {
                  if (section.key != 'contact') currentSection = section.key;
                  else {
                    openContact();
                  }
                }
              "
            >
              {{ section.label }}
            </li>
          </ul>
        </div>
        <div class="page-container" v-else>
          <TechPage v-if="currentSection == 'technologies'" />
          <ProjectsPage v-else-if="currentSection == 'projects'" />
          <ExperiencePage v-else-if="currentSection == 'experience'" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CurvedText from "./components/CurvedText.vue";
import FunkyBackground from "./components/FunkyBackground.vue";
import TechPage from "./pages/TechPage.vue";
import ProjectsPage from "./pages/ProjectsPage.vue";
import ExperiencePage from "./pages/ExperiencePage.vue";

const currentSection = ref(null);

const openContact = () => {
  window.open("https://github.com/joaovl5");
};

const sections = [
  { key: "technologies", label: "technologies" },
  { key: "projects", label: "projects" },
  { key: "experience", label: "experience" },
  { key: "contact", label: "contact" },
];
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.subtitle {
  font-family: "DM Serif Text", serif;
}

.title-container {
  font-family: "DM Serif Text", serif;
  height: 200px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-wrapper {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
}

.page-container {
  width: 100%;
  height: 100%;
}

.links {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  height: 100%;
}

.links ul {
  list-style-type: none;
  font-size: 0.9rem;
  margin: 10px;
}

.links ul li {
  color: whitesmoke;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
}

.links ul li:hover {
  transform: translateX(1%);
}

.v-enter-from {
  opacity: 0;
}
.v-enter-to {
  opacity: 1;
}
.v-enter-active {
  transition: opacity 0.2s ease;
}

.close-btn {
  transition: all 0.1s ease-in-out;
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  z-index: 10;
}
.close-btn:hover {
  transform: translateY(-5%);
}
</style>
