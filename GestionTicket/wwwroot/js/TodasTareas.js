window.onload = ListadoTodasTareas;

function ListadoTodasTareas() {
    $.ajax({
        url: '../../Tarea/ListadoTodasTareas',
        type: 'POST',
        dataType: 'json',
        success: function (tareasMostrar) {
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
