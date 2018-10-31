<template>

    <div id="app" class="container">
        <marquee><h3 style="color:white">Visitor our sponsor: GoDaddy! 99p Domains! Cheap Webhosting! Store all your clients details with us! We're trustworthy! Promise <3</h3></marquee>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
              integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
              crossorigin="anonymous">
        <div id="snail-div">
            <img id="snail-img" src="./components/assets/snail-x-logo.png"/>
        </div>

        <div class="navigation-bar" id="navbar">
            <ul class="nav">
                <li>
                    <router-link to="/" class="nav-link">Home</router-link>
                </li>
                <li>
                    <router-link to="/" class="nav-link">Enter</router-link>
                </li>
                <li>
                    <router-link to="/" class="nav-link">Results</router-link>
                </li>
                <li>
                    <router-link to="/" class="nav-link">Leaderboards</router-link>
                </li>
                <li v-if="!loggedIn">
                    <router-link :to="{ name: 'login' }" class="nav-link">Login</router-link>
                </li>
                <li v-if="!loggedIn">
                    <router-link :to="{ name: 'register' }" class="nav-link">Register</router-link>
                </li>
                <li v-if="loggedIn">
                    <p style="color: orange; display: inline-block;">Welcome, {{ userFirstName }}</p>
                    <router-link style="display: inline-block;" :to="{ name: 'logout' }" class="nav-link">Logout</router-link>
                </li>
            </ul>
        </div>

        <div id="sidebanner"></div>
        <router-view @authenticated="setAuthenticated"/>
        <center><img style="width:80%; padding-top:60%;" src="./components/assets/godaddy-ad.jpg"/></center>
    </div>

</template>

<script>
    import {mapGetters} from "vuex"

    export default {
        name: 'App',
        data() {
            return {
                authenticated: false,
            }
        },
        computed: {
            ...mapGetters([
                'loggedIn',
                'userEmail',
                'userFirstName'
            ])
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;
            }
        }
    }
</script>

<style>

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        font-size: 24px;
        overflow: auto;
        background-color:#573B0C;
        background-opacity: 50%;
        height:100vh;
    }

    .nav {
        padding: 8px 0;
        margin: auto;
        list-style: none;
        align-items: center;
        height: 50px;
        color:white;
    }

    .nav a {
        color: white;
        padding: 0 24px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .05rem;
        text-decoration: none;
        text-transform: uppercase;
    }

    .nav p {
        color: #636b6f;
        padding: 0 20px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .05rem;
        text-decoration: none;
        text-transform: uppercase;
    }


    .nav a:hover {
        color: green;
    }

    .btn {
        letter-spacing: .1rem;
        text-decoration: none;
        text-transform: lowercase;
    }

    .container {
        max-width: 60%;
        left:10%;
        right:10%;
        margin:0 auto;
    }

    .navigation-bar {
        background-color: whitesmoke;
        border: 1px grey solid;
        padding-left: 1em;
        margin: auto;
        width: 66%;
        display: flex;
        background-color:#a57827;
        color:white;
    }

    body {
        /*width: 1024px;*/
        background-image: url("https://images.wallpaperscraft.com/image/grain_grass_field_green_83891_1920x1080.jpg");
        overflow: auto;

    }


    #snail-div {
        display: flex;
        height: 20%;
    }

    #snail-img {
        margin: auto;
        width: 60%;
    }

    .page-title {
        font-weight: bold;
        color: grey;
        padding: 0;
        margin-top: 0;

    }
</style>
