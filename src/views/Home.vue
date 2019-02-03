<template>
  <div class="home">
    <v-navigation-drawer
      stateless
      value="true"
      app
      v-model="drawer"
      light
    >

      <v-list>

        <v-list-tile
          avatar
          class="mt-2"
        >
          <v-list-tile-avatar>
            <img
              :src="user.profilePictureUser"
              alt="profile picture"
              style="object-fit:cover;"
            >
            <!-- <img src="https://randomuser.me/api/portraits/men/85.jpg"> -->
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{user.emailUser}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="goDashboard">
          <v-list-tile-action>
            <v-icon :class="menu.dashboard">dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="menu.dashboard">Dashboard</v-list-tile-title>
        </v-list-tile>

        <v-list-group
          prepend-icon="list"
          no-action
          :value="grupMenu"
        >

          <v-list-tile slot="activator">
            <v-list-tile-title>List</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="goTodo">
            <v-list-tile-action>
              <v-icon :class="menu.todo">queue</v-icon>
            </v-list-tile-action>
            <v-list-tile-title :class="menu.todo">To Do</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="goDoing">
            <v-list-tile-action>
              <v-icon :class="menu.doing">autorenew</v-icon>
            </v-list-tile-action>
            <v-list-tile-title :class="menu.doing">Doing</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="goDone">
            <v-list-tile-action>
              <v-icon :class="menu.done">check_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-title :class="menu.done">Done</v-list-tile-title>
          </v-list-tile>

        </v-list-group>

        <v-list-tile @click="goAccount">
          <v-list-tile-action>
            <v-icon :class="menu.account">person</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="menu.account">Account</v-list-tile-title>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="indigo"
      dark
      fixed
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>To Do Apps</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        @click="logout"
      >
        Logout
      </v-btn>
    </v-toolbar>
    <v-content>
      <!-- <v-container
        fluid
        fill-height
      >
        <v-layout
          justify-center
          align-center
        > -->
      <router-view />
      <!-- </v-layout>
      </v-container> -->
      <!-- <Todo/> -->
    </v-content>
  </div>
</template>

<script>
import Todo from "../components/Todo";
import { db, auth, storage } from "../firebase/firebaseInit";

export default {
  data: () => ({
    menu: [
      { dashboard: "" },
      { todo: "" },
      { doing: "" },
      { done: "" },
      { account: "" }
    ],
    drawer: true,
    todo: ["todo1", "todo2"],
    grupMenu: false,
    user: {
      type: Object,
      default: null
    }
  }),
  props: {},
  components: {
    Todo
  },
  created() {
    this.getUser();

    if (this.$router.currentRoute.name == "dashboard") {
      this.goDashboard();
    } else if (this.$router.currentRoute.name == "todo") {
      this.goTodo();
    } else if (this.$router.currentRoute.name == "doing") {
      this.goDoing();
    } else if (this.$router.currentRoute.name == "done") {
      this.goDone();
    } else if (this.$router.currentRoute.name == "account") {
      this.goAccount();
    }
  },
  methods: {
    getUser() {
      db.collection("users")
        .where("idUser", "==", auth.currentUser.uid)
        .get()
        .then(dataUser => {
          dataUser.forEach(element => {
            this.user = element.data();
            if (this.user.profilePictureUser != null) {
              var imgRef = storage.ref(
                `displayPicture/${this.user.profilePictureUser}`
              );
              imgRef.getDownloadURL().then(url => {
                this.user.profilePictureUser = url;
              });
            } else {
              this.user.profilePictureUser =
                "https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg";
            }
          });
        });
    },
    goDashboard() {
      this.grupMenu = false;
      this.$router.push({ path: "/dashboard" });
      this.menu.todo = "black--text";
      this.menu.doing = "black--text";
      this.menu.done = "black--text";
      this.menu.account = "black--text";
      this.menu.dashboard = "primary--text";
    },
    goTodo() {
      this.grupMenu = true;
      this.$router.push({ path: "/todo" });
      this.menu.todo = "primary--text";
      this.menu.doing = "black--text";
      this.menu.done = "black--text";
      this.menu.account = "black--text";
      this.menu.dashboard = "black--text";
    },
    goDoing() {
      this.grupMenu = true;
      this.$router.push({ path: "/doing" });
      this.menu.todo = "black--text";
      this.menu.doing = "primary--text";
      this.menu.done = "black--text";
      this.menu.account = "black--text";
      this.menu.dashboard = "black--text";
    },
    goDone() {
      this.grupMenu = true;
      this.$router.push({ path: "/done" });
      this.menu.todo = "black--text";
      this.menu.doing = "black--text";
      this.menu.done = "primary--text";
      this.menu.account = "black--text";
      this.menu.dashboard = "black--text";
    },
    goAccount() {
      this.grupMenu = false;
      this.$router.push({ path: "/account" });
      this.menu.todo = "black--text";
      this.menu.doing = "black--text";
      this.menu.done = "black--text";
      this.menu.account = "primary--text";
      this.menu.dashboard = "black--text";
    },
    logout() {
      auth.signOut().then(() => {
        alert("Logout Berhasil !");
        this.$router.push({ path: "/login" });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>