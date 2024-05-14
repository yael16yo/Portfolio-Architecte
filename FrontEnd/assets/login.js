        const loginForm = document.getElementById("login_form");

        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (email.trim() !== "" && password.trim() !== "") {
                loginRequest(email, password);
            }

        })


        function loginRequest(email, password) {
            const apiUrlUsers = "http://localhost:5678/api/users/login";

            fetch(apiUrlUsers, {
                    method: "POST",
                    headers: {
                        "accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "email": email,
                        "password": password
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        const error_div = document.getElementById("error_login");
                        let show_error = error_div.querySelector(".error-message");
                        if (!show_error) {
                            show_error = document.createElement("p");
                            show_error.classList.add("error-message");
                            show_error.innerText = "Identifiant ou mot-de-passe incorrect. Veuillez réessayer.";

                            error_div.appendChild(show_error);
                        }
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.token) {
                        sessionStorage.setItem('token', data.token);
                        window.location.href = 'index.html';
                    }
                })
        }
