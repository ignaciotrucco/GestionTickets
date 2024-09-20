

window.onload = ListadoTarea();


function ListadoTarea() {
    $.ajax({
        url: '../../Home/ListadoTarea',
        data: {},
        type: 'POST',
        dataType: 'json',
        success: function (tareas) {

           
      

            let contenidoTabla = ``;

            $.each(tareas, function (index, tarea) { 
                
              
                    
                
                contenidoTabla += `
                    <tr>
                        <td>${tarea.tituloTarea}</td>
                        <td>${tarea.nombretipotarea}</td>
                       
                              
                               


                       
                        <td class="text-center"></td>
                        
                        <td class="text-center"></td>
                        <td class="text-center">
                       
                    </tr>`;
                }
            );

            document.getElementById("tbody-Tareas").innerHTML = contenidoTabla;
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema al deshabilitar');
        }

    





},


)}
