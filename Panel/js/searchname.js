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
        document.querySelector('#search-button').addEventListener('click', searchEmployee);
    } else {
        window.location.href = "login.html";
    }
}

function searchEmployee() {
    var nombre = document.getElementById("input-nombre").value.trim();
    var id = document.getElementById("input-id").value.trim();
    var puesto = document.getElementById("input-puesto").value.trim();

    if (!nombre && !id && !puesto) {
        alert("Por favor, ingresa al menos un filtro para buscar.");
        return;
    }

    let params = [];
    if (id) params.push(`id=${encodeURIComponent(id)}`);
    if (nombre) params.push(`nombre=${encodeURIComponent(nombre)}`);
    if (puesto) params.push(`puesto=${encodeURIComponent(puesto)}`);
    let query = params.length ? '?' + params.join('&') : '';

    let cacheBuster = '_=' + new Date().getTime();
    let queryString = query ? query + '&' + cacheBuster : '?' + cacheBuster;

    axios.get(url + "employees/search" + queryString, { headers: headers })
        .then(function(res) {
            let employees = res.data && res.data.message ? res.data.message : [];
            if (!Array.isArray(employees)) {
                employees = employees ? [employees] : [];
            }
            console.log("Empleados recibidos:", employees); // <-- Agrega esto
            displayEmployees(employees);
        })
        .catch(function(err) {
            mostrarMensaje("No se encontró ningún empleado con esos filtros.");
        });
}

function displayEmployees(employees) {
    try {
        var employeeDetails = document.getElementById("employee-details");
        employeeDetails.innerHTML = '';

        if (!employees || employees.length === 0) {
            mostrarMensaje("No se encontró ningún empleado.");
            return;
        }

        employees.forEach(employee => {
            const pageId = `page-${employee.id}`;
            const cardId = `card-${employee.id}`;
            var employeeCard = document.createElement("div");
            employeeCard.classList.add("card", "mb-3");
            employeeCard.id = cardId;
            employeeCard.style.border = "2px solid #ccc";

            // Consulta la asistencia de hoy y cambia el borde
            tieneAsistenciaHoy(employee.id, headers, function(asistio) {
                if (asistio) {
                    employeeCard.style.border = "3px solid #28a745"; // verde
                } else {
                    employeeCard.style.border = "3px solid #dc3545"; // rojo
                }
            });

            employeeCard.innerHTML = `
                <div class="card-body">
                    <div id="${pageId}-1">
                        <h5 class="card-title mb-1">${employee.nombre} ${employee.apellidos || ''}</h5>
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
                            <button class="btn btn-primary btn-sm ml-2" onclick="abrirModalPagoIndividual(${employee.id}, '${employee.nombre} ${employee.apellidos || ''}')">Pagar nómina</button>
                        </div>
                    </div>
                    <div id="nominas-empleado-${employee.id}" class="mt-2"></div>
                    <div id="bonos-empleado-${employee.id}" class="mt-2"></div>
                </div>
            `;
            employeeDetails.appendChild(employeeCard);
        });
    } catch (e) {
        console.error("Error en displayEmployees:", e);
        mostrarMensaje("Ocurrió un error al mostrar los empleados.");
    }
}

function mostrarMensaje(msg) {
    document.getElementById("employee-details").innerHTML = `<div class="alert alert-warning">${msg}</div>`;
}

// Función global para cambiar la "página" de la card
window.cambiarPaginaEmpleado = function(pageId, pagina) {
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
    const btn = document.getElementById('btn-confirmar-pago-individual');
    if (btn) {
        btn.addEventListener('click', function() {
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
    }
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

