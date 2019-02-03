<template>
  <div class="doing">
    <v-container
      fluid
      fill-height
    >
      <v-layout
        justify-center
        align-center
      >
        <v-flex
          x12
          md6
        >
          <v-toolbar
            color="white"
            light
          >
            <v-icon
              medium
              color="brown"
            >update</v-icon>
            <v-toolbar-title class="text-xs-center brown--text">Doing List</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog
              v-model="taskModal"
              persistent
              max-width="600px"
            >
              <v-btn
                fab
                color="red"
                small
                slot="activator"
                @click="statusDialog = 'add'"
              >
                <v-icon color="white">add</v-icon>
              </v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">Add Task</span>
                </v-card-title>
                <v-card-text>
                  <v-form ref="formDoing">
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-text-field
                            v-if="this.statusDialog == 'add'"
                            v-model="namaTask"
                            label="Nama Task"
                            :rules="[v => !!v || 'nama task harus diisi']"
                          ></v-text-field>
                          <v-text-field
                            v-if="this.statusDialog == 'edit'"
                            disabled
                            box
                            v-model="namaTask"
                            label="Nama Task"
                            :rules="[v => !!v || 'nama task harus diisi']"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field
                            v-model="deskripsiTask"
                            label="Deskripsi Task"
                            :rules="[v => !!v || 'deskripsi task harus diisi']"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-menu
                            :close-on-content-click="false"
                            v-model="deadlineModal"
                            :nudge-right="40"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                          >
                            <v-text-field
                              slot="activator"
                              v-model="deadlineTask"
                              label="Deadline Task"
                              :rules="[v => !!v || 'deadline task harus diisi']"
                              prepend-icon="event"
                              readonly
                            ></v-text-field>
                            <v-date-picker
                              v-model="deadlineTask"
                              @input="deadlineModal = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="blue darken-1"
                    flat
                    @click="closeTaskModal"
                  >Batal</v-btn>
                  <v-btn
                    v-if="this.statusDialog == 'add'"
                    color="blue darken-1"
                    flat
                    @click="saveAddTaskDoing"
                  >Tambah Task</v-btn>
                  <v-btn
                    v-if="this.statusDialog == 'edit'"
                    color="blue darken-1"
                    flat
                    @click="saveEditTaskDoing"
                  >Edit Task</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-card-text class="pb-0">
            <v-text-field
              class="pb-0"
              v-model="searchKeyWord"
              append-icon="search"
              label="cari nama task"
            ></v-text-field>
            <v-card-actions>
              <v-btn
                outline
                xs6
                small
                :color="activeSortNama"
                @click="sortByNamaTask"
              >
                sort nama task
              </v-btn>
              <v-btn
                outline
                xs6
                small
                :color="activeSortDeadline"
                @click="sortByDeadlineTask"
              >
                sort deadline task
              </v-btn>
            </v-card-actions>
          </v-card-text>
          <v-card-text
            v-if="filteredTasks.length == 0"
            class="text-xs-center red--text mt-3"
          >
            <v-icon
              large
              color="red"
            >delete_outline</v-icon>
            <br>
            list kosong
          </v-card-text>
          <v-expansion-panel
            popout
            class="mt-2"
          >
            <v-expansion-panel-content
              v-for="(dataTask, i) in filteredTasks"
              :key="dataTask.namaTask"
            >
              <div
                slot="header"
                class="subheading font-weight-medium"
              >{{i+1}} - {{dataTask.namaTask}}
                <br>
                <span class="body-1">{{dataTask.deadlineTask}}</span>
              </div>

              <v-card>
                <v-card-text>
                  {{dataTask.deskripsiTask}}
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    flat
                    @click="editTaskDoing(dataTask.namaTask)"
                  >
                    Edit</v-btn>
                  <v-btn
                    flat
                    color="success"
                    @click="moveToDone(dataTask.namaTask)"
                  >Done</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    color="red"
                    @click="deleteTask(dataTask.namaTask)"
                  >Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { db, auth } from "../firebase/firebaseInit";
