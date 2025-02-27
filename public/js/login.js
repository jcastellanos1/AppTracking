document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Llamada a la API de login
        fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token); // Guarda el token
                console.log("Login exitoso:", data);
                window.location.href = "cliente.html";  // Redirigir al cliente
            } else {
                alert("Credenciales incorrectas");
            }
        })
        .catch(err => {
            console.error("Error en la solicitud de login:", err);  // Manejo de error en consola
            alert("Hubo un error al intentar iniciar sesión. Verifica tu conexión o intenta más tarde.");
        });
    });

    // Mostrar/ocultar contraseña
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");

    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordField = document.getElementById('password');
        const passwordType = passwordField.type === 'password' ? 'text' : 'password';
        passwordField.type = passwordType;
        this.textContent = passwordType === 'password' ? 'Mostrar' : 'Ocultar';
    });
});
