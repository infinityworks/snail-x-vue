<template>
    <div id="round-leaderboard" class="round-leadeboard-body">
        <h1>Round Leaderboards</h1>
    </div>
</template>

<script>
    export default {
        name: 'round-leaderboard'
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