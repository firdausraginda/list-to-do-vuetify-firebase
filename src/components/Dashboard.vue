<template>
  <div class="dashboard">
    <v-container grid-list-md>
      <v-layout
        wrap
        justify-center
        align-center
      >
        <v-flex md4>
          <v-card
            color="orange darken-2"
            class="white--text px-2 elevation-5"
          >
            <v-card-title>
              <div>
                <div class="headline">{{jmlTask.todo}}</div>
                <span>To Do</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card
            color="brown darken-2"
            class="white--text px-2 elevation-5"
          >
            <v-card-title>
              <div>
                <div class="headline">{{jmlTask.doing}}</div>
                <span>Doing</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card
            color="green darken-2"
            class="white--text px-2 elevation-5"
          >
            <v-card-title>
              <div>
                <div class="headline">{{jmlTask.done}}</div>
                <span>Done</span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex md4>
          {{userEmail}}
          <v-btn @click="showData">
            click me
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { db, auth } from "../firebase/firebaseInit";

export default {
  data: () => ({
    userEmail: "",
    jmlTask: {
      todo: 0,
      doing: 0,
      done: 0
    }
  }),
  created() {
    this.getUser();
    this.getJumlahData();
  },
  methods: {
    getUser() {
      this.userEmail = auth.currentUser.email;
    },
    showData() {
      db.collection("tasks")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(element => {
            console.log(element.data());
          });
        });
    },
    getJumlahData() {
      db.collection("tasks")
        .where("idUser", "==", auth.currentUser.uid)
        .get()
        .then(dataTask => {
          dataTask.forEach(element => {
            if (element.data().statusTask == 1) {
              this.jmlTask.todo++;
            } else if (element.data().statusTask == 2) {
              this.jmlTask.doing++;
            } else {
              this.jmlTask.done++;
            }
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>