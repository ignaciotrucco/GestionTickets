// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
document.addEventListener('DOMContentLoaded', () => {

})

function crearTarea() {
    var tituloTarea = document.getElementById('TituloTarea').value;
    var tipoTarea = document.getElementById('TipoTarea').value;
    var userId = document.getElementById('UserId').value;

    var erroresInput = 0;

    document.getElementById('TituloTareaError').style.display = 'none';
    if (tituloTarea == '') {
        document.getElementById('TituloTareaError').style.display = 'block';
        erroresInput++;
    }

    document.getElementById('TipoTareaError').style.display = 'none';
    if (tipoTarea == 0) {
        document.getElementById('TipoTareaError').style.display = 'block';
        erroresInput++;
    }

    if (erroresInput > 0) {
        return;
    }

    $.ajax({
        url: '../../Home/CrearTarea',
        data: { tituloTarea, tipoTarea, userId },
        type: 'POST',
        dataType: 'json',
        success: function (result) {
            $('#ModalCrearTarea').modal('hide');
            vaciarCampos();

            location.replace(result.urlCompleta);
        },
        error: function (xrs, status) {
            console.log('Ocurrió un error a la hora de almacenar la tarea.')
        }
    })
}

function vaciarCampos() {
    document.getElementById('TituloTarea').value = '';
    document.getElementById('TipoTarea').value = 0;
    document.getElementById('UserId').value = '';

    document.getElementById('TituloTareaError').style.display = 'none';
    document.getElementById('TipoTareaError').style.display = 'none';
}

function EditarTarea() {
    let tareaID = $("#TareaID").val();
    let tipoSistema = $("#TipoSistema").val();
    let fechaInicio = $("#FechaInicio").val();
    let tiempoEstimado = $("#TiempoEstimado").val();
    let observaciones = $("#Observaciones").val();
    
    $.ajax({
        url: '../../Home/CompletarTarea',
        data: { TareaID: tareaID, TipoSistemaID: tipoSistema, FechaInicio: fechaInicio, TiempoEstimado: tiempoEstimado, Observaciones: observaciones },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado != "") {
                Swal.fire(resultado);
                //REDIRIGIR A PAGINA DE INICIO
                setTimeout("location.href = '../../Home/Index';", 1500)
            }
        },
        error: function (xrs, status) {
            alert("Ocurrió un error a la hora de completar la tarea.");
        }
    });
}

function GuardarSubtarea(){
    var subtarea = document.getElementById('Descripcion').value;
    let tareaID = $("#TareaID").val();

    $.ajax({
        url: '../../Home/GuardarSubtarea',
        data: { tareaID, subtarea },
        type: 'POST',
        datatype: 'json',
        success: function(resultado){
            if(resultado.success){
                document.getElementById('Descripcion').value = '';
                console.log(resultado.subtarea);
                $('#listaSubTareas').append(`
                    <div class="divSubtarea d-flex align-items-center justify-content-between">
                        <span> ${resultado.subtarea.descripcion}</span>
                        <button class="btn"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                `)
            }
        },
        error: function(xrs, status){
            console.log('Se produjo un error a la hora de almacenar la subtarea.');
        }
    })
}