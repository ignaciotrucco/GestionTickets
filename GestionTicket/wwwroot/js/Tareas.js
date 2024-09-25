window.onload = ListadoTarea;

function ListadoTarea() {
    $.ajax({
        url: '../../Home/ListadoTarea',
        type: 'POST',
        dataType: 'json',
        success: function (tareasMostrar) {
            let contenidoCards = `<div class="row">`;

            // en este let declaramos los colores a usar, son clases de bostrao
            let colores = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary'];

            $.each(tareasMostrar, function (index, tipoTarea) {
                // con esto declaramos y hacemos que nos de los colores aletoriamente 
                let colorRandom = colores[Math.floor(Math.random() * colores.length)];

                contenidoCards += `
                    <div class="col-md-4 mb-4">
                    
                        <div class="card Card_tamaño ">
                            <div class="card-header ${colorRandom} text-white">
                                ${tipoTarea.nombretipotarea}
                            </div>
                            <div class="card-body">
                               
                                <div class="row">
                `;

                $.each(tipoTarea.listadoDelasTareas, function (index, tarea) {
                    contenidoCards += `
                  <div class="row mb-2 text-bg-primary">
                     <a href="">
                            <div class="col-md-12">
                                <div class="card">
                                
                                    <div class="card-header text-Dark">
                                      <strong>Titulo de la tarea:</strong>  ${tarea.tituloTarea}
                                    </div>
                                </div>
                                </a>
                            </div>
                        </div>
                    `;
                });
                contenidoCards += `</div></div></div></div>`;  
            });

            document.getElementById("TareaContainer").innerHTML = contenidoCards;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar las tareas.');
        }
    });
}
