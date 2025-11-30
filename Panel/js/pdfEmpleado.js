function generarPDFEmpleado(id) {
    axios.get(`http://localhost:3000/employees/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(function(res) {
        const emp = res.data.message;
        const doc = new window.jspdf.jsPDF();

        // Título principal
        doc.setFontSize(18);
        doc.text("Ficha de Empleado", 105, 18, { align: "center" });

        // Subtítulo
        doc.setFontSize(12);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 105, 26, { align: "center" });

        // Línea separadora
        doc.line(15, 30, 195, 30);

        // Datos del empleado
        let y = 40;
        doc.setFontSize(13);
        doc.text(`Nombre completo:`, 15, y);
        doc.setFontSize(12);
        doc.text(`${emp.nombre} ${emp.apellidos}`, 60, y);

        y += 10;
        doc.setFontSize(13);
        doc.text(`Puesto/Área:`, 15, y);
        doc.setFontSize(12);
        doc.text(`${emp.puesto}`, 60, y);

        y += 10;
        doc.setFontSize(13);
        doc.text(`Teléfono:`, 15, y);
        doc.setFontSize(12);
        doc.text(`${emp.telefono}`, 60, y);

        y += 10;
        doc.setFontSize(13);
        doc.text(`Correo electrónico:`, 15, y);
        doc.setFontSize(12);
        doc.text(`${emp.correo}`, 60, y);

        y += 10;
        doc.setFontSize(13);
        doc.text(`Dirección:`, 15, y);
        doc.setFontSize(12);
        doc.text(`${emp.direccion}`, 60, y);

        y += 10;
        doc.setFontSize(13);
        doc.text(`Fecha de nacimiento:`, 15, y);
        doc.setFontSize(12);
        const fechaNacimiento = emp.fecha_nacimiento ? emp.fecha_nacimiento.split('T')[0] : '';
        doc.text(`${fechaNacimiento}`, 60, y);

        y += 10;
        doc.setFontSize(13);
        doc.text(`CURP:`, 15, y);
        doc.setFontSize(12);
        doc.text(`${emp.curp}`, 60, y);

        y += 10;
        doc.setFontSize(13);
        doc.text(`RFC:`, 15, y);
        doc.setFontSize(12);
        doc.text(`${emp.rfc}`, 60, y);

        y += 10;
        doc.setFontSize(13);
        doc.text(`Horario laboral:`, 15, y);
        doc.setFontSize(12);
        doc.text(`${emp.horario} hrs`, 60, y);

        y += 10;
        doc.setFontSize(13);
        doc.text(`Sueldo:`, 15, y);
        doc.setFontSize(12);
        doc.text(`$${emp.sueldo} MXN`, 60, y);

        y += 10;
        doc.setFontSize(13);
        doc.text(`Antigüedad:`, 15, y);
        doc.setFontSize(12);
        doc.text(`${emp.antiguedad} año${emp.antiguedad == 1 ? '' : 's'}`, 60, y);

        doc.save(`empleado_${emp.nombre}_${emp.apellidos}.pdf`);
    })
    .catch(function(err) {
        alert("No se pudo generar el PDF.");
    });
}