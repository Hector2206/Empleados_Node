// addemployees.js
window.onload = init;

function init() {
    if (localStorage.getItem("token")) {
        document.getElementById('form-agregar').addEventListener('submit', function(e) {
            e.preventDefault();

            // Validación de horario: "HH:MM - HH:MM"
            const horario = document.getElementById('horario').value.trim();
            const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)\s*-\s*([01]\d|2[0-3]):([0-5]\d)$/;
            if (!horarioRegex.test(horario)) {
                document.getElementById('mensaje').innerHTML = `<div class="alert alert-warning">El formato de horario debe ser HH:MM - HH:MM, por ejemplo: 13:00 - 21:00</div>`;
                return;
            }

            // Validación de sueldo: número positivo
            const sueldo = document.getElementById('sueldo').value.trim();
            if (isNaN(sueldo) || Number(sueldo) <= 0) {
                document.getElementById('mensaje').innerHTML = `<div class="alert alert-warning">El sueldo debe ser un número positivo. Ejemplo: 8500.50</div>`;
                return;
            }

            const data = {
                nombre: document.getElementById('nombre').value,
                apellidos: document.getElementById('apellidos').value,
                telefono: document.getElementById('telefono').value,
                correo: document.getElementById('correo').value,
                direccion: document.getElementById('direccion').value,
                fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
                curp: document.getElementById('curp').value,
                rfc: document.getElementById('rfc').value,
                horario: horario,
                sueldo: sueldo,
                puesto: document.getElementById('puesto').value,
                antiguedad: document.getElementById('antiguedad').value
            };

            axios.post('http://localhost:3000/employees', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(function(res) {
                document.getElementById('mensaje').innerHTML = `<div class="alert alert-success">Empleado agregado correctamente</div>`;
                document.getElementById('form-agregar').reset();
            })
            .catch(function(err) {
                document.getElementById('mensaje').innerHTML = `<div class="alert alert-danger">Error al agregar empleado</div>`;
            });
        });
    } else {
        window.location.href = "index.html";
    }
}
