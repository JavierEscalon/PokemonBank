// esperamos a que todo el html este cargado
document.addEventListener('DOMContentLoaded', function() {

    //logica para el funcionamiento del boton salir en el navbar

    // buscamos el boton de salir por su id
    var botonSalir = document.getElementById('btnSalir');

    // verificamos si el boton existe en esta pagina
    if(botonSalir) {
        
        // le decimos que escuche cuando alguien le haga clic
        botonSalir.addEventListener('click', function() {
            
            // aqui usamos sweetalert
            swal({
                title: "estas seguro?",
                text: "seguro que quieres salir de tu cuenta?",
                icon: "warning",
                buttons: ["cancelar", "si, salir"], // texto de los botones
                dangerMode: true,
            })
            .then(function(vaASalir) {
                // 'vaASalir' sera 'true' si presiona 'si, salir'
                // y 'false' si presiona 'cancelar' o la 'x'
                if (vaASalir) {
                    // lo mandamos de vuelta al login
                    window.location.href = 'index.html';
                }
            });
        });
    }

        // funcion para cargar datos del navbar
    function cargarDatosNavbar() {
        var usuario = localStorage.getItem('usuario');
        var cuenta = localStorage.getItem('cuenta');

        // si existen los datos, los ponemos
        if(usuario && cuenta) {
            document.getElementById('nav-usuario').textContent = usuario;
            document.getElementById('nav-cuenta').textContent = cuenta;
        }
    }


    // funcion para cargar el saldo en acciones.html
    function cargarSaldo() {
        // buscamos el elemento
        var elementoSaldo = document.getElementById('saldo-actual');

        // elementoSaldo solo existe en acciones.html
        // si existe, le ponemos el saldo
        if(elementoSaldo) {
            var saldo = localStorage.getItem('saldo');

            // formateamos el saldo como dinero
            var saldoFormateado = parseFloat(saldo).toFixed(2);
            elementoSaldo.textContent = '$' + saldoFormateado;
        }
    }

    // --- llamamos a las funciones ---
    cargarDatosNavbar();
    cargarSaldo();


    // funcion para anadir una transaccion y actualizar saldo
    function realizarTransaccion(tipo, descripcion, monto) {

        // --- actualizar saldo ---
        var saldoActual = parseFloat(localStorage.getItem('saldo'));
        var nuevoSaldo = 0;

        if (tipo === 'Depósito') {
            nuevoSaldo = saldoActual + monto;
        } else { // 'Retiro' o 'Servicio'
            if (monto > saldoActual) {
                // si no hay fondos, mostramos error y paramos
                swal("fondos insuficientes", "no tienes saldo para esta transaccion.", "error");
                return; // detiene la funcion
            }
            nuevoSaldo = saldoActual - monto;
        }

        // guardamos el nuevo saldo
        localStorage.setItem('saldo', nuevoSaldo.toString());

        // --- registrar la transaccion ---

        // 'parse' convierte el texto de vuelta a un array
        var transacciones = JSON.parse(localStorage.getItem('transacciones'));

        // creamos la nueva transaccion
        var nuevaTransaccion = {
            fecha: new Date().toISOString().slice(0, 10), // fecha de hoy
            tipo: tipo,
            descripcion: descripcion,
            monto: monto
        };

        // la anadimos al inicio del array
        transacciones.unshift(nuevaTransaccion); 

        // guardamos el array actualizado convertido en texto
        localStorage.setItem('transacciones', JSON.stringify(transacciones));

        // --- exito ---
        swal("transaccion exitosa", descripcion + " por $" + monto.toFixed(2), "success");

        // actualizamos el saldo en la pagina
        cargarSaldo();
    }


    // --- listeners para los botones ---

    var btnDepositar = document.getElementById('btnDepositar');
    var btnRetirar = document.getElementById('btnRetirar');
    var btnPagar = document.getElementById('btnPagar');

    // si estamos en la pagina de acciones donde existen los botones
    if(btnDepositar) {

        btnDepositar.addEventListener('click', function() {
            swal({
                title: "depositar dinero",
                text: "ingresa el monto a depositar:",
                content: "input", // esto crea un campo de texto
                button: "depositar",
            })
            .then(function(valor) {
                var monto = parseFloat(valor);
                if (monto > 0) {
                    realizarTransaccion('Depósito', 'Depósito en cajero', monto);
                } else {
                    swal("monto invalido", "por favor ingresa un numero valido.", "warning");
                }
            });
        });

        btnRetirar.addEventListener('click', function() {
            swal({
                title: "retirar dinero",
                text: "ingresa el monto a retirar:",
                content: "input",
                button: "retirar",
            })
            .then(function(valor) {
                var monto = parseFloat(valor);
                if (monto > 0) {
                    realizarTransaccion('Retiro', 'Retiro en cajero', monto);
                } else {
                    swal("monto invalido", "por favor ingresa un numero valido.", "warning");
                }
            });
        });

        btnPagar.addEventListener('click', function() {
            swal({
                title: "pagar servicio",
                text: "ingresa el monto a pagar:",
                content: "input",
                button: "pagar",
            })
            .then(function(valor) {
                var monto = parseFloat(valor);
                if (monto > 0) {
                    // tu puedes cambiar pago de servicio por algo mas especifico
                    realizarTransaccion('Servicio', 'Pago de servicio', monto); 
                } else {
                    swal("monto invalido", "por favor ingresa un numero valido.", "warning");
                }
            });
        });
    }    

});


