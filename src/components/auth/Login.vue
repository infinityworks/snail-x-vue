<template>
    <div id="login">
        <h3 class="page-title" style="color:white">Login</h3>
        <hr>
        <form action="#" @submit.prevent="login">
            <input id="email-field" class="form-control" type="text" name="email"
                   v-model="email" placeholder="Email"/>
            <input id="password-field" class="form-control" type="password" name="password"
                   v-model="password" placeholder="Password"/>
            <button style="float: right" id="login-button" class="btn btn-primary" type="button" @click="login()">Login</button>
            <button style="margin-right: 1em; float: right" type="button" class="btn btn-warning"
                    onclick="window.history.back()">Back
            </button>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                email: "",
                password: ""
            }
        },
        created(){
            document.title = "Login - Snail-X";
        },
        methods: {
            login() {
                if (this.email !== "" && this.password !== "" && this.email.length < 100 && this.password.length < 100) {
                    this.$store.dispatch('loginUser', {
                        email: this.email,
                        password: this.password,
                    })
                        .then(() => {
                            this.$router.push({name: 'home'})
                        })
                        .catch(() => {
                            alert("Invalid login details please try again.");
                        })
                } else {
                    alert("Please enter a email and password of valid length (0 to 100 chars)");
                }
            }
        },
        beforeMount() {
            document.title = "Login - Snail-X";
        }
    }
</script>

<style scoped>
    #login {
        position: fixed;
        left: 30%;
        top: 8%;
        width: 40%;
        border: 1px solid grey;
        background: rgba(65, 107, 44, 1);
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        margin: 200px auto auto;
        padding: 20px;
    }

    input {
        margin-bottom: 1em;
    }
</style>