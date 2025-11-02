
// esperamos a que la pagina cargue
document.addEventListener('DOMContentLoaded', function() {

    // pin correcto para simular
    const pinCorrecto = '1234';

    // buscamos el formulario
    var loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', function(evento) {

        // 1 evitamos que el formulario se envie solo
        evento.preventDefault(); 

        // 2 obtenemos el valor del pin
        var pinIngresado = document.getElementById('pin').value;

        // 3 comparamos
        if (pinIngresado === pinCorrecto) {
            // si es correcto, inicializamos la base de datos

            // guardamos los datos del usuario
            localStorage.setItem('usuario', 'Francisco Rosales');
            localStorage.setItem('cuenta', '1234-5678');
            localStorage.setItem('saldo', '1500'); // saldo inicial

            // guardamos las transacciones iniciales (como texto json)
            var transaccionesIniciales = [
                { fecha: '2025-10-30', tipo: 'Depósito', descripcion: 'Deposito inicial', monto: 1500 }
            ];
            // stringify convierte un array en un simple texto para guardarlo
            localStorage.setItem('transacciones', JSON.stringify(transaccionesIniciales));

            // todo salio bien, lo mandamos a la pagina de acciones
            window.location.href = 'acciones.html';

        } else {
            // si es incorrecto, mostramos una alerta

            swal("PIN Incorrecto", "El PIN de 4 digitos no es valido.", "error");

            // limpiamos el campo
            document.getElementById('pin').value = '';
        }
    });
});