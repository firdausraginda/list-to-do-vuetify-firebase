<template>
  <div class="login">
    <v-container
      fluid
      fill-height
    >
      <v-layout
        justify-center
        align-center
      >
        <v-flex md4>
          <v-card>
            <v-card-text>
              <h3 class="text-xs-center headline">Login Dong</h3>
            </v-card-text>
            <v-card-text>
              <v-text-field
                type="email"
                label="Email"
                v-model="emailLogin"
              ></v-text-field>
              <v-text-field
                type="password"
                label="Password"
                v-model="passwordLogin"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                block
                color="success"
                @click="login"
              >
                Login
              </v-btn>
            </v-card-actions>
            <v-card-text>
              <v-dialog
                v-model="signUpModal"
                persistent
                max-width="600px"
              >
                <h3
                  class="body-2"
                  slot="activator"
                >sign up</h3>
                <v-card>
                  <v-card-title>
                    <h3 class="headline">Sign Up</h3>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-text-field
                            type="email"
                            label="Email"
                            v-model="emailCreate"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field
                            type="password"
                            label="Password"
                            v-model="passwordCreate"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="blue darken-1"
                      flat
                      @click="createAccount"
                    >Save</v-btn>
                    <v-btn
                      color="blue darken-1"
                      flat
                      @click="signUpModal = false"
                    >Close</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-text>
            <h3 class="text-xs-center body-2">or</h3>
            <v-card-text>
              <v-btn
                block
                color="red"
                dark
                @click="loginGoogle"
              >
                login with google
              </v-btn>
              <!-- <v-btn
                block
                color="warning"
                @click="cekAuth"
              >
                cek auth
              </v-btn>
              <v-btn
                block
                color="blue"
                @click="logout"
                dark
              >
                logout
              </v-btn> -->
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { auth, db, authGoogle } from "../firebase/firebaseInit";

export default {
  data: () => ({
    signUpModal: false,
    emailCreate: "",
    passwordCreate: "",
    emailLogin: "",
    passwordLogin: ""
  }),
  created() {},
  methods: {
    cekAuth() {
      console.log(auth.currentUser.email);
    },
    async createAccount() {
      await auth
        .createUserWithEmailAndPassword(this.emailCreate, this.passwordCreate)
        .then(() => {
          alert("Sign Up Berhasil !");
          this.signUpModal = false;
        })
        .catch(error => {
          alert(error.message);
          this.signUpModal = true;
        });
      await db.collection("users").add({
        idUser: auth.currentUser.uid,
        emailUser: this.emailCreate,
        passwordUser: this.passwordCreate,
        typeUser: "account manual",
        profilePictureUser: null
      });
      auth.signOut();
    },
    login() {
      auth
        .signInWithEmailAndPassword(this.emailLogin, this.passwordLogin)
        .then(() => {
          alert("Login Berhasil !");
          this.$router.push({ path: "/" });
        })
        .catch(error => {
          alert(error.message);
        });
    },
    async loginGoogle() {
      await auth
        .signInWithPopup(authGoogle)
        .then(() => {
          // console.log(result.credential.accessToken);
          // console.log(result.user);
          this.$router.push({ path: "/" });
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
          console.log(error.email);
          console.log(error.credential);
        });
      let userRef = db.collection("users");
      let query = userRef.where("emailUser", "==", auth.currentUser.email);
      query.get().then(dataUser => {
        if (dataUser.size == 0) {
          userRef.add({
            idUser: auth.currentUser.uid,
            emailUser: auth.currentUser.email,
            passwordUser: null,
            typeUser: "google mail",
            profilePictureUser: null
          });
        }
      });
    },
    logout() {
      auth.signOut().then(() => {
        alert("Logout Berhasil !");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>