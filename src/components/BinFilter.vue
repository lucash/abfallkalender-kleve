<template>
  <v-menu
    bottom 
    offset-y
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn class="mx-4" v-on="on">
        <v-icon>mdi-filter</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-item v-for="bin of allBins" :key="bin">
          <v-checkbox
            v-model="binFilter"
            :label="bin"
            :value="bin"
            dense
          >
          </v-checkbox>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
  export default {
    name: 'BinFilter',

    prop: ['value'],

    watch: {
      binFilter(newBinFilter) {
        window.localStorage.setItem('abfuhrtermine-kleve-bin-filter', JSON.stringify(newBinFilter));
        this.$emit('input', newBinFilter);
      },
      value(newValue) {
        this.binFilter = newValue;
      }
    },

    mounted () {
      let binFilterFromLocalStorage = window.localStorage.getItem('abfuhrtermine-kleve-bin-filter');
      this.binFilter = binFilterFromLocalStorage ? JSON.parse(binFilterFromLocalStorage) : this.allBins;
    },

    data: () => ({
      binFilter: [],
      allBins: [
        'Altglas',
        'Braune Tonne',
        'Gelbe Tonne',
        'Graue Tonne',
        'Grüne Tonne',
        'Wertstoffe',
      ]
    })
  };
</script>
