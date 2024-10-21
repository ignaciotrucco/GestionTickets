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

function completarTarea(tareaID) {

    $("#subTareasList").empty();

    $.ajax({
        url: '../../Tarea/ObtenerSubTareas',
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
        url: '../../Tarea/FinalizarSubTareas',
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