document.addEventListener('DOMContentLoaded', function() {

    // leemos las transacciones
    var transacciones = JSON.parse(localStorage.getItem('transacciones'));
    var tablaBody = document.getElementById('tabla-historial');

    if (transacciones && transacciones.length > 0) {

        // ordenamos el array por fecha, de mas nuevo a mas viejo
        transacciones.sort(function(a, b) {
            // convertimos las fechas de texto a objetos de fecha para compararlas
            // b - a nos da un orden descendente (mas nuevo primero)
            return new Date(b.fecha) - new Date(a.fecha);
        });

        // si hay transacciones, las recorremos
        transacciones.forEach(function(trans) {

            // creamos una nueva fila
            var fila = document.createElement('tr');

            // definimos el color del 'badge' segun el tipo
            var badgeColor = '';
            var signo = '';
            var colorTexto = 'text-dark'; // default

            if (trans.tipo === 'Depósito') {
                badgeColor = 'bg-success';
                signo = '+';
                colorTexto = 'text-success';
            } else if (trans.tipo === 'Retiro') {
                badgeColor = 'bg-danger';
                signo = '-';
                colorTexto = 'text-danger';
            } else { // servicio
                badgeColor = 'bg-warning text-dark'; // bg-warning necesita text-dark
                signo = '-';
                colorTexto = 'text-danger';
            }

            // llenamos la fila con los datos
            fila.innerHTML = `
                <td>${trans.fecha}</td>
                <td><span class="badge ${badgeColor}">${trans.tipo}</span></td>
                <td>${trans.descripcion}</td>
                <td class="${colorTexto} fw-bold">${signo}$${trans.monto.toFixed(2)}</td>
            `;

            // anadimos la fila a la tabla
            tablaBody.appendChild(fila);
        });

    } else {
        // si no hay transacciones
        tablaBody.innerHTML = '<tr><td colspan="4" class="text-center">no hay transacciones.</td></tr>';
    }
});