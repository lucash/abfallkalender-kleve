<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      Abfuhrtermine {{selectedStreet ? selectedStreet : 'Kleve'}}
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main class="mb-8">
      <v-container class="mt-4">
        <v-row class="d-flex flex-row align-center">
          <v-autocomplete
            :items="streets" 
            label="Straße wählen"
            v-model="selectedStreet"
            @change="selectedStreetChanged"
          >
          </v-autocomplete>
          <BinFilter v-model="binFilter" />
          <DownloadCalendar :dates="dates" />
        </v-row>

        <v-row v-if="nextDate">
          <v-col cols="12">
            <v-alert 
              border="top" 
              colored-border
              type="info"
              elevation="1"
            >
              <strong>Nächste Abholung</strong>:
              {{this.nextDate.dateObject.toLocaleDateString(undefined, {day: '2-digit', month: 'long'})}}, {{this.nextDate.bins.join(', ')}}
            </v-alert>
          </v-col>
        </v-row>

        <v-row class="mt-0">
          <v-col cols="12" class="pt-0">
            <Calendar :dates="dates" />
          </v-col>
        </v-row>
      </v-container>

      <Footer />
    </v-main>
  </v-app>
</template>

<script>
import streetToRegionMap from './data/streetToRegionMap.json';
import regionDates from './data/regionDates.json';
import Calendar from './components/Calendar.vue';
import DownloadCalendar from './components/DownloadCalendar.vue';
import Footer from './components/Footer.vue';
import BinFilter from './components/BinFilter.vue';

export default {
  name: 'App',

  components: {
    Calendar,
    DownloadCalendar,
    Footer,
    BinFilter
  },

  computed: {
    streets: function () {
      return Object.keys(streetToRegionMap);
    },
    nextDate: function() {
      return this.dates[0];
    },
    dates: function () {
      let region = streetToRegionMap[this.selectedStreet];

      if (!region) {
        return [];
      }

      let datesList = [];
      for (let date of Object.keys(regionDates[region])) {
        let bins = regionDates[region][date].filter(bin => this.binFilter ? this.binFilter.includes(bin) : true);

        if (bins.length === 0) {
          continue;
        }

        let dateObject = new Date(date);

        if (dateObject < Date.now()) {
          continue;
        }

        datesList.push({
          date: date,
          dateObject: dateObject,
          bins: bins
        });
      }
      return datesList;
    },
  },

  data: () => ({
    selectedStreet: window.localStorage.getItem('abfuhrtermine-kleve-selected-street') || undefined,
    binFilter: undefined
  }),

  methods: {
    selectedStreetChanged: function() {
      window.localStorage.setItem('abfuhrtermine-kleve-selected-street', this.selectedStreet);
    },

  }
};
</script>
