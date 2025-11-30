// deleteemployees.js
window.onload = init;

function init() {
    if (localStorage.getItem("token")) {
        document.getElementById('btn-buscar').addEventListener('click', buscarEmpleado);
    } else {
        window.location.href = "index.html";
    }
}

function buscarEmpleado() {
    const employeeId = document.getElementById("input-id").value;
    console.log(employeeId)
    if (!employeeId) {
        alert("Por favor, ingresa un ID.");
        return;
    }
    axios({
        method: 'get',
        url: `http://localhost:3000/employees/${employeeId}`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(function(res) {
        if (res.data && res.data.message) {
            mostrarEmpleado(res.data.message);
        } else {
            mostrarMensaje("No se encontró el empleado.");
        }
    })
    .catch(function(err) {
        mostrarMensaje("No se encontró el empleado.");
        console.error("Error en la solicitud: ", err);
    });
}

function mostrarEmpleado(employee) {
    const cardDiv = document.getElementById("employee-card");
    if (Array.isArray(employee)) {
        employee = employee[0];
    }
    if (!employee) {
        mostrarMensaje("No se encontró el empleado.");
        return;
    }
    const pageId = `page-${employee.id}`;
    cardDiv.innerHTML = `
        <div class="card mb-3">
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
                        <button class="btn btn-outline-info ml-3" onclick="generarPDFEmpleado('${employee.id}')">Ver PDF</button>
                        <button class="btn btn-danger ml-2" id="btn-eliminar">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('btn-eliminar').onclick = function() {
        eliminarEmpleado(employee.id);
    };
}

// Función global para cambiar la "página" de la card
window.cambiarPaginaEmpleado = function(pageId, pagina) {
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`${pageId}-${i}`).style.display = (i === pagina) ? 'block' : 'none';
    }
};

function mostrarMensaje(msg) {
    document.getElementById("employee-card").innerHTML = `<div class="alert alert-warning">${msg}</div>`;
}

function eliminarEmpleado(employeeId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este empleado?")) return;
    axios({
        method: 'delete',
        url: `http://localhost:3000/employees/${employeeId}`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(function(res) {
        if (res.data.code === 200) {
            mostrarMensaje("Empleado eliminado correctamente.");
            document.getElementById("input-id").value = '';
        } else {
            mostrarMensaje("No se encontró el empleado o ocurrió un error.");
        }
    })
    .catch(function(err) {
        mostrarMensaje("Error al eliminar el empleado.");
        console.error("Error en la solicitud: ", err);
    });
}

