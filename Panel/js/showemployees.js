import { tieneAsistenciaHoy } from './asistenciaUtils.js';

window.onload = init;

var headers = {};
var url = "http://localhost:3000/";
let empleadoIdPago = null;

function init() {
    if (localStorage.getItem("token")) {
        headers = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token")
            }
        };
        loadEmployees();
    } else {
        window.location.href = "login.html";
    }
}

function loadEmployees() {
    axios.get(url + "employees/search", headers)
        .then(function (res) {
            console.log("Respuesta de la API:", res);

            if (Array.isArray(res.data.message)) {
                displayEmployees(res.data.message);
            } else {
                console.log("No se recibieron empleados. Respuesta inesperada:", res.data);
            }
        })
        .catch(function (err) {
            console.log("Error al cargar empleados:", err);
        });
}

function displayEmployees(employees) {
    var employeeList = document.getElementById("employee-list");
    employeeList.innerHTML = '';
    if (employees.length === 0) {
        employeeList.innerHTML = "<p>No hay empleados registrados.</p>";
        return;
    }

    employees.forEach(employee => {
        const cardId = `card-${employee.id}`;
        const pageId = `page-${employee.id}`;
        var employeeCard = document.createElement("div");
        employeeCard.id = cardId;
        employeeCard.classList.add("card", "mb-3");
        employeeCard.style.border = "2px solid #ccc";

        // Consulta la asistencia de hoy y cambia el borde
        tieneAsistenciaHoy(employee.id, headers, function(asistio) {
            if (asistio) {
                employeeCard.style.border = "3px solid #28a745"; // verde
            } else {
                employeeCard.style.border = "3px solidrgb(86, 99, 81)"; // rojo
            }
        });

        employeeCard.innerHTML = `
            <div class="card-body">
                <div id="${pageId}-1">
                    <h5 class="card-title mb-1">${employee.nombre} ${employee.apellidos}</h5>
                    <p class="mb-1"><strong>ID:</strong> ${employee.id}</p>
                    <p class="mb-1"><strong>Puesto:</strong> ${employee.puesto}</p>
                    <p class="mb-1"><strong>Teléfono:</strong> ${employee.telefono}</p>
                </div>
                <div id="${pageId}-2" style="display:none;">
                    <p class="mb-1"><strong>Dirección:</strong> ${employee.direccion}</p>
                    <p class="mb-1"><strong>CURP:</strong> ${employee.curp}</p>
                    <p class="mb-1"><strong>RFC:</strong> ${employee.rfc}</p>
                    <p class="mb-1"><strong>Correo:</strong> ${employee.correo}</p>
                    <p class="mb-1"><strong>Fecha de nacimiento:</strong> ${(employee.fecha_nacimiento || '').split('T')[0]}</p>
                </div>
                <div id="${pageId}-3" style="display:none;">
                    <p class="mb-1"><strong>Horario:</strong> ${employee.horario}</p>
                    <p class="mb-1"><strong>Sueldo:</strong> $${employee.sueldo} MXN</p>
                    <p class="mb-1"><strong>Antigüedad:</strong> ${employee.antiguedad} año${employee.antiguedad == 1 ? '' : 's'}</p>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div>
                        <button class="btn btn-sm btn-secondary" onclick="cambiarPaginaEmpleado('${pageId}', 1)">1</button>
                        <button class="btn btn-sm btn-secondary" onclick="cambiarPaginaEmpleado('${pageId}', 2)">2</button>
                        <button class="btn btn-sm btn-secondary" onclick="cambiarPaginaEmpleado('${pageId}', 3)">3</button>
                    </div>
                    <div>
                        <button class="btn btn-success btn-sm ml-2" onclick="registrarAsistenciaIndividual(${employee.id})">Registrar asistencia hoy</button>
                        <button class="btn btn-warning btn-sm ml-2" onclick="quitarAsistencia(${employee.id})">Quitar asistencia hoy</button>
                        <button class="btn btn-outline-info ml-2" onclick="generarPDFEmpleado('${employee.id}')">Ver PDF</button>
                        <button class="btn btn-outline-primary ml-2" onclick="consultarNominasEmpleado(${employee.id})">Nóminas</button>
                        <button class="btn btn-outline-success ml-2" onclick="consultarBonosEmpleado(${employee.id})">Bonos</button>
                        <button class="btn btn-primary btn-sm ml-2" onclick="abrirModalPagoIndividual(${employee.id}, '${employee.nombre} ${employee.apellidos}')">Pagar nómina</button>
                    </div>
                </div>
                <div id="nominas-empleado-${employee.id}" class="mt-2"></div>
                <div id="bonos-empleado-${employee.id}" class="mt-2"></div>
            </div>
        `;
        employeeList.appendChild(employeeCard);
    });
}

// Agrega esta función global para cambiar la "página" de la card
window.cambiarPaginaEmpleado = function (pageId, pagina) {
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`${pageId}-${i}`).style.display = (i === pagina) ? 'block' : 'none';
    }
};

window.abrirModalPagoIndividual = function(empleadoId, nombreCompleto) {
    empleadoIdPago = empleadoId;
    document.getElementById('input-password-pago-individual').value = '';
    document.getElementById('msg-pago-individual').innerHTML = '';
    document.getElementById('texto-modal-pago-individual').innerText = `Introduce tu contraseña para pagar la nómina de ${nombreCompleto}:`;
    $('#modalPagoIndividual').modal('show');
};

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-confirmar-pago-individual').addEventListener('click', function() {
        const password = document.getElementById('input-password-pago-individual').value.trim();
        const msgDiv = document.getElementById('msg-pago-individual');
        msgDiv.innerHTML = '';
        if (!password) {
            msgDiv.innerHTML = '<div class="alert alert-warning">Ingresa tu contraseña.</div>';
            return;
        }

        // Verifica la contraseña del usuario actual
        axios.post('http://localhost:3000/users/login', {
            username: obtenerUsuarioActual(),
            password: password
        })
        .then(function(res) {
            if (res.data.code === 200) {
                pagarNominaIndividual(empleadoIdPago);
            } else {
                msgDiv.innerHTML = '<div class="alert alert-danger">Contraseña incorrecta.</div>';
            }
        })
        .catch(function() {
            msgDiv.innerHTML = '<div class="alert alert-danger">Contraseña incorrecta.</div>';
        });
    });
});

function obtenerUsuarioActual() {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username;
    } catch (e) {
        return "";
    }
}

function pagarNominaIndividual(empleadoId) {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const anio = hoy.getFullYear();
    axios.post(`http://localhost:3000/nominas/generar/${empleadoId}?mes=${mes}&anio=${anio}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(function(res) {
        $('#modalPagoIndividual').modal('hide');
        alert("Nómina pagada para el empleado.");
    })
    .catch(function(err) {
        document.getElementById('msg-pago-individual').innerHTML = '<div class="alert alert-danger">Error al pagar nómina. Es posible que ya esté pagada este mes.</div>';
    });
}

