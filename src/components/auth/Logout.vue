<template>
    <div id="logout"></div>
</template>

<script>
    export default {
        name: 'Logout',
        created() {
            this.$store.dispatch('logoutUser')
            .then(() => {
                this.$router.push({name: 'home'})
            })
        }
    }
</script>