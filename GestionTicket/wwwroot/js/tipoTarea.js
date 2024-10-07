document.addEventListener('DOMContentLoaded', () => {

    listaTipoTareas();

})

function crearTipoTarea() {

    var nombreTipo = document.getElementById('nombreTipo').value;
    var tipoID = document.getElementById('tipoID').value;
    var tareaSimple = document.getElementById('tareaSimple').checked;

    var erroresInput = 0;

    document.getElementById('nombreTipoError').style.display = 'none';
    if (nombreTipo == '') {
        document.getElementById('nombreTipoError').style.display = 'block';
        erroresInput++;
    }

    if (erroresInput > 0) {
        return;
    }

    $.ajax({
        url: '../../TipoTarea/GuardarTipo',
        data: { Nombre: nombreTipo, tipoTareaID: tipoID, TareaSimple: tareaSimple },
        type: 'POST',
        dataType: 'json',
        success: function (result) {
            if (result.success == false) {
                console.log(result.prueba)
                Swal.fire({
                    title: 'Ups, existe un inconveniente:',
                    text: 'Ya existe un tipo de tarea con dicho nombre.',
                    icon: 'warning',
                    confirmButtonText: 'Volver a intentarlo'
                });
            }

            limpiarCampos();

            listaTipoTareas();
        },
        error: function (xrs, status) {
            console.log('error');
        }
    })
}

function editarTarea() {

    var nombreTipo = document.getElementById('nombreTipoEditar').value;
    var tipoID = document.getElementById('tipoTareaEditarID').value;
    var tareaSimple = document.getElementById('tareaSimpleEditar').checked;

    var erroresInput = 0;

    document.getElementById('nombreTipoErrorEdit').style.display = 'none';
    if (nombreTipo == '') {
        document.getElementById('nombreTipoErrorEdit').style.display = 'block';
        erroresInput++;
    }

    if (erroresInput > 0) {
        return;
    }

    $.ajax({
        url: '../../TipoTarea/GuardarTipo',
        data: { Nombre: nombreTipo, tipoTareaID: tipoID, TareaSimple: tareaSimple },
        type: 'POST',
        dataType: 'json',
        success: function (result) {
            console.log(result);
            if (result.success == false) {
                console.log(result.prueba)
                Swal.fire({
                    title: 'Ups, existe un inconveniente:',
                    text: 'Ya existe un tipo de tarea con dicho nombre.',
                    icon: 'warning',
                    confirmButtonText: 'Volver a intentarlo'
                });
            }

            limpiarCampos();

            $('#modalTipoTarea').modal("hide");

            listaTipoTareas();
        },
        error: function (xrs, status) {
            console.log('error');
        }
    })
}

