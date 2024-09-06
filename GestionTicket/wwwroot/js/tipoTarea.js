document.addEventListener('DOMContentLoaded', () => {

    listaTipoTareas();

})

function crearTipoTarea(){
    var nombreTipo = document.getElementById('nombreTipo').value;
    var tipoID = document.getElementById('tipoID').value;

    $.ajax({
        url: '../../TipoTarea/GuardarTipo',
        data: { Nombre : nombreTipo, tipoTareaID : tipoID },
        type: 'POST',
        dataType: 'json',
        success: function(result){
            limpiarCampos();

            listaTipoTareas();
        },
        error: function(xrs, status){
            console.log('error');
        } 
    })
}

function editarTarea(){

    var nombreTipo = document.getElementById('nombreTipoEditar').value;
    var tipoID = document.getElementById('tipoTareaEditarID').value;

    $.ajax({
        url: '../../TipoTarea/GuardarTipo',
        data: { Nombre : nombreTipo, tipoTareaID : tipoID },
        type: 'POST',
        dataType: 'json',
        success: function(result){
            limpiarCampos();

            $('#modalTipoTarea').modal("hide");

            listaTipoTareas();
        },
        error: function(xrs, status){
            console.log('error');
        } 
    })
}

function listaTipoTareas(){
    $('#tbody-listaTareas').empty();

    var tipoID = document.getElementById('tipoID').value;

    $.ajax({
        url: '../../TipoTarea/ListarTipos',
        data: { tipoTareaID : tipoID },
        type: 'GET',
        dataType: 'json',
        success: function(result){
            if(result.success){

                $.each(result.lista, function(index, tipo) {
                    $('#tbody-listaTareas').append(`
                        <tr>
                            <td class="tbody">${tipo.nombre}</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-success mb-2" onclick="abrirModalEditar(${tipo.tipoTareaID})">
                                    Editar
                                </button>
                            </td>
                            <td class="text-center">
                                <button type="button" class="btn btn-danger mb-2" onclick="eliminarRegistro(${tipo.tipoTareaID})">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `)
                })
            }
        },
        error: function(xrs, status){
            console.log('error');
        } 
    })
}

function limpiarCampos(){
    document.getElementById('nombreTipo').value = '';
    document.getElementById('tipoID').value = 0;
}

function abrirModalEditar(tipoTareaID){
    $.ajax({
        url: '../../TipoTarea/ListarTipos',
        data: { tipoTareaID },
        type: 'POST',
        dataType: 'json',
        success: function(result){
            let tipoAEditar = result.lista[0];
            
            if (tipoAEditar) {
                $('#modalTitulo').text('Editar tipo de Tarea');
                document.getElementById("tipoTareaEditarID").value = tipoAEditar.tipoTareaID;
                document.getElementById("nombreTipoEditar").value = tipoAEditar.nombre;
        
                $('#modalTipoTarea').modal("show");
            } else {
                console.log("No se encontró el tipo de tarea para editar");
            }

        }
    })
}

function eliminarRegistro(tipoTareaID){
    Swal.fire({
        title: "¿Desea eliminar el tipo de tarea?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"

    }).then((result) =>{
        if (result.isConfirmed) {
            $.ajax({
                url: '../../TipoTarea/EliminarTarea',
                data: { tipoTareaID },
                type: 'DELETE',
                dataType: 'json',
                success: function(result){
                    listaTipoTareas();
                },
                error: function(kxr,status){
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