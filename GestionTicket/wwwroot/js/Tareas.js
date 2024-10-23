window.onload = ListadoTarea;

function ListadoTarea() {
    $.ajax({
        url: '../../Home/ListadoTarea',
        type: 'POST',
        dataType: 'json',
        success: function (tareasMostrar) {
            $("#ModalEditar").modal("hide");

            let contenidoCards = `<div class="row justify-content-center">`;

            $.each(tareasMostrar, function (index, tipoTarea) {
                let collapseId = `collapseTipoTarea${index}`;
                contenidoCards += `
                <div class="col-12 col-sm-6 col-lg-4 mb-3">  
                    <div class="card Card_tamaño h-100"> 
                        <div class="card-header text-white bg-primary" data-bs-toggle="collapse" data-bs-target="#${collapseId}" style="cursor: pointer;">
                            ${tipoTarea.nombretipotarea}
                        </div>
                        <div id="${collapseId}" class="collapse" aria-labelledby="heading${index}" data-bs-parent="#accordionTareas">
                            <div class="card-body">
                                <div class="row">
            `;

                $.each(tipoTarea.listadoDelasTareas, function (index, tarea) {
                    contenidoCards += `
                    <div class="col-12 mb-2">  
                        <div class="card">
                            <table class="m-2">
                                <tbody>
                                    <tr>
                                        <td style="width: 60%; vertical-align: middle;">${tarea.tituloTarea}</td>
                                        <td style="width: 40%; text-align: right;">
                                            <button title="Editar" class="btn-sm btn-outline-primary tamaño_boton" onclick="AbrirModalEditar(${tarea.tareaID})">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button title="Detalle" class="btn-sm btn-outline-primary tamaño_boton" onclick="DetalleTarea(${tarea.tareaID})">
                                                <i class="fa-solid fa-magnifying-glass"></i>
                                            </button>
                                            <button title="Completar" class="btn-sm btn-outline-primary tamaño_boton" onclick="completarTarea(${tarea.tareaID})">
                                                <i class="fa-solid fa-check"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    `;
                });

                contenidoCards += `
                                    </div>  
                                </div>  
                            </div>  
                        </div>  
                    </div> 
                `;
            });

            contenidoCards += `</div>`;
            document.getElementById("TareaContainer").innerHTML = contenidoCards;

        },
        error: function () {
            alert('Disculpe, existió un problema al cargar las tareas.');
        }
    });
}




