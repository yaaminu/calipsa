<template>
  <div>
    <p v-if="error">{{ error }}</p>
    <p v-else>{{ JSON.stringify(alarms) }}</p>
  </div>
</template>

<script>
import { fetchAlarms } from "./lib/datasource";

export default {
  data() {
    return { alarms: [], error: null };
  },
  async mounted() {
    try {
      this.alarms = await fetchAlarms();
    } catch (err) {
      console.log(err)
      this.error = err.message
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
