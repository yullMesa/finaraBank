console.log("conectado");

document.addEventListener("DOMContentLoaded", () => {
    const btnRegistrar = document.getElementById("btnRegistrar");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.querySelector(".toggle-password");

    // Mostrar / Ocultar contraseña
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            togglePassword.textContent = type === "password" ? "👁" : "🙈";
        });
    }

    // Manejo del registro al hacer clic en el botón
    if (btnRegistrar) {
        btnRegistrar.addEventListener("click", async () => {
            const formData = {
                nombre: document.getElementById("nombre").value,
                email: document.getElementById("email").value,
                documento: document.getElementById("documento").value,
                telefono: document.getElementById("telefono").value,
                nacimiento: document.getElementById("nacimiento").value,
                password: passwordInput.value,
                fechaRegistro: new Date().toISOString()
            };

            // Validar campos vacíos básicos por seguridad
            if (!formData.nombre || !formData.email || !formData.password) {
                alert("Por favor completa los campos obligatorios.");
                return;
            }

            const BACKEND_URL = "http://localhost:8080/api/usuarios/register";

            try {
                const response = await fetch(BACKEND_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error("Backend no disponible");

                alert("¡Registro exitoso en el servidor!");
                window.location.href = "../login.html";

            } catch (error) {
                // Respaldo en LocalStorage limpio y sin alertas de Firefox
                console.warn("Modo local activado: Guardando en LocalStorage...");
                let usuarios = JSON.parse(localStorage.getItem("finara_usuarios")) || [];

                const existe = usuarios.some(u => u.email === formData.email);
                if (existe) {
                    alert("⚠️ Este correo electrónico ya está registrado en este navegador.");
                    return;
                }

                usuarios.push(formData);
                localStorage.setItem("finara_usuarios", JSON.stringify(usuarios));

                alert("✅ ¡Cuenta creada y guardada en LocalStorage con éxito!");

                // Redirigir al login o limpiar
                window.location.href = "../login.html";
            }
        });
    }
});