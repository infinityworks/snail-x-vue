import Vue from 'vue'
import Router from 'vue-router'
import RegisterComponent from "./components/auth/Register.vue"
import HomeComponent from "./components/Home.vue"
import LoginComponent from "./components/auth/Login.vue"
import LogoutComponent from "./components/auth/Logout.vue"

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
    ]
})
