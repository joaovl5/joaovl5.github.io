<template>
  <div class="exp-wrapper">
    <div class="exp-list">
      <ExperienceCard
        v-for="exp in data"
        :key="exp.id"
        :title="exp.title"
        :company="exp.company"
        :date_range="exp.date_range"
        :points="exp.points"
      />
    </div>
  </div>
</template>

<script setup>
import ExperienceCard from "../components/ExperienceCard.vue";

const data = [
  {
    id: 0,
    title: "Senior Software Engineer",
    company: "Space Inch",
    date_range: "Mar 2025 - Present",
    points: [],
  },
  {
    id: 1,
    title: "Lead Software Engineer",
    company: "Aggressive Solutions",
    date_range: "Sept 2024 - Feb 2025",
    points: [],
  },
  {
    id: 2,
    title: "Software Developer",
    company: "SITELBRA",
    date_range: "Aug 2023 - Mar 2025",
    points: [],
  },
  {
    id: 3,
    title: "Lead Developer Intern",
    company: "Kill That Noise",
    date_range: "Mar 2023 - Jul 2023",
    points: [],
  },
];
</script>

<style scoped>
.exp-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding-right: 10px;
}
</style>
