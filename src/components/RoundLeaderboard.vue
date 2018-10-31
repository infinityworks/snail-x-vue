<template>
    <div id="round-leaderboard" class="round-leadeboard-body">
        <h1>Round Leaderboards</h1>
        <label for="round_ids">Rounds:</label>
        <select name="round_ids" id="round_ids" v-model="selected"></select>
        <table id="results_table">
            <tr>
                <th>Position</th>
                <th>Email</th>
                <th>Points</th>
                <th>Time</th>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'round-leaderboard',
        data() {
            return {
                selected: ""
            }
        },
        created() {
            this.initLeaderboardView();
        },
        methods: {
            initLeaderboardView() {
                this.populateSelectBoxWithRoundIds();
                this.loadDefaultLeaderboard();
            },
            async loadLeaderboardForRoundId(roundId) {
                const leaberboardResults  = await this.getLeaderboardByRoundId(roundId);
                this.populateLeaderboardTable(leaberboardResults);
            },
            async populateSelectBoxWithRoundIds() {
                const roundIds = await this.getAllClosedRoundsIds();
                const select = document.getElementById('round_ids');
                this.clearSelectBox(select);
                for (let roundId in roundIds) {
                    let opt = document.createElement('option');
                    opt.value = roundId;
                    opt.innerHTML = roundId;
                    select.appendChild(opt);
                }
            },
            populateLeaderboardTable(leaderboardResults) {
                let table = document.getElementById('results_table');
                for (let i = 0; i < leaderboardResults.length; i++) {
                    let tr = document.createElement('TR');
                    for (let j = 0; j < leaderboardResults[i].length; j++) {
                        let td = document.createElement('TD');
                        td.appendChild(document.createTextNode(leaderboardResults[i][j]));
                        tr.appendChild(td)
                    }
                    table.appendChild(tr);
                }
            },
            loadDefaultLeaderboard() {
                const select = document.getElementById("round_ids");
                const selectedRoundId = select.options[select.selectedIndex].value;
                this.loadLeaderboardForRoundId(selectedRoundId);
            },
            getLeaderboardByRoundId(roundId) {
                this.$store.dispatch('getRoundLeaderboardByRoundId', {
                    round_id: roundId
                })
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            getAllClosedRoundsIds() {
                return this.$store.dispatch('getAllRoundIds')
                    .then(response => {
                        return response['data'];
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