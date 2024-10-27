window.onload = ListadoTodasTareas;

function ListadoTodasTareas() {

    let tipoSistemaBuscarID  = $("#TipoSistemaBuscarID").val();
    let tipoTareaBuscarID = $("#TipoTareaBuscarID").val();
    let fechaDesde = $("#fechaDesdeBuscar").val();
    let fechaHasta = $("#fechaHastaBuscar").val();
    let todas = document.getElementById("todasTareas").checked;
    let finalizadas = document.getElementById("tareasFinalizadas").checked;
    
    $.ajax({
        url: '../../Home/ListadoHistorialTareas',

    data:{
        TipoSistemaBuscarID :tipoSistemaBuscarID,
        TipoTareaBuscarID :tipoTareaBuscarID,
        FechaDesde: fechaDesde,
        FechaHasta: fechaHasta,
        Todas: todas,
        Finalizadas: finalizadas
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

                        let tareaFinalizada = '';
                        if (tarea.estado == true) {
                            tareaFinalizada = '<i class="fa-solid fa-check"></i>';
                        }
                        else {
                            tareaFinalizada = '<i class="fa-solid fa-x"></i>';
                        }

                        tabla += `
                        <tr>
                            <td colspan="2"></td>
                            <td>${tarea.tituloTarea}</td>
                            <td>${tarea.emailUsuario}</td>
                            <td>${tarea.fechaIniciostring}</td>
                            <td>${tarea.fechaCierrestring || "----"}</td>
                            <td>${tarea.tiempoEstimado} hs</td>
                            <td>${tarea.observaciones || "----"}</td>
                            <td class="text-center">${tareaFinalizada}</td>
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
