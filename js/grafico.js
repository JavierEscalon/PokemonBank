document.addEventListener('DOMContentLoaded', function() {

    // 1 leemos las transacciones del localstorage
    var transacciones = JSON.parse(localStorage.getItem('transacciones'));

    // 2 procesamos los datos
    var totalDepositos = 0;
    var totalRetiros = 0;
    var totalServicios = 0;

    if (transacciones) {
        transacciones.forEach(function(trans) {
            if (trans.tipo === 'Depósito') {
                totalDepositos += trans.monto;
            } else if (trans.tipo === 'Retiro') {
                totalRetiros += trans.monto;
            } else if (trans.tipo === 'Servicio') {
                totalServicios += trans.monto;
            }
        });
    }

    // 3 buscar el canvas
    var ctx = document.getElementById('miGrafico').getContext('2d');

    // 4 definir los datos para el grafico dinamicos
    var datos = {
        labels: [
            'depositos',
            'retiros',
            'pago de servicios'
        ],
        datasets: [{
            label: 'resumen de transacciones',
            data: [totalDepositos, totalRetiros, totalServicios], // datos dinamicos
            backgroundColor: [
                'rgb(75, 192, 192)',
                'rgb(255, 99, 132)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    };

    // 5 configurar el grafico
    var configuracion = {
        type: 'doughnut',
        data: datos,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    };

    // 6 crear el grafico
    var miGrafico = new Chart(ctx, configuracion);
});