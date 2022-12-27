<template>
  <v-container class="pt-0">
    <v-sheet height="64">
      <v-toolbar
        flat
      >
        <v-btn
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="setToday"
        >
          Heute
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="prev"
        >
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="next"
        >
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="secondary"
        :events="eventsForCalendar"
        :event-color="getEventColor"
        :event-text-color="getEventTextColor"
        weekdays="1, 2, 3, 4, 5, 6, 0"
      >
      </v-calendar>
    </v-sheet>
  </v-container>
</template>

<script>
  export default {
    name: 'Calendar',

    props: ['dates'],

    data: () => ({
      focus: '',
    }),

    mounted () {
      this.$refs.calendar.checkChange();
      this.focusNextDate();
    },

    watch: {
      dates(newDates, oldDates) {
        if (oldDates && oldDates.length === 0) {
          this.focusNextDate();
        }
      }
    },

    computed: {
      eventsForCalendar: function () {
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

    methods: {
      getEventColor (event) {
        return event.color;
      },

      getEventTextColor (event) {
        return event.textColor;
      },

      setToday () {
        this.focus = '';
      },

      prev () {
        this.$refs.calendar.prev();
      },

      next () {
        this.$refs.calendar.next();
      },

      focusNextDate() {
        if (this.dates && this.dates.length > 0) {
          this.focus = this.dates[0].dateObject;
        }
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
  }
</script>
