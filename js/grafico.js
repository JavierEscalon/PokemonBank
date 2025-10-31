// esperamos a que todo el html este cargado
document.addEventListener('DOMContentLoaded', function() {

    // 1 buscar el canvas por su id
    // 'ctx' es la abreviatura de 'contexto', es el canvas donde vamos a dibujar
    var ctx = document.getElementById('miGrafico').getContext('2d');

    // 2 definir los datos para el grafico
    // estos son los datos que inventamos en historial.html
    var datos = {
        labels: [
            'depositos',
            'retiros',
            'pago de servicios'
        ],
        datasets: [{
            label: 'resumen de transacciones',
            // aqui van los montos (solo positivos para el grafico)
            data: [1500, 300, 95], 
            
            // aqui van los colores de cada seccion
            backgroundColor: [
                'rgb(75, 192, 192)',  // un color verde/agua para depositos
                'rgb(255, 99, 132)',  // un color rojo para retiros
                'rgb(255, 205, 86)'   // un color amarillo para servicios
            ],
            hoverOffset: 4
        }]
    };

    // 3 configurar el grafico
    // le decimos que queremos un grafico de tipo 'dona'
    var configuracion = {
        type: 'doughnut',
        data: datos,
    };

    // 4 crear el grafico!
    // esta linea le dice a chart.js que dibuje el grafico en nuestro lienzo
    var miGrafico = new Chart(ctx, configuracion);

});