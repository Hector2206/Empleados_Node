function registrarAsistenciaTodos() {
    axios.post('http://localhost:3000/asistencias/registrar-todos', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(function(res) {
        alert("Asistencia registrada para todos los empleados.");
        // Si quieres, recarga la lista de empleados o asistencias aquí
    })
    .catch(function(err) {
        alert("No se pudo registrar la asistencia.");
    });
}

function quitarAsistencia(empleadoId) {
    axios.post(`http://localhost:3000/asistencias/quitar/${empleadoId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(function(res) {
        alert("Asistencia quitada para el empleado.");
        // Si quieres, recarga la lista de empleados o asistencias aquí
    })
    .catch(function(err) {
        alert("No se pudo quitar la asistencia.");
    });
}

function registrarAsistenciaIndividual(empleadoId) {
    axios.post(`http://localhost:3000/asistencias/registrar-individual/${empleadoId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(function(res) {
        alert("Asistencia registrada para el empleado.");
        // Si quieres, recarga la lista de empleados o asistencias aquí
    })
    .catch(function(err) {
        alert("No se pudo registrar la asistencia individual.");
    });
}

window.registrarAsistenciaTodos = registrarAsistenciaTodos;
window.quitarAsistencia = quitarAsistencia;
window.registrarAsistenciaIndividual = registrarAsistenciaIndividual;