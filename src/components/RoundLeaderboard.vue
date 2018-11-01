<template>
    <div id="round-leaderboard" class="round-leadeboard-body">
        <h1>Round Leaderboards</h1>
        <label for="round_names">Rounds:</label>
        <select name="round_names" id="round_names" v-model="selectedRoundName"></select>
        <table id="results_table">
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Email</th>
                    <th>Points</th>
                    <th>Time</th>
                </tr>
            </thead>
        </table>
    </div>
</template>

<script>
    import $ from 'jquery'
    export default {
        name: 'round-leaderboard',
        data() {
            return {
                selectedRoundName: ""
            }
        },
        created() {
            this.initLeaderboardView();
        },
        watch: {
            selectedRoundName: function (val) {
                this.loadLeaderboardForRoundId(val);
            }
        },
        methods: {
            async initLeaderboardView() {
                await this.populateSelectBoxWithRoundIds();
                this.loadDefaultLeaderboard();
            },
            async loadLeaderboardForRoundId(roundId) {
                const leaberboardResults = await this.getLeaderboardByRoundName(roundId);
                this.populateLeaderboardTable(leaberboardResults);
            },
            async populateSelectBoxWithRoundIds() {
                const roundNames = await this.getAllClosedRoundsNames();
                const select = document.getElementById('round_names');
                this.clearSelectBox(select);
                for (let i in roundNames) {
                    let opt = document.createElement('option');
                    opt.value = roundNames[i];
                    opt.innerHTML = roundNames[i];
                    select.appendChild(opt);
                }
            },
            populateLeaderboardTable(leaderboardResults) {
                let table = document.getElementById('results_table');
                $("#results_table tbody").remove();
                let tbody = document.createElement('tbody');
                for (let i = 0; i < leaderboardResults.length; i++) {
                    let tr = document.createElement('TR');
                    for (let j = 0; j < leaderboardResults[i].length; j++) {
                        let td = document.createElement('TD');
                        td.appendChild(document.createTextNode(leaderboardResults[i][j]));
                        tr.appendChild(td)
                    }
                    tbody.appendChild(tr);
                }
                table.appendChild(tbody);
            },
            loadDefaultLeaderboard() {
                const select = document.getElementById("round_names");
                const selectedRoundId = select.options[select.selectedIndex].value;
                this.loadLeaderboardForRoundId(selectedRoundId);
            },
            getLeaderboardByRoundName(roundName) {
                return this.$store.dispatch('getRoundLeaderboardByRoundName', roundName)
                    .then(response_data => {
                        return response_data;
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            getAllClosedRoundsNames() {
                return this.$store.dispatch('getAllRoundNames')
                    .then(response_data => {
                        return response_data;
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            clearSelectBox(selectBox) {
                let i;
                for (i = selectBox.options.length - 1; i >= 0; i--) {
                    selectBox.remove(i);
                }
            }
        }
    }
</script>

<style scoped>
    .round-leadeboard-body {
        position: fixed;
        overflow: auto;
        top: 10%;
        left: 11%;
        width: 50%;
        border: 1px solid grey;
        background-color: white;
        margin: 5% auto auto;
        padding: 20px;
    }
</style>