<template>
  <v-footer color="primary" padless fixed>
    <v-row justify="center" no-gutters>
      <v-btn
        text
        color="white"
        rounded
        @click="imprint = true"
      >
        Impressum
      </v-btn>
      <v-btn
        text
        color="white"
        rounded
        target="_blank"
        href="https://github.com/lucash/abfallkalender-kleve"
      >
        <v-icon>
          mdi-github
        </v-icon>
        Github
      </v-btn>
    </v-row>

    <v-dialog v-model="imprint" width="unset">
      <v-card>
        <v-card-title>
          Impressum
          <v-spacer></v-spacer>
          <v-btn icon @click="imprint = false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          Lucas Heuvelmann<br />
          Delfter Straße 11<br />
          47533 Kleve<br />
          <a href="mailto:info@abfuhrtermine.lucash.de">info@abfuhrtermine.lucash.de</a>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-footer>
</template>

<script>
  export default {
    name: 'Footer',

    data: () => ({
      imprint: false
    })
  };
</script>
