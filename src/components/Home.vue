<template>
    <center>
        <div id="home" class="home-body">
            <h1 id="home-message"></h1>
            <div v-if="loggedIn" id="predictions-banner"></div>
            <div id="message-and-image"></div>
            <div v-if="loggedIn" id="predictions"></div>
            <div v-if="loggedIn" id="currentRoundResults"></div>
        </div>
    </center>
</template>

<script>
    import {mapGetters} from "vuex"

    export default {
        name: 'home',
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                'loggedIn',
                'userEmail'
            ])
        },
        created() {
            document.title = "Home - Snail-X";
            this.checkFutureRound();
            document.title = "Home - Snail-X";
        },
        methods: {
            async checkFutureRound() {
                const {data} = await this.getFutureRound();
                const status = data['status'];
                if (status === 1) {
                    this.buildFutureRoundMessage(data)
                }
                else if (status === 0) {
                    if (this.loggedIn) {
                        this.buildPredictionsMessage()
                    }
                    else {
                        this.setupLoggedOut()
                    }
                }
            },
            getFutureRound() {  // returns 1 if a round exists that has a start datetime later than now, and 0 if no (relies on
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
                if (!this.loggedIn) {
                    update_text = update_text + " - <a href='/#/login'>log in</a> or <a href='/#/register'>register</a> to play!"
                }
                document.getElementById("home-message").innerHTML = update_text;
            },

            async buildPredictionsMessage() {
                const is_inflight = await this.getInflightRound();
                const inflight_status = is_inflight.data['inflight'];
                if (inflight_status) { // logged in, check if round in flight
                    const inflight_id = is_inflight.data['round_id'];
                    const predictions = await this.getInflightPredictions(inflight_id);

                    if (predictions.data.message === "Error. No predictions made") {
                        this.getCurrentRoundResults()
                    }
                    else {
                        this.displayPredictionsAndResults(inflight_id)
                    }
                }
                else {
                    const all_closed_status = await this.getAllRoundsClosed();
                    if (all_closed_status.data) {
                        const all_closed_predictions = await this.getClosedPredictions(all_closed_status.data);
                        if (all_closed_predictions.data.message !== "No predictions made") {
                            this.displayPredictionsAndResults(all_closed_status.data)
                        }
                        else {
                            this.getClosedRoundResults(all_closed_status.data)
                        }

                    }
                    else {
                        let response = await this.getPredictions();
                        if (response.data[0] !== "No Open Round") {
                            if (response.data.message !== "Error. No predictions made") {   // User has made predictions on a currently open round
                                document.getElementById('predictions-banner').innerHTML = "Your predictions for round " + response.data[0][4] + ":";
                                var printed_table = '<table><tr><th>Race No.</th><th>Snail Name</th><th>Trainer</th></tr>';

                                for (var y = 0; y < response.data.length; y++) {
                                    printed_table += '<tr><td>' + (y + 1) + '</td><td>' + response.data[y][2] + '</td><td>' + response.data[y][3] + '</td></tr>';
                                }
                                printed_table += '</table>';
                            } else if (response.data.message === "Error. No predictions made") {    // User has not made predictions, but a round is open
                                printed_table = "<center><h3>You have not made any predictions. To do so <a href='/#/make-predictions'>Click Here</a></h3></center>"
                                printed_table += "<img height=70% width=70% src=https://static.euronews.com/articles/stories/03/22/91/52/880x495_cmsv2_1f2eea27-fa79-5a58-90f2-c298315d4e68-3229152.jpg>"
                            }
                            document.getElementById('message-and-image').innerHTML = printed_table;
                        }
                        else {    // There is no open round (ROUND COULD BE INFLIGHT!!!)
                            printed_table = "<center><h3>No rounds currently open!</h3></center>"
                            document.getElementById('message-and-image').innerHTML = printed_table;
                        }
                    }
                }
            },

            getPredictions() {  // Returns a response with 'No Open Round' if a round is not open, and details of an open round plus predictions
                // if there is an open round
                return this.$store.dispatch('getPredictions')
                    .then((response) => {
                        return response
                    })
            },

            getInflightPredictions(roundID) {  // Returns a response with 'No Open Round' if a round is not open, and details of an open round plus predictions
                // if there is an open round
                return this.$store.dispatch('getInflightPredictions', {
                    roundID: roundID
                })
                    .then((response) => {
                        return response
                    })
            },
            getClosedPredictions(roundID) {
                return this.$store.dispatch('getClosedPredictions', {
                    roundID: roundID
                })
                    .then((response) => {
                        return response
                    })
            },
            async setupLoggedOut() {
                const response = await this.getActiveRound();
                const round_open = response.data['open'];
                let printed_table = "";
                if (round_open) { // If logged out and there is an open round
                    printed_table += "<center><h3>A round is now open to predict on - <a href='/#/login'>log in</a>/<a href='/#/register'>register</a> to play!</h3></center>"
                }
                else { // if logged out and there is no future and no open round (INCLUDES INFLIGHT)
                    const inflight_response = await this.getInflightRound();
                    const is_inflight = inflight_response.data['inflight'];
                    if (is_inflight) {
                        printed_table += "<center><h3>A round is now in flight - <a href='/#/login'>log in</a>/<a href='/#/register'>register</a> to view the results!</h3></center>"
                    }
                    else {
                        const closed_rounds = await this.getAllRoundsClosed();
                        const is_closed = closed_rounds.data;
                        if (is_closed) {
                            this.getClosedRoundResults(is_closed)
                        }
                        else {
                            alert("no rounds in DB");
                            printed_table += "<center><h3>No rounds have been scheduled. <a href='/#/login'>Log in</a>/<a href='/#/register'>register</a> to play!</h3></center>"
                        }
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
            },
            getAllRoundsClosed() {
                return this.$store.dispatch('getAllRoundsClosed')
            },
            displayPredictionsAndResults(roundID) {
                this.$store.dispatch('getPredictionsAndResults', {
                    roundID: roundID
                })
                    .then((response) => {
                        let printed_table = '<h3>Current Round Results</h3><table><tr><th>Race No.</th><th>Predicted Snail</th><th>Finishing Position</th><th>Winning Snail</th><th>Winning Snail Trainer</th> </tr>';
                        for (let x = 0; x < response.data.length; x++) {
                            if (response.data[x]['actualWinner']) {
                                printed_table += '<tr><td>' + (x + 1) + '</td><td>' + response.data[x]['predictedName'] + '</td><td>' + response.data[x]['position'] + '</td><td>' + response.data[x]['actualWinner'] + '</td><td>' + response.data[x]['winnerTrainer'] + '</td></tr>';
                            }
                            else {
                                printed_table += '<tr><td>' + (x + 1) + '</td><td>' + response.data[x]['predictedName'] + '</td><td>' + ' ' + '</td><td>' + ' ' + '</td><td>' + ' ' + '</td></tr>';

                            }
                        }
                        printed_table += '</table>';
                        document.getElementById('currentRoundResults').innerHTML = printed_table;
                    })
            },
            getCurrentRoundResults() {
                this.$store.dispatch('getCurrentRoundResults')
                    .then((response) => {
                        let printed_table = "";
                        if (response.data.message !== "Error. No current round results") {

                            // document.getElementById('predictions-banner').innerHTML = "Your predictions for round " + response.data[0][4] + ":";
                            printed_table = '<h3>Current Round Results</h3><table><tr><th>Race No.</th><th>Winning Snail</th><th>Trainer</th></tr>';

                            for (var y = 0; y < response.data.length; y++) {
                                printed_table += '<tr><td>' + (y + 1) + '</td><td>' + response.data[y][2] + '</td><td>' + response.data[y][3] + '</td></tr>';

                            }
                            printed_table += '</table>';
                        }
                        else {
                            // var printed_table = "<h3>No results currently available</h3>"

                            printed_table += "<h3> </h3>";
                        }

                        document.getElementById('currentRoundResults').innerHTML = printed_table;
                    })
            },
            getClosedRoundResults(roundID) {
                this.$store.dispatch('getClosedRoundResults')
                    .then((response) => {
                        const round_text = "Results: Round " + roundID;
                        let printed_table = '<h3>' + round_text + '</h3><table><tr><th>Race No.</th><th>Winning Snail</th><th>Trainer</th></tr>';

                        for (let i = 0; i < response.data.length; i++) {
                            printed_table += '<tr><td>' + (i + 1) + '</td><td>' + response.data[i]['snailName'] + '</td><td>' + response.data[i]['trainerName'] + '</td></tr>';
                        }
                        printed_table += '</table>';
                        document.getElementById('message-and-image').innerHTML = printed_table;
                    })
            },

        }
    }
</script>

<style>


    /*--- future rounds message styling ---*/

    #home-message {
        width: 100%;
        text-align: center;
        background: rgba(65, 107, 44, 1);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        color: white;
    }

    /*--- prediction banner styling ---*/

    #predictions-banner {
        width: 100%;
        text-align: center;
        background: rgba(65, 107, 44, 1);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        color: white;
    }

    #currentRoundResults {
        background: rgba(65, 107, 44, 1);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        color: white;
        margin-bottom: 10px;
        padding-bottom: 20px;
    }

    #message-and-image {
        background: rgba(65, 107, 44, 1);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        color: white;
        margin-bottom: 10px;
        padding-bottom: 20px;
    }

    /*--- prediction banner styling end ---*/

    /*--- User predictions table styling ---*/

    table {
        width: 10%;
        background: rgba(65, 107, 44, 1);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    }

    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
        color: black;
        background-color: white;
        width: 10%;
    }

    th, td {
        padding: 15px;
        text-align: left;
    }

    /*--- User predictions table styling end ---*/
</style>