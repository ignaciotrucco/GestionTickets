window.onload = ListadoTarea;
window.onload = ListadoTarea;

function ListadoTarea() {
    $.ajax({
        url: '../../Home/ListadoTarea',
        type: 'POST',
        dataType: 'json',
        success: function (tareasMostrar) {
            let contenidoCards = `<div class="row">`;

     
            $.each(tareasMostrar, function (index, tipoTarea) {
                contenidoCards += `
                    <div class="col-md-4 mb-4">
                        <div class="card Card_tamaño">
                            <div class="card-header text-white bg-primary">
                                ${tipoTarea.nombretipotarea}
                            </div>
                            <div class="card-body">
                                <div class="row">
                `;

          
                $.each(tipoTarea.listadoDelasTareas, function (index, tarea) {
                    contenidoCards += `
                    <div class="row mb-2">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-header text-dark">
                                    <strong>Título de la tarea:</strong> ${tarea.tituloTarea}
                                </div>
                                <div class="card-body">
                                    <button class="btn btn-primary" onclick="DetalleTarea(${tarea.tareaID})">
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                });

                contenidoCards += `</div></div></div></div>`;  // Cerrar card y filas
            });

            contenidoCards += `</div>`;  // Cerrar fila principal
            document.getElementById("TareaContainer").innerHTML = contenidoCards;  // Mostrar el contenido
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
            let contenido = ``;

            $.each(detalleTareasMostrar, function (index, detalle) {
                contenido += `
                <div class="card mb-3" style="width: 18rem;">
                    <div class="card-body">
                     <strong> Titulo de la tarea<h5 class="card-title">${detalle.tituloTarea}</h5></strong>  
                        <strong>Nombre del tipo de sistema   <h6 class="card-subtitle mb-2 text-body-secondary">${detalle.nombretiposistema}</h6></strong>  
                        <p class="card-text">
                            Estado: ${detalle.estado}<br>
                            Fecha de Inicio: ${detalle.fechaInicio}<br>
                            Tiempo Estimado: ${detalle.tiempoEstimado}<br>
                            Observaciones: ${detalle.observaciones}
                        </p>
                    </div>
                </div>`;
            });

            document.getElementById("Detalle").innerHTML = contenido;

            $('#DetalleModal').modal('show');
        },
        error: function () {
            alert("Error al cargar los detalles de la tarea.");
        }
    });
}




