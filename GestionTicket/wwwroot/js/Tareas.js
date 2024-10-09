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
                let collapseId = `collapseTipoTarea${index}`;

                contenidoCards += `
                    <div class="col-md-4 col-sm-6 mb-4">  
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
                            <div class="d-flex justify-content-between align-items-center p-2 text-dark">
                                <span>${tarea.tituloTarea}</span>
                                <button class="btn-sm btn-outline-primary tamaño_boton" onclick="DetalleTarea(${tarea.tareaID})">
                                    Detalle
                                </button>
                            </div>
                        </div>
                    </div>`;
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
                        <h6><b>Sub Tareas:</b></h6>
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