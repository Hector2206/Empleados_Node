// admin.js

window.onload = init;

var headers = {};
var url = "http://localhost:3000/";

function init() {
    // Verifica si el usuario tiene un token válido
    if (localStorage.getItem("token")) {
        headers = {
            Authorization: "Bearer " + localStorage.getItem("token")
        };

        // Cargar empleados al iniciar
        loadEmployees();

        // Event listeners para botones
        document.querySelector('.btn-primary[data-action="add"]').addEventListener('click', () => {
            window.location.href = "signin.html";
        });
        document.querySelector('.btn-primary[data-action="add"]').addEventListener('click', () => {
            window.location.href = "addemployees.html";
        });
        document.querySelector('.btn-primary[data-action="edit"]').addEventListener('click', () => {
            window.location.href = "editemployees.html";
        });
        document.querySelector('.btn-danger[data-action="delete"]').addEventListener('click', () => {
            window.location.href = "deleteemployees.html";
        });
        document.querySelector('.btn-secondary[data-action="logout"]').addEventListener('click', logout);
    } else {
        // Redirecciona a la página de inicio de sesión si no hay token
        window.location.href = "index.html";
    }
}
function logout() {
    // Elimina el token de localStorage y redirige a la página de inicio de sesión
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

function loadEmployees(query = "") {
    axios.get(url + "employees/search" + query, { headers: headers })
        .then(function(res) {
            let employees = res.data && res.data.message ? res.data.message : [];
            if (!Array.isArray(employees)) {
                employees = employees ? [employees] : [];
            }
            displayEmployees(employees);
        })
        .catch(function(err) {
            mostrarMensaje("No se encontró ningún empleado con esos filtros.");
        });
}

document.getElementById('btn-pagar-nomina-todos').addEventListener('click', function() {
    // Limpia el input y mensaje
    document.getElementById('input-confirm-password').value = '';
    document.getElementById('msg-pago-nomina').innerHTML = '';
    $('#modalConfirmarPago').modal('show');
});

document.getElementById('btn-confirmar-pago').addEventListener('click', function() {
    const password = document.getElementById('input-confirm-password').value.trim();
    const msgDiv = document.getElementById('msg-pago-nomina');
    msgDiv.innerHTML = '';
    if (!password) {
        msgDiv.innerHTML = '<div class="alert alert-warning">Ingresa tu contraseña.</div>';
        return;
    }

    // Verifica la contraseña del usuario actual
    axios.post('http://localhost:3000/users/login', {
        username: obtenerUsuarioActual(), // función que extrae el username del token
        password: password
    })
    .then(function(res) {
        if (res.data.code === 200) {
            // Si la contraseña es correcta, paga nómina a todos
            pagarNominaTodos();
        } else {
            msgDiv.innerHTML = '<div class="alert alert-danger">Contraseña incorrecta.</div>';
        }
    })
    .catch(function() {
        msgDiv.innerHTML = '<div class="alert alert-danger">Contraseña incorrecta.</div>';
    });
});

function obtenerUsuarioActual() {
    // Decodifica el token para obtener el username
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username;
    } catch (e) {
        return "";
    }
}

function pagarNominaTodos() {
    // Llama al endpoint backend para pagar nómina a todos
    axios.post('http://localhost:3000/nominas/pagar-todos', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(function(res) {
        $('#modalConfirmarPago').modal('hide');
        alert("Nómina pagada a todos los empleados.");
    })
    .catch(function() {
        alert("Error al pagar nómina a todos.");
    });
}
