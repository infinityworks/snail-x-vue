<template>
    <div id="register">
        <form id="reg"
              @submit.prevent="validateForm">

            <h3 style="color:white;" class="page-title">Register</h3>
            <hr>
            <div class="form-group">

                <input type="text" class="form-control" name="firstName" v-model="firstName"
                       placeholder="First Name" maxlength="100"/>
                <p id="fName" class="validation-alert"></p>

                <input type="text" class="form-control" name="lastName" v-model="lastName"
                       placeholder="Last Name" maxlength="100"/>
                 <p id="lName" class="validation-alert"></p>

                <input type="text" class="form-control" name="email" v-model="email"
                       placeholder="Email" maxlength="100"/>
                 <p id="email" class="validation-alert"></p>

                <input type="password" class="form-control" name="password" v-model="password"
                       placeholder="Password" maxlength="100"/>
                <p id="psswd" class="validation-alert"></p>

                <input type="submit" class="btn btn-primary" value="Register"/>

                <button type="button" class="btn btn-warning"
                        onclick="window.history.back()">Back</button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'Register',
        data() {
            return {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                allValid: true,
            }
        },
        computed: {
            missingFirstName: function () { return this.firstName === ''; },
            missingLastName: function () { return this.lastName === ''; },
            invalidEmail: function () { return this.isEmail(this.email) === false; },
            duplicateEmail: function () { return this.email_in_db(this.email); },
            invalidPassword: function() { return this.isPassword(this.password) === false; }
        },
        methods: {
            isEmail: function (input) {
                const re = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
                return re.test(input);
            },
            isPassword: function (input) {
                const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
                return re.test(input);
            },

            validateFirstName: function() {
                if (this.missingFirstName) {
                    document.getElementById("fName").innerHTML = "First name is required.";
                    this.allValid = false;
                }
                else {
                    document.getElementById("fName").innerHTML = "";
                }
            },

            validateLastName: function() {
                if (this.missingLastName) {
                    document.getElementById("lName").innerHTML = "Last name is required.";
                    this.allValid = false;
                }
                else {
                    document.getElementById("lName").innerHTML = "";
                }
            },

            validatePassword: function() {
                if (this.invalidPassword) {
                    document.getElementById("psswd").innerHTML = "Password must be at least 8 characters long, and contain one number and one special character.";
                    this.allValid = false;
                }
                else {
                    document.getElementById("psswd").innerHTML = "";
                }
            },

            validateEmail: function() {
                if (this.invalidEmail) {
                    document.getElementById("email").innerHTML = "Email is required, and must be of a valid email format.";
                    this.allValid = false;
                }
                else {
                    this.duplicateEmail.then((inDb) => {
                        if (inDb) {
                            document.getElementById("email").innerHTML = "User account with this email already exists.";
                            this.allValid = false;
                       } else {
                            document.getElementById("email").innerHTML = "";
                        }
                    }).then(() => {
                        if (!this.allValid) {
                            return;
                        }

                        this.register();
                    });
                }
            },

            validateForm: function (event) {
                this.allValid = true;

                this.validateFirstName();
                this.validateLastName();
                this.validatePassword();
                this.validateEmail();

                event.preventDefault();
            },


            email_in_db() {
                return this.$store.dispatch('emailInDB', {
                    email: this.email.toLowerCase(),
                })
                    .then((response) => {
                        var result = Boolean(response);
                        if (result) {
                            return true
                        }
                        else {
                            return false
                        }
                    })
            },
            register() {
                this.$store.dispatch('registerUser', {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email.toLowerCase(),
                    password: this.password
                })
                    .then(() => {
                        this.$router.push({name: 'login'})
                        document.title = "Register - Snail-X";
                    })
            }
        }
    }
</script>

<style>
    #register {
        position: absolute;
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

    input {
        margin-right: 1em;
        color:white;
    }

    .validation-alert {
        color: red;
        font-size: medium;
    }
</style>