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
        :events="events"
        :event-color="getEventColor"
        :event-text-color="getEventTextColor"
      >
      </v-calendar>
    </v-sheet>
  </v-container>
</template>

<script>
  export default {
    name: 'Calendar',

    props: ['events'],

    data: () => ({
      focus: '',
    }),

    mounted () {
      this.$refs.calendar.checkChange();
      this.focus = this.events[0].start;
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
    }
  }
</script>
