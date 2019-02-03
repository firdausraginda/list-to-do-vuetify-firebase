<template>
  <div class="about">
    <v-navigation-drawer
      stateless
      value="true"
      app
      v-model="drawer"
    >
      <v-list>

        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Account</v-list-tile-title>
        </v-list-tile>

        <v-list-group prepend-icon="list">

          <v-list-tile slot="activator">
            <v-list-tile-title>Task</v-list-tile-title>
          </v-list-tile>

          <v-list-group
            sub-group
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>Todo</v-list-tile-title>
            </v-list-tile>

            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>motorcycle</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>motorcycle</v-list-tile-title>
            </v-list-tile>

            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>headset</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>headset</v-list-tile-title>
            </v-list-tile>

          </v-list-group>
          <v-list-group
            sub-group
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>Todo</v-list-tile-title>
            </v-list-tile>

            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>motorcycle</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>motorcycle</v-list-tile-title>
            </v-list-tile>

            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>headset</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>headset</v-list-tile-title>
            </v-list-tile>

          </v-list-group>

        </v-list-group>

        <v-list-group prepend-icon="list">

          <v-list-tile slot="activator">
            <v-list-tile-title>Task</v-list-tile-title>
          </v-list-tile>

          <v-list-group
            sub-group
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-title>Todo</v-list-tile-title>
            </v-list-tile>

            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>motorcycle</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>motorcycle</v-list-tile-title>
            </v-list-tile>

            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>headset</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>headset</v-list-tile-title>
            </v-list-tile>

          </v-list-group>

        </v-list-group>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="indigo"
      dark
      fixed
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Application</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          justify-center
          align-center
        >
          <v-flex text-xs-center>
            <v-tooltip left>
              <v-btn
                icon
                large
                target="_blank"
                slot="activator"
              >
                <v-icon large>code</v-icon>
              </v-btn>
              <span>Source</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
    todo: ["todo1", "todo2"]
  }),
  props: {}
};
</script>