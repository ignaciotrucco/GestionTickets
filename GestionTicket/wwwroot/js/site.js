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
    $("#TipoSistemaError").text("");
    $("#FechaInicioError").text("");
    $("#TiempoEstimadoError").text("");

    let tareaID = $("#TareaID").val();
    let tipoSistema = $("#TipoSistema").val();
    let fechaInicio = $("#FechaInicio").val();
    let tiempoEstimado = $("#TiempoEstimado").val();
    let observaciones = $("#Observaciones").val();

    let guardado = true;

    if (tipoSistema == 0) {
        $("#TipoSistemaError").text("Debe seleccionar un sistema");
        guardado = false;
    }
    if (fechaInicio == "") {
        $("#FechaInicioError").text("Debe seleccionar una fecha");
        guardado = false;
    }
    if (tiempoEstimado == "") {
        $("#TiempoEstimadoError").text("Debe estimar un tiempo");
        guardado = false;
    }

    if (guardado) {
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
}

//OCULTAR SUBTAREAS SI EL TIPO DE TAREA ES SIMPLE
function mostrarOcultarSubtarea() {
    let tareaSimple = document.getElementById("estadoTarea").value;

    console.log("Valor de tareaSimple:", tareaSimple);

    let cardSubtareas = document.getElementById("subtarea");

    if (tareaSimple === "true") {
        cardSubtareas.style.display = 'none';
    }
    else {
        cardSubtareas.style.display = 'block';
    }
}

// Ejecutar la función al cargar el documento
$(document).ready(function () {
    if ($("#vistaCompletarTareas").length) {
        mostrarOcultarSubtarea();
    }
});