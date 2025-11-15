document.addEventListener('DOMContentLoaded', function() {

    // 1 leemos las transacciones del localstorage
    var transacciones = JSON.parse(localStorage.getItem('transacciones'));

    // 2 procesamos los datos
    var cantidadDepositos = 0;
    var cantidadRetiros = 0;
    var cantidadServicios = 0;

    if (transacciones) {
        transacciones.forEach(function(trans) {
            if (trans.tipo === 'Depósito') {
                cantidadDepositos++; // aumenta 1 al contador
            } else if (trans.tipo === 'Retiro') {
                cantidadRetiros++;   // aumenta 1 al contador
            } else if (trans.tipo === 'Servicio') {
                cantidadServicios++; // aumenta 1 al contador
            }
        });
    }

    // 3 buscar el canvas
    var ctx = document.getElementById('miGrafico').getContext('2d');

    // 4 definir los datos para el grafico dinamicos
    var datos = {
        labels: [
            'depositos (' + cantidadDepositos + ')',
            'retiros (' + cantidadRetiros + ')',
            'pago de servicios (' + cantidadServicios + ')'
        ],
        datasets: [{
            label: 'Número de transacciones',
            data: [cantidadDepositos, cantidadRetiros, cantidadServicios], // datos dinamicos
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
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Conteo de Transacciones por Tipo'
                }
            }
        }
    };

    // 6 crear el grafico
    var miGrafico = new Chart(ctx, configuracion);
});