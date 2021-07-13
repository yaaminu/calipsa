<template>
  <div>
    <p v-if="error">{{ error }}</p>
    <table v-else>
      <thead>
        <th>Date</th>
        <th>Outcome</th>
        <th>Location</th>
      </thead>
      <tbody>
        <tr v-for="alarm in alarms" :key="alarm.timestamp">
          <td>{{ alarm.timestamp }}</td>
          <td>{{ alarm.outcome }}</td>
          <td>{{ alarm.location.name }}</td>
        </tr>
      </tbody>
    </table>
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
      let data = await fetchAlarms();
      this.alarms = data.results;
    } catch (err) {
      console.log(err);
      this.error = err.message;
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
