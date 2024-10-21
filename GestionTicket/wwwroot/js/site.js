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
        success: function (nuevaTareaId) {

            console.log(nuevaTareaId)

            if (nuevaTareaId == 0) {
                alert("error al cargar la pagina");
            }
            else {
                $('#ModalCrearTarea').modal('hide');
                vaciarCampos();

                location.href = `/Home/TareaCompleta/${nuevaTareaId}`;
            }
        },
        error: function (xrs, status) {
            console.log('Ocurrió un error a la hora de almacenar la tarea.')
        }
    });
}

function vaciarCampos() {
    document.getElementById('TituloTarea').value = '';
    document.getElementById('TipoTarea').value = 0;
    document.getElementById('UserId').value = '';

    document.getElementById('TituloTareaError').style.display = 'none';
    document.getElementById('TipoTareaError').style.display = 'none';
}

function CompletarTarea() {
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

function AbrirModalEditar(tareaID) {
    $.ajax({
        url: '../../Home/DetalleTarea',
        data: {tareaId: tareaID},
        type: 'POST',
        dataType: 'json',
        success: function (tareasMostrar) {
        let tareaMostrar = tareasMostrar[0];

        $("#TareaIDEditar").val(tareaID);
        $("#TituloTareaEditar").val(tareaMostrar.tituloTarea);
        $("#TipoTareaEditar").val(tareaMostrar.tipoTareaID);
        $("#TipoSistemaEditar").val(tareaMostrar.tipoSistemaID);
        $("#FechaInicioEditar").val(tareaMostrar.fechaInicio);
        $("#TiempoEstimadoEditar").val(tareaMostrar.tiempoEstimado);
        $("#ObservacionesEditar").val(tareaMostrar.observaciones);

        $("#ModalEditar").modal("show");


        },
        error: function () {
            alert('Disculpe, existió un problema al cargar las tareas.');
        }
    });
}

function EditarTarea() {

    let tareaIDEditar = $("#TareaIDEditar").val();
    let tituloEditar = $("#TituloTareaEditar").val();
    let tipoTareaEditar = $("#TipoTareaEditar").val();
    let tipoSistemaEditar = $("#TipoSistemaEditar").val();
    let fechaInicioEditar = $("#FechaInicioEditar").val();
    let tiempoEstimadoEditar = $("#TiempoEstimadoEditar").val();
    let observacionesEditar = $("#ObservacionesEditar").val();

    $.ajax({
        url: '../../Home/EditarTarea',
        data: { TareaID: tareaIDEditar, TipoTareaID: tipoTareaEditar, TituloTarea: tituloEditar, TipoSistemaID: tipoSistemaEditar, FechaInicio: fechaInicioEditar, TiempoEstimado: tiempoEstimadoEditar, Observaciones: observacionesEditar },
        type: 'POST',
        dataType: 'json',
        success: function (resultado) {
            if (resultado != "") {
                Swal.fire(resultado);
            }
            ListadoTarea()
        },
        error: function (xrs, status) {
            alert("Ocurrió un error a la hora de completar la tarea.");
        }
    });

}


