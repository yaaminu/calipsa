<template>
  <div>
    <p v-if="loadingState.error">{{ loadingState.error }}</p>
    <p v-else-if="loadingState.isLoading">Loading Alarms...</p>
    <div v-else>
      <table>
        <thead>
          <th>Date</th>
          <th>Outcome</th>
          <th>Location</th>
        </thead>
        <tbody>
          <tr v-for="alarm in alarms" :key="alarm.timestamp">
            <td>
              <a href="#" @click="showAlarmDetails(alarm)">{{ alarm.timestamp }}</a>
            </td>
            <td>{{ alarm.outcome }}</td>
            <td>{{ alarm.location.name }}</td>
          </tr>
        </tbody>
      </table>
      <div id="paginator">
        <button
          id="previous"
          @click="previousPage()"
          :disabled="this.pageInfo.page == 1"
        >
          Previous
        </button>
        <span>{{ pageInfo.page }}</span>
        <button
          id="next"
          @click="nextPage()"
          :disabled="this.pageInfo.page === last_page"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAlarms } from "./lib/datasource";
import { sleep } from "./lib/utils";

export default {
  data() {
    return {
      alarms: [],
      pageInfo: {
        page: 1,
        total_count: 0,
        page_size: 10,
      },
      loadingState: {
        error: null,
        isLoading: false,
      },
    };
  },
  async mounted() {
    this.load_alarms();
  },
  computed: {
    last_page() {
      return (
        Math.floor(this.pageInfo.total_count / this.pageInfo.page_size) +
        (this.pageInfo.total_count % this.pageInfo.page_size)
      );
    },
  },
  methods: {
    nextPage() {
      this.pageInfo.page++;
      this.load_alarms();
    },

    previousPage() {
      this.pageInfo.page--;
      this.load_alarms();
    },

    showAlarmDetails(alarm) {
      //should be a separte page on its own
      alert(JSON.stringify(alarm));
    },

    async load_alarms() {
      try {
        this.loadingState.error = null; // clear error state
        this.loadingState.isLoading = true;
        let data = await fetchAlarms(this.pageInfo);
        await sleep(0.5); //fake sleep to make progress visible
        this.alarms = data.results;
        this.pageInfo.total_count = data.count;
      } catch (err) {
        console.log(err);
        this.loadingState.error = err.message;
      } finally {
        this.loadingState.isLoading = false;
      }
    },
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

#paginator span {
  margin: 10px;
}
</style>
