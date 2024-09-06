window.onload = ListadoTipoSistema();

function ListadoTipoSistema() {
    $.ajax({
        // la URL para la petición
        url: '../../TiposSistema/ListadoTipoSistema',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: {},
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (listadoTipoSistema) {

            LimpiarFormulario();

            let tabla = ``;

            $.each(listadoTipoSistema, function (index, tipoSistema) {

                tabla += `
            <tr>
                <td>${tipoSistema.nombre}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="EditarSistema(${tipoSistema.tipoSistemaID})">
                        Editar
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="ValidarEliminacion(${tipoSistema.tipoSistemaID})">
                        Eliminar
                    </button>
                </td>
            </tr>
         `;
            });

            document.getElementById("tbody-tiposistema").innerHTML = tabla;

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function LimpiarFormulario() {
    $("#TipoSistemaID").val(0);
    $("#Nombre").val("");
}

function GuardarSistema() {
    let sistemaID = $("#TipoSistemaID").val();
    let nombre = $("#Nombre").val();

    $.ajax({
        // la URL para la petición
        url: '../../TiposSistema/GuardarTipoSistema',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { TipoSistemaID: sistemaID, Nombre: nombre },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (resultado) {

            if (resultado != "") {
                alert(resultado);
            }
            ListadoTipoSistema();


        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar');
        }
    });

}

function EditarSistema(sistemaID) {

    $.ajax({
        // la URL para la petición
        url: '../../TiposSistema/ListadoTipoSistema',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { TipoSistemaID: sistemaID },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (listadoTipoSistema) {

            let listadoSistemas = listadoTipoSistema[0]
            $("#TipoSistemaID").val(sistemaID);
            $("#Nombre").val(listadoSistemas.nombre);

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function ValidarEliminacion(sistemaID) {
    var siElimina = confirm("¿Seguro que desea eliminar este registro?");
    if (siElimina == true) {
        EliminarSistema(sistemaID)
    }
}

function EliminarSistema(sistemaID) {

    $.ajax({
        // la URL para la petición
        url: '../../TiposSistema/EliminarSistema',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { TipoSistemaID: sistemaID },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (eliminarSistema) {

            ListadoTipoSistema();


        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al guardar');
        }
    });

}

