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
      <v-container>
        <v-row class="text-center">
          <v-col cols="12" :sm="6" :md="8" class="pb-0">
            <v-autocomplete
              :items="streets" 
              label="Straße wählen"
              v-model="selectedStreet"
              @change="selectedStreetChanged"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" :sm="6" :md="4" class="pb-0 pt-0 pt-sm-4">
            <DownloadCalendar :dates="dates" />
          </v-col>
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
            <Calendar :events="calendarDates" />
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

export default {
  name: 'App',

  components: {
    Calendar,
    DownloadCalendar,
    Footer
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
        let bins = regionDates[region][date];
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
    calendarDates: function () {
      let calendarDates = [];
      for (let date of this.dates) {
        for (let bin of date.bins) {

          calendarDates.push({
            name: bin,
            start: date.dateObject,
            end: date.dateObject,
            timed: false,
            color: this.getColorByBin(bin),
            textColor: this.getTextColorByBin(bin)
          });
        }
      }
      return calendarDates;
    }
  },

  data: () => ({
    selectedStreet: window.localStorage.getItem('abfuhrtermine-kleve-selected-street') || undefined,
  }),

  methods: {
    selectedStreetChanged: function() {
      window.localStorage.setItem('abfuhrtermine-kleve-selected-street', this.selectedStreet);
    },

    getColorByBin: function(bin) {
          if (bin === 'Wertstoffe') {
            return 'pink';
          } else if (bin === 'Graue Tonne') {
            return 'black';
          } else if (bin === 'Grüne Tonne') {
            return 'green';
          } else if (bin === 'Braune Tonne') {
            return 'brown';
          } else if (bin === 'Gelbe Tonne') {
            return 'yellow';
          } else if (bin === 'Altglas') {
            return 'blue';
          }

          return 'orange';
    },

    getTextColorByBin: function(bin) {
          if (bin === 'Gelbe Tonne') {
            return 'black';
          }

          return 'white';
    }
  }
};
</script>
