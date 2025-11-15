
// esperamos a que la pagina cargue
document.addEventListener('DOMContentLoaded', function() {

    // Definimos valores del usuario
    const pinCorrecto = '1234';
    const nombreUsuario = 'Ash Ketchum';
    const numeroCuenta = '0987654321';
    const saldoInicial = 500.00;

    // buscamos el formulario
    var loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', function(evento) {

        // 1 evitamos que el formulario se envie solo
        evento.preventDefault(); 

        // 2 obtenemos el valor del pin
        var pinIngresado = document.getElementById('pin').value;

        // 3 comparamos
        if (pinIngresado === pinCorrecto) {

            // verificamos si el usuario ya existe en localStorage
            // si no existe, lo creamos
            if (localStorage.getItem('usuario') === null) {

            // guardamos los datos del usuario por primera vez
            localStorage.setItem('usuario', nombreUsuario);
            localStorage.setItem('cuenta', numeroCuenta);
            localStorage.setItem('saldo', saldoInicial.toString()); // saldo inicial

            // guardamos las transacciones iniciales (como texto json)
            var transaccionesIniciales = [
                { fecha: new Date().toISOString().slice(0, 10), tipo: 'Depósito', descripcion: 'Deposito inicial', monto: saldoInicial }
            ];
            // stringify convierte un array en un simple texto para guardarlo
            localStorage.setItem('transacciones', JSON.stringify(transaccionesIniciales));
        }

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