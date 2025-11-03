<template>
  <div>
    <p>languages</p>
    <ul>
      <li>python</li>
      <li>javacript</li>
      <li>typescript</li>
      <li>rust</li>
      <li>c#</li>
      <li>php</li>
    </ul>
  </div>
  <div>
    <p>frameworks/libraries</p>
    <ul>
      <li>vue</li>
      <li>react</li>
      <li>django</li>
      <li>fastapi</li>
      <li>sqlalchemy</li>
      <li>laravel</li>
      <li>opencv</li>

      <li>pytorch</li>
    </ul>
  </div>
  <div>
    <p>databases/tools</p>
    <ul>
      <li>postgresql</li>
      <li>mongodb</li>
      <li>elasticsearch</li>
      <li>docker</li>
      <li>node.js</li>
      <li>bash</li>
      <li>aws</li>
      <li>ai</li>
    </ul>
  </div>
</template>

<style scoped>
div {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 12px;
}

div p {
  text-align: center;
  font-family: "DM Serif Text", serif;
  font-weight: bold;
}

ul {
  list-style-type: none;
  display: flex;
  justify-content: center;
  gap: 8px;
  font-size: 0.8rem;
  flex-wrap: wrap;
}

ul li {
  transition: all 0.2s ease;
}
ul li:hover {
  transform: scale(110%);
}

ul:has(li:hover) li:not(:hover) {
  transform: scale(95%);
  opacity: 0.8;
  margin: 0 -2px;
}
</style>
