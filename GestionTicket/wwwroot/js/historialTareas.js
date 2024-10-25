window.onload = ListadoTodasTareas;

function ListadoTodasTareas() {

    let tipoSistemaBuscarID  = $("#TipoSistemaBuscarID").val();
    let tipoTareaBuscarID = $("#TipoTareaBuscarID").val();
    $.ajax({
        url: '../../Home/ListadoHistorialTareas',

    data:{
        TipoSistemaBuscarID :tipoSistemaBuscarID,
        TipoTareaBuscarID :tipoTareaBuscarID,

    },
        type: 'POST',
        dataType: 'json',
        success: function (tareasMostrar) {
            
            let tabla = ``;

            $.each(tareasMostrar, function (index, tipoTarea) {

                tabla += `
                    <tr>
                        <td>${tipoTarea.nombretipotarea}</td>
                        <td colspan="8"></td>
                    </tr>
                `;

                $.each(tipoTarea.vistaSistema, function (index, sistema) {

                    tabla += `
                    <tr>
                        <td></td>
                        <td>${sistema.nombreSistema}</td>
                        <td colspan="7"></td>
                    </tr>
                `;

                    $.each(sistema.listadoDelasTareas, function (index, tarea) {

                        tabla += `
                        <tr>
                            <td colspan="2"></td>
                            <td>${tarea.tituloTarea}</td>
                            <td>${tarea.usuarioID}</td>
                            <td>${tarea.fechaIniciostring}</td>
                            <td>${tarea.fechaCierrestring || "----"}</td>
                            <td>${tarea.tiempoEstimado} hs</td>
                            <td>${tarea.observaciones || "----"}</td>
                        </tr>
                    `;

                    });

                });

            });

            $("#historialTareas").html(tabla);

        },
        error: function () {
            alert('Disculpe, existió un problema al cargar las tareas.');
        }
    });
}
