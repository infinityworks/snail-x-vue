import Vue from 'vue'
import Router from 'vue-router'
import RegisterComponent from "./components/auth/Register.vue"
import HomeComponent from "./components/Home.vue"
import LoginComponent from "./components/auth/Login.vue"
import LogoutComponent from "./components/auth/Logout.vue"
import MakePredictionsComponent from "./components/predictions/MakePredictions.vue"
import RoundLeaderboardComponent from "./components/RoundLeaderboard"

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: "home",
            component: HomeComponent,
            meta: {
                title: 'Home Page'
            }
        },
        {
            path: '/login',
            name: "login",
            component: LoginComponent,
            meta: {
                requiresVisitor: true,
                title: 'Login'
            }
        },
        {
            path: "/register",
            name: "register",
            component: RegisterComponent,
            meta: {
                requiresVisitor: true,
                title: 'Register'
            }
        },
        {
            path: "/logout",
            name: "logout",
            component: LogoutComponent
        },
        {
            path: "/make-predictions",
            name: "make-predictions",
            component: MakePredictionsComponent,
            meta: {
                requiresAuth: true,
                title: 'Make Prediction'
            }
        },
        {
            path: "/round-leaderboard",
            name: "round-leaderboard",
            component: RoundLeaderboardComponent,
            meta: {
                requiresAuth: true,
                title: 'Leaderboard'
            }
        }
    ]
})