function listaTipoTareas() {
    $('#tbody-listaTareas').empty();

    var tipoID = document.getElementById('tipoID').value;

    $.ajax({
        url: '../../TipoTarea/ListarTipos',
        data: { tipoTareaID: tipoID },
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            if (result.success) {
                if (result.lista.length == 0) {
                    $('#tbody-listaTareas').append(`
                        <tr>
                            <td class="tbody text-center">No existen tipos de tarea agregados.</td>
                            <td class="text-center"></td>
                            <td class="text-center"></td>
                        </tr>
                    `)

                } else {
                    let tabla = ``;

                    $.each(result.lista, function (index, tipo) {
                        let simpleCheckbox;

                        if (tipo.tareaSimple) {
                            simpleCheckbox = '(TAREA SIMPLE)';
                        }
                        else {
                            simpleCheckbox = '';
                        }

                        if (tipo.eliminado) {
                            tabla += `
                                <tr class="bg-danger p-2" style="--bs-bg-opacity: .5;">
                                    <td class="tbody"><del>${tipo.nombre} ${simpleCheckbox}</del></td>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-outline-dark btn-sm" title="Activar" onclick="activarTipoTarea(${tipo.tipoTareaID})">
                                            <i class="fa-regular fa-eye"></i>
                                        </button>
                                        <button type="button" class="btn btn-outline-dark btn-sm" title="Eliminar" onclick="eliminarRegistro(${tipo.tipoTareaID})">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        } else {
                            tabla += `
                            <tr>
                                <td class="tbody">${tipo.nombre} ${simpleCheckbox}</td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-outline-dark btn-sm" title="Editar" onclick="abrirModalEditar(${tipo.tipoTareaID})">
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                    <button type="button" class="btn btn-outline-dark btn-sm" title="Desactivar" onclick="desactivarTipoTarea(${tipo.tipoTareaID})">
                                        <i class="fa-solid fa-ban"></i>
                                    </button>
                                </td>
                            </tr>
                            `;
                        }
                    })
                    document.getElementById("tbody-listaTareas").innerHTML = tabla;
                }
            }
        },
        error: function (xrs, status) {
            Swal.fire({
                title: 'Ups, existe un inconveniente:',
                text: 'Existe un inconveniente al consultar el listado de tipos de tareas.',
                icon: 'warning',
                confirmButtonText: 'Volver a intentarlo'
            });
        }
    })
}

function desactivarTipoTarea(tipoTareaID) {
    $.ajax({
        url: '../../TipoTarea/DesactivarTarea',
        data: { tipoTareaID },
        type: 'PUT',
        dataType: 'json',
        success: function (desactivarTarea) {
            listaTipoTareas();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al desactivar el tipo de tarea.');
        }
    });
}

function activarTipoTarea(tipoTareaID) {
    $.ajax({
        url: '../../TipoTarea/ActivarTarea',
        data: { tipoTareaID },
        type: 'PUT',
        dataType: 'json',
        success: function (activarTarea) {
            console.log(activarTarea)
            listaTipoTareas();
        },
        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al activar el tipo de tarea.');
        }
    });
}

function limpiarCampos() {
    document.getElementById('nombreTipo').value = '';
    document.getElementById('tipoID').value = 0;
    document.getElementById('tareaSimple').checked = false;
}

function abrirModalEditar(tipoTareaID) {
    $.ajax({
        url: '../../TipoTarea/ListarTipos',
        data: { tipoTareaID },
        type: 'POST',
        dataType: 'json',
        success: function (result) {
            let tipoAEditar = result.lista[0];

            if (tipoAEditar) {
                $('#modalTitulo').text('Editar tipo de Tarea');
                document.getElementById("tipoTareaEditarID").value = tipoAEditar.tipoTareaID;
                document.getElementById("nombreTipoEditar").value = tipoAEditar.nombre;
                document.getElementById("tareaSimpleEditar").checked = tipoAEditar.tareaSimple;

                $('#modalTipoTarea').modal("show");
            } else {
                console.log("No se encontró el tipo de tarea para editar");
            }

        },
        error: function (xrs, status) {
            Swal.fire({
                title: 'Ups, existe un inconveniente:',
                text: 'Existe un inconveniente al editar el tipo de tarea.',
                icon: 'warning',
                confirmButtonText: 'Volver a intentarlo'
            });
        }
    })
}

function eliminarRegistro(tipoTareaID) {
    Swal.fire({
        title: "¿Desea eliminar el tipo de tarea?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"

    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '../../TipoTarea/EliminarTarea',
                data: { tipoTareaID },
                type: 'DELETE',
                dataType: 'json',
                success: function (result) {
                    if (result.success == false) {
                        Swal.fire({
                            title: 'Ups, existe un inconveniente:',
                            text: 'Disculpe, no puede eliminar el tipo de tarea ya que existen tareas con dicho tipo.',
                            icon: 'warning',
                            confirmButtonText: 'Volver a intentarlo'
                        });
                    }

                    listaTipoTareas();
                },
                error: function (kxr, status) {
                    Swal.fire({
                        title: 'Ups, existe un inconveniente:',
                        text: 'Disculpe, ocurrió un error al intentar eliminar el tipo de tarea.',
                        icon: 'warning',
                        confirmButtonText: 'Volver a intentarlo'
                    });
                }
            })
        }
    })
}