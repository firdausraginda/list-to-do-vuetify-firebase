<template>
  <div class="account">
    <v-container
      fluid
      fill-height
    >
      <v-layout
        justify-center
        align-center
      >
        <v-flex md6>
          <v-card>
            <img
              :src="user.profilePictureUser"
              alt="profile picture"
              width="100%"
            >
            <v-card-title primary-title>
              <div>
                <div class="subheading">{{user.emailUser}}</div>
                <span class="body-2 grey--text">{{user.passwordUser}}</span>
              </div>
            </v-card-title>

            <v-card-actions>

              <!-- popup modal edit -->
              <v-dialog
                v-model="editForm"
                persistent
                max-width="600px"
              >
                <v-btn
                  slot="activator"
                  flat
                >
                  Edit</v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">Edit Profile</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-text-field
                            label="Email"
                            required
                            disabled
                            v-model="user.emailUser"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field
                            v-if="user.typeUser == 'account manual'"
                            label="Password"
                            required
                            v-model="user.passwordUser"
                          ></v-text-field>
                        </v-flex>
                        <v-flex x12>
                          <label for="profilePicture">Profile Picture:</label>
                          <br>
                          <input
                            v-if="this.statusEditProfile == true"
                            type="file"
                            @change="chooseFile"
                          >
                          <br>
                          <p v-if="this.statusEditProfile == false">{{Math.floor(uploader)}}% uploading...</p>
                          <!-- <progress
                            v-if="this.statusEditProfile == false"
                            :value="uploader"
                            max="100"
                          ></progress> -->
                          <br>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      v-if="this.statusEditProfile == true"
                      color="blue darken-1"
                      flat
                      @click="editForm = false"
                    >Close</v-btn>
                    <v-btn
                      v-if="this.statusEditProfile == true"
                      color="blue darken-1"
                      flat
                      @click="editUser"
                    >Save</v-btn>
                    <v-btn
                      disabled
                      v-if="this.statusEditProfile == false"
                      color="blue darken-1"
                      flat
                      @click="editForm = false"
                    >Close</v-btn>
                    <v-btn
                      disabled
                      v-if="this.statusEditProfile == false"
                      color="blue darken-1"
                      flat
                      @click="editUser"
                    >Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- popup modal edit -->

            </v-card-actions>

          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { db, auth, storage } from "../firebase/firebaseInit";
export default {
  data: () => ({
    editForm: false,
    user: {
      type: Object,
      default: null
    },
    fileGambar: null,
    uploadGambar: null,
    uploader: "0",
    getGambar: null,
    statusEditProfile: true
  }),
  created() {
    this.getUser();
  },
  watch: {
    uploadGambar() {
      this.uploadGambar.on("state_changed", img => {
        this.uploader = (img.bytesTransferred / img.totalBytes) * 100;
        if (this.uploader == 100) {
          setTimeout(function() {
            alert("edit berhasil");
            this.editForm = false;
            this.statusEditProfile = true;
            location.reload();
          }, 4000);
        }
      });
    }
  },
  methods: {
    chooseFile(e) {
      this.fileGambar = e.target.files[0];
    },
    uploadFile() {
      this.statusEditProfile = false;

      let storageRef = storage.ref("displayPicture/" + this.fileGambar.name);
      this.uploadGambar = storageRef.put(this.fileGambar);

      db.collection("users")
        .where("idUser", "==", auth.currentUser.uid)
        .get()
        .then(dataUser => {
          dataUser.forEach(element => {
            element.ref.update({
              profilePictureUser: this.fileGambar.name
            });
          });
        });
    },
    async getUser() {
      await db
        .collection("users")
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
    editUser() {
      db.collection("users")
        .where("idUser", "==", auth.currentUser.uid)
        .get()
        .then(dataUser => {
          dataUser.forEach(element => {
            element.ref.update({
              passwordUser: this.user.passwordUser
            });
          });
          if (this.fileGambar != null) {
            this.uploadFile();
          } else {
            alert("edit berhasil");
            this.editForm = false;
            this.statusEditProfile = true;
          }
        });
    }
  }
};
</script>