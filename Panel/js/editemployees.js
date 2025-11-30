// editemployees.js
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
        .then(function (res) {
            let employee = res.data.message;
            if (Array.isArray(employee)) employee = employee[0];
            if (employee) {
                mostrarFormularioEdicion(employee);
            } else {
                mostrarMensaje("No se encontró el empleado.");
            }
            document.getElementById("input-id").value = ""; // Limpiar el input después de buscar
        })
        .catch(function (err) {
            mostrarMensaje("No se encontró el empleado.");
            console.error("Error en la solicitud: ", err);
            document.getElementById("input-id").value = ""; // Limpiar también si hay error
        });
}

function mostrarFormularioEdicion(employee) {
    const cardDiv = document.getElementById("employee-card");
    cardDiv.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${employee.nombre} ${employee.apellidos}</h5>
                <form id="form-editar">
                    <div class="form-group">
                        <label for="input-nombre">Nombre:</label>
                        <input type="text" class="form-control" id="input-nombre" value="${employee.nombre}">
                    </div>
                    <div class="form-group">
                        <label for="input-apellidos">Apellidos:</label>
                        <input type="text" class="form-control" id="input-apellidos" value="${employee.apellidos}">
                    </div>
                    <div class="form-group">
                        <label for="input-telefono">Teléfono:</label>
                        <input type="tel" class="form-control" id="input-telefono" value="${employee.telefono}">
                    </div>
                    <div class="form-group">
                        <label for="input-correo">Correo:</label>
                        <input type="email" class="form-control" id="input-correo" value="${employee.correo}">
                    </div>
                    <div class="form-group">
                        <label for="input-direccion">Dirección:</label>
                        <input type="text" class="form-control" id="input-direccion" value="${employee.direccion}">
                    </div>
                    <div class="form-group">
                        <label for="input-fecha-nacimiento">Fecha de nacimiento:</label>
                        <input type="date" class="form-control" id="input-fecha-nacimiento" value="${employee.fecha_nacimiento ? employee.fecha_nacimiento.split('T')[0] : ''}">
                    </div>
                    <div class="form-group">
                        <label for="input-curp">CURP:</label>
                        <input type="text" class="form-control" id="input-curp" value="${employee.curp}">
                    </div>
                    <div class="form-group">
                        <label for="input-rfc">RFC:</label>
                        <input type="text" class="form-control" id="input-rfc" value="${employee.rfc}">
                    </div>
                    <div class="form-group">
                        <label for="input-horario">Horario:</label>
                        <input type="text" class="form-control" id="input-horario" value="${employee.horario}">
                    </div>
                    <div class="form-group">
                        <label for="input-sueldo">Sueldo (MXN):</label>
                        <input type="number" step="0.01" class="form-control" id="input-sueldo" value="${employee.sueldo}">
                    </div>
                    <div class="form-group">
                        <label for="puesto">Puesto (Área):</label>
                        <select class="form-control" id="puesto" required>
                            <option value="">Selecciona un puesto</option>
                            <option ${employee.puesto === 'Departamento de Energías Renovables' ? 'selected' : ''}>Departamento de Energías Renovables</option>
                            <option ${employee.puesto === 'Área Auxiliar' ? 'selected' : ''}>Área Auxiliar</option>
                            <option ${employee.puesto === 'Departamento Juridico' ? 'selected' : ''}>Departamento Juridico</option>
                            <option ${employee.puesto === 'Obra Civil' ? 'selected' : ''}>Obra Civil</option>
                            <option ${employee.puesto === 'Área administrativa' ? 'selected' : ''}>Área administrativa</option>
                            <option ${employee.puesto === 'Área contable' ? 'selected' : ''}>Área contable</option>
                            <option ${employee.puesto === 'Área de ingeniería y nuevos proyectos' ? 'selected' : ''}>Área de ingeniería y nuevos proyectos</option>
                            <option ${employee.puesto === 'Área impacto vial' ? 'selected' : ''}>Área impacto vial</option>
                            <option ${employee.puesto === 'Área de medio ambiente y protección civil' ? 'selected' : ''}>Área de medio ambiente y protección civil</option>
                            <option ${employee.puesto === 'Coordinación de impacto ambiental' ? 'selected' : ''}>Coordinación de impacto ambiental</option>
                            <option ${employee.puesto === 'Coordinacion de Proteccion Civil' ? 'selected' : ''}>Coordinacion de Proteccion Civil</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="input-antiguedad">Antigüedad (años):</label>
                        <input type="number" min="0" class="form-control" id="input-antiguedad" value="${employee.antiguedad}">
                    </div>
                    <button type="button" class="btn btn-primary" id="btn-modificar">Modificar</button>
                </form>
            </div>
        </div>
    `;
    document.getElementById('btn-modificar').onclick = function () {
        editemployees(employee.id, employee);
    };
}

function mostrarMensaje(msg) {
    document.getElementById("employee-card").innerHTML = `<div class="alert alert-warning">${msg}</div>`;
}

function editemployees(employeeId, oldEmployee) {
    // Si el input está vacío, usa el valor anterior
    const nombre = document.getElementById("input-nombre").value || oldEmployee.nombre;
    const apellidos = document.getElementById("input-apellidos").value || oldEmployee.apellidos;
    const telefono = document.getElementById("input-telefono").value || oldEmployee.telefono;
    const correo = document.getElementById("input-correo").value || oldEmployee.correo;
    const direccion = document.getElementById("input-direccion").value || oldEmployee.direccion;
    const fecha_nacimiento = document.getElementById("input-fecha-nacimiento").value || oldEmployee.fecha_nacimiento;
    const curp = document.getElementById("input-curp").value || oldEmployee.curp;
    const rfc = document.getElementById("input-rfc").value || oldEmployee.rfc;
    const horario = document.getElementById("input-horario").value || oldEmployee.horario;
    const sueldo = document.getElementById("input-sueldo").value || oldEmployee.sueldo;
    const puesto = document.getElementById("input-puesto").value || oldEmployee.puesto;
    const antiguedad = document.getElementById("input-antiguedad").value || oldEmployee.antiguedad;

    const updatedEmployee = { nombre, apellidos, telefono, correo, direccion, fecha_nacimiento, curp, rfc, horario, sueldo, puesto, antiguedad };

    axios({
        method: 'put',
        url: `http://localhost:3000/employees/${employeeId}`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        data: updatedEmployee
    })
        .then(function (res) {
            if (res.data.code === 200) {
                mostrarMensaje("Empleado actualizado correctamente.");
            } else {
                mostrarMensaje("Ocurrió un error al actualizar el empleado.");
            }
        })
        .catch(function (err) {
            mostrarMensaje("Error en la solicitud.");
            console.error("Error en la solicitud: ", err);
        });
}
