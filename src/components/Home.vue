<template>
        <center>
        <div id="home" class="home-body">
        <!--<h1 v-if="!loggedIn" style="color: whitesmoke">Welcome, please register or login.</h1>-->
        <h1 id="home-message"></h1>
        <div id="predictions-banner"></div>
        <div id="message-and-image"></div>
        <div v-if="loggedIn" id="predictions"></div>
                <hr>
                <h1 style="color:white;">Current Round Results</h1>
            <div v-if="loggedIn" id="currentRoundResults"></div>
        </div>
                </center>
</template>

<script>
    import {mapGetters} from "vuex"

    export default {
        name: 'home',
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'loggedIn'
            ])
        },
        created() {
            this.checkFutureRound()
        },
        methods: {
            async checkFutureRound() {
                const {data} = await this.getFutureRound()
                var status = data['status'];
                if (status === 1) {
                    this.buildFutureRoundMessage(data)
                } else if (status === 0) {
                    if (this.loggedIn) {
                        this.buildPredictionsMessage()
                    } else {
                        this.setupLoggedOut()
                    }
                }
            },
            getFutureRound() {  // returns 1 if a round exists that has a start datetime later than now, and 0 if no (relies on#
                                // there never being future rounds if a preceding round is not closed)
                return this.$store.dispatch('checkFutureRound')
            },
            buildFutureRoundMessage(response_data) {
                var update_text = "Next round opens in ";
                var days = response_data["days"];
                if (days === 1) {
                    update_text = update_text + "1 day, ";
                } else {
                    update_text = update_text + days + " days, ";
                }
                var hours = response_data["hours"];
                if (hours === 1) {
                    update_text = update_text + "1 hour, ";
                } else {
                    update_text = update_text + hours + " hours, ";
                }
                var minutes = response_data["minutes"];
                if (minutes === 1) {
                    update_text = update_text + "and 1 minute";
                } else {
                    update_text = update_text + "and " + minutes + " minutes";
                }
                document.getElementById("home-message").innerHTML = update_text;
            },
            async buildPredictionsMessage() {
                var response = await this.getPredictions()
                if (response.data[0] !== "No Open Round") {
                    if (response.data.message !== "Error. No predictions made") {   // User has made predictions on a currrently open round
                        document.getElementById('predictions-banner').innerHTML = "Your predictions for round " + response.data[0][4] + ":";
                        var printed_table = '<table><tr><th>Race No.</th><th>Snail No.</th><th>Snail Name</th><th>Trainer</th> </tr>';

                        for (var y = 0; y < response.data.length; y++) {
                            printed_table += '<tr><td>' + (y + 1) + '</td><td>' + response.data[y][1] + '</td><td>' + response.data[y][2] + '</td><td>' + response.data[y][3] + '</td></tr>';
                        }
                        printed_table += '</table>';
                    } else if (response.data.message === "Error. No predictions made") {    // User has not made predictions, but a round is open
                        printed_table = "<center><h3 style='background-color:white; margin-right:30%;'>You have not made any predictions. To do so <a href='snailx.racing'>Click Here</a></h3></center>"
                        printed_table += "<img height=70% width=70% src=https://static.euronews.com/articles/stories/03/22/91/52/880x495_cmsv2_1f2eea27-fa79-5a58-90f2-c298315d4e68-3229152.jpg>"
                    }
                } else {    // There is no open round (ROUND COULD BE INFLIGHT!!!)
                    printed_table = "<center><h3 style='background-color:white; padding:5px; margin-right:50%'>No rounds currently open!</h3></center>"
                }
                document.getElementById('message-and-image').innerHTML = printed_table;

            },
            
            getPredictions() {  // Returns a response with 'No Open Round' if a round is not open, and details of an open roundd plus predictions
                                // if there is an open round
                return this.$store.dispatch('getPredictions')
                    .then((response) => {
                        return response
                    })
            },
            
            async setupLoggedOut() {
                const response = await this.getActiveRound();
                console.log(response);
                const round_open = response.data['open'];
                console.log(round_open);
                var printed_table = "";
                if (round_open) { // If logged out and there is an open round
                    printed_table += "<center><h3 style='background-color:white; margin-right:30%;'>A round is now open to predict on - <a href='/#/login'>Log in</a>/<a href='/#/register'>register</a> to play!</h3></center>"
                }
                else { // if logged in and there is no future and no open round (INCLUDES INFLIGHT)
                    const inflight_response = await this.getInflightRound();
                    if(inflight_response.data['inflight']) {
                        printed_table += "<center><h3 style='background-color:white; margin-right:30%;'>A round is now in flight - <a href='/#/login'>Log in</a>/<a href='/#/register'>register</a> to view the results!</h3></center>"
                    } else {
                        printed_table += "<center><h3 style='background-color:white; margin-right:30%;'>No rounds have been scheduled. <a href='/#/login'>Log in</a>/<a href='/#/register'>register</a> to play!</h3></center>"
                    }
                }
                printed_table += "<img height=70% width=70% src=https://static.euronews.com/articles/stories/03/22/91/52/880x495_cmsv2_1f2eea27-fa79-5a58-90f2-c298315d4e68-3229152.jpg>"
                document.getElementById('message-and-image').innerHTML = printed_table;
            },
            getActiveRound() { //  Returns data where ['open'] is True if an open round exists and False if not
                return this.$store.dispatch('getActiveRound')
            },
            getInflightRound() {
                return this.$store.dispatch('getInflightRound')
                    .then((response) => {
                        if(response.data[0] !== "No Open Round") {
                            if (response.data.message !== "Error. No predictions made") {
                                document.getElementById('predictions-banner').innerHTML = "Your predictions for round " + response.data[0][4] + ":";
                                var printed_table = '<table><tr><th>Race No.</th><th>Snail No.</th><th>Snail Name</th><th>Trainer</th> </tr>';
                                for (var y = 0; y < response.data.length; y++) {
                                    printed_table += '<tr><td>' + (y + 1) + '</td><td>' + response.data[y][1] + '</td><td>' + response.data[y][2] + '</td><td>' + response.data[y][3] + '</td></tr>';
                                }
                                printed_table += '</table>';
                            }
                            else if (response.data.message == "Error. No predictions made") {
                                printed_table = "<center><h3 style='background-color:white; margin-right:30%;'>You have not made any predictions. To do so <a href='snailx.racing'>Click Here</a></h3></center>"
                                printed_table+="<img height=70% width=70% src=https://static.euronews.com/articles/stories/03/22/91/52/880x495_cmsv2_1f2eea27-fa79-5a58-90f2-c298315d4e68-3229152.jpg>"
                            }
                        }
                        else {
                            printed_table = "<center><h3 style='background-color:white; padding:5px; margin-right:50%'>No rounds currently open!</h3></center>"
                        }
                        document.getElementById('predictions').innerHTML = printed_table;
                    })
                },

            getCurrentRoundResults() {
                this.$store.dispatch('getCurrentRoundResults')
                    .then((response) => {
                        if (response.data.message !== "Error. No current round results") {


                                document.getElementById('predictions-banner').innerHTML = "Your predictions for round " + response.data[0][4] + ":";
                                var printed_table = '<h3 style="background-color: white">Current Race Results</h3><table><tr><th>Race No.</th><th>Snail Name</th><th>Trainer</th> </tr>';

                                for (var y = 0; y < response.data.length; y++) {
                                    printed_table += '<tr><td>' + (y + 1) + '</td><td>' + response.data[y][2] + '</td><td>' + response.data[y][3] + '</td></tr>';
                                }
                                printed_table += '</table>';
                            } else {
                                var printed_table = "<h3>No results currently available</h3>"
                            }

                        document.getElementById('currentRoundResults').innerHTML = printed_table;
                    })


            }
        },
        beforeMount() {
            this.getPredictions();
            this.getCurrentRoundResults();
            this.setupLoggedOut();
        }
    }
</script>

<style>


    /*--- future rounds message styling ---*/

    #home-message {
        background-color: white;
        /*color: black;*/
        width: 50%;
        margin-bottom: 5%;
        text-align: center;
            background-color: #a57827;
            color:white;
    }

    /*--- prediction banner styling ---*/

    #predictions-banner {
        background-color: white;
        width: 50%;
        margin-bottom: 5%;
        text-align: center;
            background-color: #a57827;
            color:white;
    }

    #currentRoundResults {
        background-color: white;
        width: 50%;
        margin-bottom: 5%;
        text-align: center;
            background-color: #a57827;
            color:white;
    }

    /*--- prediction banner styling end ---*/

    /*--- User predictions table styling ---*/

    
    table {
        width: 70%;
        background-color: #a57827;
            color: white;
    }

    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
    }

    th, td {
        padding: 15px;
        text-align: left;
    }

    /*--- User predictions table styling end ---*/
</style>
