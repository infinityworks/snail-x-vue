
<template>
    <div id="make-predictions">
        <h2 style="color:white" class="page-title">Make Predictions Here!</h2>
        <h3 class="round-name">{{ round_name }}</h3>
        <hr>
            <form @submit.prevent=submitForm()>
                <div v-for="(race, index) in races" class="race" style="margin-bottom: 2rem">
                    <h4 class="race-number">Race {{ index+1 }}</h4>
                    <div v-for="snail in race.race_data" style="overflow:hidden">
                        <div style="float:left">
                            <div>
                                <div>Snail: {{ snail.snail_name}}</div>
                                <div>Trainer: {{ snail.trainer_name}}</div>
                            </div>
                        </div>
                        <div>
                            <input
                                class="radio"
                                type="radio"
                                :data-race-id="race.race_id"
                                :data-snail-id="snail.snail_id"
                                :name="race.race_id"
                                @click="handleCheck"
                            >
                        </div>
                    </div>
                    <hr>
                </div>

                <button type="button" class="btn btn-warning" onclick="window.history.back()">Back</button>
                <button type="submit" class="btn btn-primary" style="margin-left: 0.5rem">Submit Predictions</button>
            </form>
    </div>
</template>

<script>
    export default {
        name: 'Make-Predictions',
        data() {
            return {
                round_id: 0,
                round_name: "",
                races: "",
                radios: [],
                checkedRadios: {},
            }
        },

        created() {
            document.title = "Make Predictions - Snail-X";
            this.get_open_round()
        },
        watch: {
            // call again the method if the route changes
            '$route': 'get-open_round'
        },
        methods: {
            get_open_round() {
                this.$store.dispatch('getOpenRound', {})
                    .then((response) => {
                        this.round_name = response.data.roundname;
                        this.round_id = response.data.roundid;
                        this.races = response.data.races;

                    })
            },
            handleCheck(e) {
                const dataset = e.target.dataset;
                this.checkedRadios[dataset.raceId] = dataset.snailId;
            },
            allTicked() {
                return Object.keys(this.checkedRadios).length == this.races.length;
            },
            submitForm() {
                if (!this.allTicked()) {
                    alert("You must select a winner for every race.")
                }
                else {
                    this.$store.dispatch('storePredictions', {
                        racePredictions: this.checkedRadios,
                    })
                        .then(() => {
                            this.$router.push({name: 'home'})
                        })
                        .catch(() => {
                            alert("HELP");
                        })
                }
            }
        }
    }

</script>

<style scoped>
    #make-predictions {
        /*position: fixed;*/
        /*left: 24.5%;*/
        /*top: 15%;*/
        width: 50%;
        background: rgba(65, 107, 44, 1);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin: 5% auto auto;
        padding: 20px;
        color:white;
    }

    input {
        margin-right: 1em;
    }

    input.radio {
        float: right;
        margin-top: 1em;
    }


</style>