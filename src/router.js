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
            component: HomeComponent
        },
        {
            path: '/login',
            name: "login",
            component: LoginComponent,
            meta: {
                requiresVisitor: true
            }
        },
        {
            path: "/register",
            name: "register",
            component: RegisterComponent,
            meta: {
                requiresVisitor: true
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
                requiresAuth: true
            }
        },
        {
            path: "/round-leaderboard",
            name: "round-leaderboard",
            component: RoundLeaderboardComponent
        }
    ]
})
