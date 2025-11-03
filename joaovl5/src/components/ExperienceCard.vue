<template>
  <div class="exp-card-box">
    <div class="title-date-box">
      <p class="exp-title">{{ props.title }}</p>
      <p class="exp-date">{{ props.date_range }}</p>
    </div>
    <p class="exp-company">{{ props.company }}</p>
    <ul>
      <li v-for="point in points" :key="point">{{ point }}</li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  company: String,
  date_range: String,
  points: Array,
});
</script>

<style scoped>
.exp-card-box {
  font-size: 0.7rem;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
}

.title-date-box {
  display: flex;
  justify-content: space-between;
  gap: 6px;
}

.exp-title {
  font-size: 0.8rem;
  font-weight: bold;
}

.exp-date {
  font-size: 0.7rem;
}

ul li {
  margin: 4px 10px;
}
</style>
