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

            $('#modalSistemas').modal("hide");
            LimpiarFormulario();

            let tabla = ``;


            $.each(listadoTipoSistema, function (index, tipoSistema) {

                if (tipoSistema.eliminado) {
                    tabla += `
                    <tr class="bg-danger p-2" style="--bs-bg-opacity: .5;">
                        <td><del>${tipoSistema.nombre}</del></td>
                        <td class="text-center">
                            <button type="button" class="btn btn-outline-dark btn-sm" title="Activar" onclick="ActivarSistema(${tipoSistema.tipoSistemaID})">
                                <i class="fa-regular fa-eye"></i>
                            </button>
                            <button type="button" class="btn btn-outline-dark btn-sm" title="Eliminar" onclick="EliminarSistema(${tipoSistema.tipoSistemaID})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                }
                else {
                    tabla += `
                    <tr>
                        <td>${tipoSistema.nombre}</td>
                        <td class="text-center">
                            <button type="button" class="btn btn-outline-dark btn-sm" title="Editar" onclick="AbrirModalEditar(${tipoSistema.tipoSistemaID})">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button type="button" class="btn btn-outline-dark btn-sm" title="Desactivar" onclick="DesactivarSistema(${tipoSistema.tipoSistemaID})">
                                <i class="fa-solid fa-ban"></i>
                            </button>
                        </td>
                    </tr>
                `;
                }
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
    $("#TipoSistemaEditarID").val(0);
    $("#NombreEditar").val("");
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
                Swal.fire(resultado);
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

function EditarSistema() {
    let sistemaEditarID = $("#TipoSistemaEditarID").val();
    let nombreEditar = $("#NombreEditar").val();

    $.ajax({
        // la URL para la petición
        url: '../../TiposSistema/GuardarTipoSistema',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { TipoSistemaID: sistemaEditarID,
             Nombre: nombreEditar },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (resultado) {

            if (resultado != "") {
                Swal.fire(resultado);
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

function AbrirModalEditar(sistemaID) {

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
            $("#TipoSistemaEditarID").val(sistemaID);
            $("#NombreEditar").val(listadoSistemas.nombre);
            $('#modalSistemas').modal("show");

        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function DesactivarSistema(sistemaID) {

    $.ajax({
        // la URL para la petición
        url: '../../TiposSistema/DesactivarSistema',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { TipoSistemaID: sistemaID },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (desactivarSistema) {

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

function ActivarSistema(sistemaID) {

    $.ajax({
        // la URL para la petición
        url: '../../TiposSistema/ActivarSistema',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data: { TipoSistemaID: sistemaID },
        // especifica si será una petición POST o GET
        type: 'POST',
        // el tipo de información que se espera de respuesta
        dataType: 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (activarSistema) {

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

function EliminarSistema(sistemaID) {
    Swal.fire({
        title: "¿Desea eliminar el tipo de sistema?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"

    }).then((result) => {
        if (result.isConfirmed) {
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
                success: function (resultado) {

                    if (!resultado) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "No se puede eliminar porque existen registros asociados",
                        });
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
        };
    });
}