export default {
  data: () => ({
    dataTasks: [],
    taskModal: false,
    namaTask: null,
    deskripsiTask: null,
    deadlineTask: null,
    deadlineModal: false,
    statusDialog: "add",
    searchKeyWord: "",
    activeSortNama: "",
    activeSortDeadline: ""
  }),
  created() {
    this.getTasks();
  },
  computed: {
    filteredTasks() {
      return this.dataTasks.filter(datatask => {
        return datatask.namaTask
          .toLowerCase()
          .match(this.searchKeyWord.toLowerCase());
      });
    }
  },
  methods: {
    sortByNamaTask() {
      this.activeSortNama = "red";
      this.activeSortDeadline = "black";
      this.dataTasks.sort(
        (a, b) => (a["namaTask"] < b["namaTask"] ? -1 : 1)
        // a dan b berarti mengambil tiap 2 data utk di bandingkan
        // -1 berarti urutan tidak di ubah
        // 1 berarti urutan di ubah
      );
    },
    sortByDeadlineTask() {
      this.activeSortDeadline = "red";
      this.activeSortNama = "black";
      this.dataTasks.sort(
        (a, b) => (a["deadlineTask"] < b["deadlineTask"] ? -1 : 1)
        // a dan b berarti mengambil tiap 2 data utk di bandingkan
        // -1 berarti urutan tidak di ubah
        // 1 berarti urutan di ubah
      );
    },
    getTasks() {
      db.collection("tasks")
        .where("idUser", "==", auth.currentUser.uid)
        .where("statusTask", "==", 2)
        .get()
        .then(dataTasks => {
          dataTasks.forEach(element => {
            this.dataTasks.push(element.data());
          });
          this.sortByDeadlineTask();
        });
    },
    moveToDone(key) {
      db.collection("tasks")
        .where("idUser", "==", auth.currentUser.uid)
        .where("namaTask", "==", key)
        .get()
        .then(dataTask => {
          dataTask.forEach(element => {
            element.ref
              .update({
                statusTask: 3
              })
              .then(() => {
                alert(`'${key}' pindah ke done`);
                this.dataTasks = [];
                this.getTasks();
              });
          });
        });
    },
    editTaskDoing(key) {
      this.taskModal = true;
      this.statusDialog = "edit";
      db.collection("tasks")
        .where("idUser", "==", auth.currentUser.uid)
        .where("namaTask", "==", key)
        .get()
        .then(dataTasks => {
          dataTasks.forEach(element => {
            this.namaTask = element.data().namaTask;
            this.deskripsiTask = element.data().deskripsiTask;
            this.deadlineTask = element.data().deadlineTask;
          });
        });
    },
    saveAddTaskDoing() {
      if (this.$refs.formDoing.validate()) {
        let taskRef = db.collection("tasks");
        let query = taskRef
          .where("idUser", "==", auth.currentUser.uid)
          .where("namaTask", "==", this.namaTask);
        query.get().then(dataTasks => {
          if (dataTasks.size != 0) {
            alert("nama task sudah ada, silahkan ganti nama task");
          } else {
            db.collection("tasks")
              .add({
                idUser: auth.currentUser.uid,
                namaTask: this.namaTask,
                deskripsiTask: this.deskripsiTask,
                deadlineTask: this.deadlineTask,
                statusTask: 2
              })
              .then(() => {
                alert("buat task berhasil !");
                this.taskModal = false;
                this.$refs.formDoing.reset();
                this.dataTasks = [];
                this.getTasks();
              });
          }
        });
      }
    },
    saveEditTaskDoing() {
      if (this.$refs.formDoing.validate()) {
        db.collection("tasks")
          .where("idUser", "==", auth.currentUser.uid)
          .where("namaTask", "==", this.namaTask)
          .get()
          .then(dataTasks => {
            dataTasks.forEach(element => {
              element.ref
                .update({
                  idUser: auth.currentUser.uid,
                  namaTask: this.namaTask,
                  deskripsiTask: this.deskripsiTask,
                  deadlineTask: this.deadlineTask
                })
                .then(() => {
                  alert("edit task berhasil !");
                  this.taskModal = false;
                  this.$refs.formDoing.reset();
                  this.dataTasks = [];
                  this.getTasks();
                });
            });
          });
      }
    },
    deleteTask(key) {
      db.collection("tasks")
        .where("idUser", "==", auth.currentUser.uid)
        .where("namaTask", "==", key)
        .get()
        .then(dataTasks => {
          dataTasks.forEach(element => {
            element.ref.delete().then(() => {
              alert("hapus task berhasil !");
              this.taskModal = false;
              this.dataTasks = [];
              this.getTasks();
              // this.$router.go();
            });
          });
        });
    },
    closeTaskModal() {
      this.taskModal = false;
      this.$refs.formDoing.resetValidation();
      this.$refs.formDoing.reset();
    }
  }
};
</script>


<style lang="scss" scoped>
</style>