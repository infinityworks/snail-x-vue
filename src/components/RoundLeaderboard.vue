<template>
    <div id="round-leaderboard" class="round-leadeboard-body">
        <div>
            <div style="display: inline-block">
            <h4 class="page-title" style="color:white;">Round Leaderboard</h4></div>
            <!--<label for="round_names" class="select-label">Round:</label>-->
            <div style="display: inline-block">
            <select name="round_names" id="round_names" class="select-box" v-model="selectedRoundName"></select></div>
        </div>
        <hr>
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
                let row = document.getElementsByTagName('tbody')[0];
                row.parentNode.removeChild(row);
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
        width: 40%;
        left: 30%;
        top: 20%;
        border: 1px solid grey;
        margin: 5% auto auto;
        padding: 20px;
        color: white;
        background: rgba(65, 107, 44, 1);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .select-label {
        font-size: large;
    }

    .select-box {
        font-size: large;
        width: 35%;
        position: absolute;
        top: 5%;
        right: 10%;
    }

    #results_table {
        font-size: 1rem;
        width: 100%;
    }

    #results_table th td {
        font-size: 10px;
    }
</style>