import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        user: localStorage.getItem('user_email') || null,
        user_first_name: localStorage.getItem('user_first_name') || null
        // user_id: localStorage.getItem('user_id') || null
    },
    getters: {
        loggedIn(state) {
            return state.user !== null
        },
        userEmail(state) {
            return state.user
        },
        userFirstName(state) {
            return state.user_first_name
        }
        // userID(state) {
        //     return state.user_id
        // }
    },
    mutations: {
        loginUser(state, {user_email, user_first_name}) {
            state.user = user_email;
            state.user_first_name = user_first_name;
            // state.user_id = user_id
        },
        logoutUser(state) {
            state.user = null;
            state.user_first_name = null;
            // state.user_id = null
        }
    },
    actions: {
        emailInDB: function (context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('http://127.0.0.1:5000/check-duplicate-email', {
                    email: credentials.email
                })
                    .then(response => {
                        return resolve(response.data["result"]);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },


        loginUser(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('http://127.0.0.1:5000/login-user', {
                    email: credentials.email,
                    password: credentials.password,
                }, {
                    headers: {
                        'Content-type': 'application/json',
                    }
                })
                    .then(response => {
                        const user_email = response.data['user_email'];
                        const user_first_name = response.data['user_first_name'];
                        localStorage.setItem('user_email', user_email);
                        localStorage.setItem('user_first_name', user_first_name);
                        // localStorage.setItem('user_id', user_id);
                        context.commit('loginUser', {user_email, user_first_name});
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },


        registerUser(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('http://127.0.0.1:5000/register-user', {
                    firstName: credentials.firstName,
                    lastName: credentials.lastName,
                    email: credentials.email,
                    password: credentials.password,
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },

        logoutUser(context) {
            return new Promise((resolve) => {
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_first_name');
                // localStorage.removeItem('user_id');
                context.commit('logoutUser');
                resolve()
            })
        },

        getOpenRound() {
            return new Promise((resolve, reject) => {
                axios.get('http://localhost:5000/get-open-round')
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },

        checkFutureRound() {
            return new Promise((resolve, reject) => {
                axios.get('http://127.0.0.1:5000/check-future-rounds')
                .then(response => {
                    resolve(response);
                })
                    .catch(error => {
                        reject(error);
                    })
                })
            },
        //Get user predictions from snail-x-core/core/router.py using email
        getPredictions() {
            return new Promise((resolve, reject) => {
                axios.post('http://127.0.0.1:5000/user-predictions', {
                    email: localStorage.getItem("user_email")
                }, {
                    headers: {
                        'Content-type': 'application/json',
                    }
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })

            })
        },
        //Get user predictions from snail-x-core/core/router.py using email
        getPredictionsAndResults(context, IDinfo) {
            return new Promise((resolve, reject) => {
                axios.post('http://127.0.0.1:5000/get-predictions-and-results', {
                    userEmail: this.state.user,
                    roundID: IDinfo.roundID
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })

            })
        },
        //Get user predictions from snail-x-core/core/router.py using email
        getInflightPredictions(context, IDinfo) {
            return new Promise((resolve, reject) => {
                axios.post('http://127.0.0.1:5000/specific-user-predictions', {
                    userEmail: this.state.user,
                    roundID: IDinfo.roundID
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })

            })
        },
        //Get user predictions from snail-x-core/core/router.py using email
        checkClosedPredictions(context, IDinfo) {
            return new Promise((resolve, reject) => {
                axios.post('http://127.0.0.1:5000/check-closed-predictions', {
                    userEmail: this.state.user,
                    roundID: IDinfo.roundID
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })

            })
        },
        storePredictions(context, predictions) {
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:5000/store-predictions', {
                    userEmail: this.state.user,
                    racePredictions: predictions.racePredictions
                })
                    .catch(error => {
                        reject(error);
                    })
            })
        },

        getActiveRound() {
            return new Promise((resolve, reject) => {
                axios.get('http://127.0.0.1:5000/get-active-round')
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },
        getCurrentRoundResults() {
            return new Promise((resolve, reject) => {
                axios.get('http://127.0.0.1:5000/get-current-round-results')
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },
        getClosedRoundResults() {
            return new Promise((resolve, reject) => {
                axios.get('http://127.0.0.1:5000/get-closed-round-results')
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },
        getAllRoundsClosed(){
          return new Promise((resolve, reject) => {
              axios.get('http://127.0.0.1:5000/get-all-rounds-closed')
                  .then(response => {
                      resolve(response);
                  })
                  .catch(error => {
                      reject(error);
                  })
          })
        },
        getInflightRound() {
            return new Promise((resolve, reject) => {
                axios.get('http://127.0.0.1:5000/get-inflight-round')
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        alert("errror!");
                        reject(error);
                    })
            })
        }
    }
});