function consultarNominasEmpleado(empleadoId) {
    axios.get(`http://localhost:3000/nominas/empleado/${empleadoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(function(res) {
        mostrarNominas(res.data.message, empleadoId);
    })
    .catch(function(err) {
        alert("No se pudieron obtener las nóminas.");
    });
}

function mostrarNominas(nominas, empleadoId) {
    let html = "<h6>Nóminas</h6><ul>";
    nominas.forEach(nomina => {
        html += `<li>${nomina.fecha}: $${nomina.total} (Bono: $${nomina.bono})</li>`;
    });
    html += "</ul>";
    document.getElementById(`nominas-empleado-${empleadoId}`).innerHTML = html;
}

//Consultar nómina de un empleado para un mes específico

function consultarNominaMes(empleadoId, mes, anio) {
    axios.get(`http://localhost:3000/nominas/empleado/${empleadoId}/mes?mes=${mes}&anio=${anio}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(function(res) {
        // res.data.message es un array (debería ser solo una nómina)
        mostrarNominas(res.data.message);
    })
    .catch(function(err) {
        alert("No se pudo obtener la nómina del mes.");
    });
}

function consultarBonosEmpleado(empleadoId) {
    axios.get(`http://localhost:3000/nominas/empleado/${empleadoId}/bonos`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(function(res) {
        mostrarBonos(res.data.message, empleadoId);
    })
    .catch(function(err) {
        alert("No se pudieron obtener los bonos.");
    });
}

function mostrarBonos(bonos, empleadoId) {
    let html = "<h6>Historial de Bonos</h6><ul>";
    bonos.forEach(bono => {
        html += `<li>${bono.fecha}: $${bono.bono}</li>`;
    });
    html += "</ul>";
    document.getElementById(`bonos-empleado-${empleadoId}`).innerHTML = html;
}