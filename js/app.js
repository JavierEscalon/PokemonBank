
//logica para el funcionamiento del boton 'salir' en el navbar

// esperamos a que todo el html este cargado
document.addEventListener('DOMContentLoaded', function() {

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
});