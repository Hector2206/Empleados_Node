export function tieneAsistenciaHoy(empleadoId, headers, callback) {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const anio = hoy.getFullYear();
    const hoyStr = hoy.toISOString().split('T')[0];
    axios.get(`http://localhost:3000/asistencias/${empleadoId}?mes=${mes}&anio=${anio}`, headers)
        .then(function(res) {
            const asistencias = res.data.message;
            const asistenciaHoy = asistencias.find(a => a.fecha === hoyStr && a.presente === 1);
            callback(!!asistenciaHoy);
        })
        .catch(function() {
            callback(false);
        });
}