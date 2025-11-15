// esperamos a que todo el html este cargado
document.addEventListener('DOMContentLoaded', function() {

    /**
     * definimos las reglas de validacion para los montos
     * usando la libreria validate.js
     */
    const reglasDeValidacion = {
        // el nombre 'monto' debe coincidir con el que usaremos
        monto: {
            // el monto debe existir
            presence: {
                message: "^El monto no puede estar vacío."
            },
            // debe ser un numero
            numericality: {
                // no puede ser solo ceros
                greaterThan: 0, 
                message: "^El monto debe ser un número mayor a 0."
            }
        }
    };

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
        swal("transaccion exitosa", descripcion + " por $" + monto.toFixed(2), "success").then(function() {
            // cuando el usuario cierre la alerta de exito, generamos el pdf
            generarComprobante(nuevaTransaccion);
        });

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
                // 1 validamos usando la libreria
                // creamos un objeto {monto: valor} para que coincida con nuestras 'reglas'
                var errores = validate({ monto: valor }, reglasDeValidacion);

                if (errores) {
                    // si hay errores, mostramos el primer mensaje de error
                    // el error[0] saca el primer mensaje del array de errores
                    swal("Error de validación", errores.monto[0], "warning");
                } else {
                    // no hay errores, procedemos
                    var monto = parseFloat(valor);
                    realizarTransaccion('Depósito', 'Depósito en cajero', monto);
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
                var errores = validate({ monto: valor }, reglasDeValidacion);
                if (errores) {
                    swal("Error de validación", errores.monto[0], "warning");
                } else {
                    var monto = parseFloat(valor);
                    realizarTransaccion('Retiro', 'Retiro en cajero', monto);
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
                var errores = validate({ monto: valor }, reglasDeValidacion);
                if (errores) {
                    swal("Error de validación", errores.monto[0], "warning");
                } else {
                    var monto = parseFloat(valor);
                    realizarTransaccion('Servicio', 'Pago de servicio', monto); 
                }
            });
        });
    }    

});

/**
 * esta funcion genera un comprobante en pdf usando jspdf
 * con los datos de una transaccion especifica
 */
function generarComprobante(transaccion) {
    // esto es necesario para que jspdf funcione bien
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // --- 1 obtenemos datos guardados ---
    var usuario = localStorage.getItem('usuario');
    var cuenta = localStorage.getItem('cuenta');
    var saldo = parseFloat(localStorage.getItem('saldo')).toFixed(2);
    var fecha = new Date().toLocaleString('es-SV'); // formato local dd/mm/aaaa, hh:mm:ss

    // --- 2 dibujamos el pdf ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Pokemon Bank - Comprobante', 105, 20, { align: 'center' }); // titulo

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Fecha: ${fecha}`, 20, 40);
    doc.text(`Cliente: ${usuario}`, 20, 50);
    doc.text(`Cuenta: ${cuenta}`, 20, 60);
    
    // linea divisoria
    doc.line(20, 70, 190, 70); 

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Detalle de la Transaccion', 20, 80);

    doc.setFont('Helvetica', 'normal');
    doc.text(`Tipo: ${transaccion.tipo}`, 20, 90);
    doc.text(`Descripcion: ${transaccion.descripcion}`, 20, 100);

    // formateamos el monto
    var montoFormateado = transaccion.monto.toFixed(2);
    doc.setFont('Helvetica', 'bold');
    if (transaccion.tipo === 'Depósito') {
        doc.text(`Monto: +$${montoFormateado}`, 20, 110);
    } else {
        doc.text(`Monto: -$${montoFormateado}`, 20, 110);
    }
    
    // linea divisoria
    doc.line(20, 120, 190, 120);

    doc.setFontSize(16);
    doc.text(`Nuevo Saldo: $${saldo}`, 20, 130);

    // --- 3 guardamos el archivo ---
    doc.save('comprobante-pokemon-bank.pdf');
}
