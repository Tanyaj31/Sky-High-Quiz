class LoginManager {
    constructor() {
        this.loginDiv = document.getElementById("logindiv");
        this.messageDiv = document.getElementById("msgid");
    }

    hideLogin() {
        this.loginDiv.style.display = "none";
        this.messageDiv.style.display = "none";
    }

    showLogin() {
        this.loginDiv.style.display = "block";
        document.getElementById("homepage_data").style.display = "none";
    }

    checkLogin(username) {
        const validUsernames = ["Tanya", "Veronika", "Nikita", "Amir", "Chau"];
        if (validUsernames.includes(username)) {
            localStorage.setItem('username', username);
            localStorage.setItem('score', '0');
            localStorage.setItem('timer', '180');
            document.location.href = "home.html";
        } else {
            this.messageDiv.style.display = "";
            setTimeout(() => this.clearData(), 5000);
        }
    }

    clearData() {
        document.f1.username.value = "";
        this.messageDiv.style.display = "none";
    }
}

const loginManager = new LoginManager();

function login_div_fun() {
    loginManager.hideLogin();
}

function show_login_div() {
    loginManager.showLogin();
}

function checklogin() {
    const uname = document.f1.username.value;
    loginManager.checkLogin(uname);
}

function clearalldata() {
    document.f1.username.value = "";
    document.getElementById("msgid").style.display = "none";
}

function openRules() {
    window.open("rules.html", "_blank");
}
