<template>
  <v-container class="py-0 py-sm-4">
    <v-menu 
      bottom 
      offset-y
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <div  class="split-button">
          <v-btn 
            @click="downloadIcs"
            class="main-btn"
          >Herunterladen</v-btn>
          <v-btn
            v-on="on" 
            class="pa-0 pl-3 actions-btn"
          >
            <v-icon left>mdi-menu-down</v-icon>
          </v-btn>
        </div>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-checkbox v-model="reminder" label="Erinnerung am Tag vorher" />
          </v-list-item>
          <v-list-item v-if="reminder">
            <v-text-field v-model="reminderTime" type="time" label="Uhrzeit der Erinnerung" />
          </v-list-item>
          <v-list-item>
            <v-text-field v-model="dateName" label="Name der Termine" />
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-container>
</template>

<style scoped>
  .main-btn{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .actions-btn{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    min-width: auto !important;
  }
  .split-btn{
    display: inline-block;
  }
</style>

<script>
  import {v4 as UUIDv4} from 'uuid';

  export default {
    name: 'DownloadCalendar',

    props: ['dates'],

    data: () => ({
      reminder: true,
      reminderTime: '17:00',
      dateName: 'Abholung: '
    }),

    methods: {
      downloadIcs() {
        let fileContent = this.icsHeader() + this.icsEvents() + this.icsFooter();
        this.downloadFile('abfuhrtermine.ics', fileContent);
      },

      downloadFile(filename, content) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
      },

      icsEvents() {
        let result = '';

        for (let date of this.dates) {
          let formattedDate = 
            date.dateObject.getFullYear() +
            (date.dateObject.getMonth() + 1).toString().padStart(2, '0') +
            (date.dateObject.getDate()).toString().padStart(2, '0');

          result += [
            'BEGIN:VEVENT',
            'SUMMARY:' + this.dateName + ' ' + date.bins.join(', '),
            'UID:' + UUIDv4(),
            'DTSTART;VALUE=DATE:' + formattedDate
          ].join('\n') + '\n';

          if (this.reminder && this.reminderTime) {
            let reminderTimeHour = this.reminderTime.split(':')[0];
            let reminderTimeMinute = this.reminderTime.split(':')[1];

            let reminderMinutesBefore = (24 - reminderTimeHour) * 60 - reminderTimeMinute;

            result += [
              'BEGIN:VALARM',
              'TRIGGER:-PT' + reminderMinutesBefore + 'M',
              'ACTION:DISPLAY',
              'DESCRIPTION:Reminder',
              'END:VALARM',
            ].join('\n') + '\n';
          }

          result += 'END:VEVENT\n';
        }
        return result;
      },

      icsHeader() {
        return [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:https://abfuhrtermine.lucash.de',
          'METHOD:PUBLISH'
        ].join('\n') + '\n';
      },

      icsFooter() {
        return 'END:VCALENDAR\n';
      }
    }
  }
</script>