function DetalleTarea(tareaId) {
    $.ajax({
        url: '../../Home/DetalleTarea',
        type: 'POST',
        data: { tareaId: tareaId },
        dataType: 'json',
        success: function (detalleTareasMostrar) {
            console.log(detalleTareasMostrar);
            let contenido = ``;

            $.each(detalleTareasMostrar, function (index, detalle) {
                contenido += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title text-center mb-2">${detalle.tituloTarea}</h5> 
                        <p><b>Sistema:</b> ${detalle.nombretiposistema || '----'}</p>
                        <p><b>Fecha de Inicio:</b> ${detalle.fechaIniciostring || '----'}</p>
                        <p><b>Tiempo Estimado:</b> ${detalle.tiempoEstimado ? detalle.tiempoEstimado + 'hs' : '----'}</p>
                        <p><b>Observaciones:</b> ${detalle.observaciones || '----'}</p>
                        <h6><b>Pendiente:</b></h6>
                        `;

                $.each(detalle.subtareas, function (index, subtarea) {
                    contenido += `
                        <p>${subtarea.descripcion || 'Sin subtareas'}</p>
                        `;
                });
                contenido += `</div>
                </div>`
            });


            document.getElementById("Detalle").innerHTML = contenido;

            $('#DetalleModal').modal('show');
        },
        error: function () {
            alert("Error al cargar los detalles de la tarea.");
        }
    });
}

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

function GuardarSubtarea() {
    var subtarea = document.getElementById('Descripcion').value;
    let tareaID = $("#TareaID").val();
    $.ajax({
        url: '../../Home/GuardarSubtarea',
        data: { tareaID, subtarea },
        type: 'POST',
        datatype: 'json',
        success: function (resultado) {
            if (resultado.success) {
                document.getElementById('Descripcion').value = '';
                console.log(resultado.subtarea);


                $('#listaSubTareas').append(`
                    <div class="divSubtarea d-flex align-items-center justify-content-between" data-id="${resultado.subtarea.subTareaID}">
                        <span> ${resultado.subtarea.descripcion}</span>
                        <button class="btn btn-remove"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                `);


                $('.btn-remove').last().click(function () {
                    var subTareaID = $(this).closest('.divSubtarea').data('id');
                    EliminarSubtarea(subTareaID, $(this).closest('.divSubtarea'));
                });
            }
        },
        error: function (xrs, status) {
            console.log('Se produjo un error a la hora de almacenar la subtarea.');
        }
    })
}

function EliminarSubtarea(subTareaID, divSubtarea) {
    $.ajax({
        url: '../../Home/EliminarSubtarea',
        data: { subTareaID: subTareaID },
        type: 'POST',
        datatype: 'json',
        success: function (resultado) {
            if (resultado.success) {

                divSubtarea.remove();
                console.log('Subtarea eliminada correctamente.');
            } else {
                console.log('No se pudo eliminar la subtarea.');
            }
        },
        error: function (xrs, status) {
            console.log('Se produjo un error a la hora de eliminar la subtarea.');
        }
    });
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
        data: { tareaId: tareaID },
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

function completarTarea(tareaID) {

    $("#subTareasList").empty();

    $.ajax({
        url: '../../Home/ObtenerSubTareas',
        type: 'GET',
        data: { TareaID: tareaID },
        success: function (subTareas) {

            if (subTareas.length === 0) {
                alert('Todas las subtareas ya están finalizadas.');
                return ListadoTarea();
            }

            let contenidoSubTareas = ``;

            $.each(subTareas, function (index, subTarea) {
                contenidoSubTareas += `
                <ul class="list-group">
                    <li class="list-group-item mb-1">
                        <input type="checkbox" class="form-check-input finalizarSubTarea" data-id="${subTarea.subTareaID}">
                        <label class="form-check-label">${subTarea.descripcion}</label>
                    </li>
                </ul>    
                `;
            });

            //INSERTAR CONTENIDO EN EL MODAL
            $('#subTareasList').html(contenidoSubTareas);

            //GUARDAR EL ID DE LA TAREA EN EL BOTON DE FINALIZAR
            $('#finalizarTareaBtn').attr('data-tarea-id', tareaID);

            //ABRIR EL MODAL
            $('#completarTareaModal').modal('show');
        },
        error: function () {
            alert('Error al cargar las subtareas.');
        }
    });
}

function FinalizarTarea() {
    let tareaID = $('#finalizarTareaBtn').data('tarea-id');
    let subTareasFinalizadas = [];

    //RECOPILAR LAS SUBTAREAS MARCADAS EN EL CHECKBOX
    $('.finalizarSubTarea:checked').each(function () {
        subTareasFinalizadas.push($(this).data('id'));
    });

    console.log(subTareasFinalizadas)

    if (subTareasFinalizadas.length === 0) {
        alert('Por favor, selecciona al menos una subtarea para finalizar.');
        return;
    }

    $.ajax({
        url: '../../Home/FinalizarSubTareas',
        type: 'POST',
        data: {
            TareaID: tareaID,
            SubTareasFinalizadas: subTareasFinalizadas
        },
        success: function (response) {
            if (response.tareaCompletada) {
                alert('Tarea completada');
                $('#completarTareaModal').modal('hide');
            }
            else {
                alert('Subtareas finalizadas, pero la tarea no se ha completado todavía.');
                $('#completarTareaModal').modal('hide');
            }

            ListadoTarea();
        },
        error: function () {
            alert('Error al finalizar las subtareas.');
        }
    });

}