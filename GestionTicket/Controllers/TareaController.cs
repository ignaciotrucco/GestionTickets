using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GestionTicket.Models;
using Microsoft.AspNetCore.Authorization;
using GestionTicket.Data;

namespace GestionTicket.Controllers;

[Authorize]
public class TareaController : Controller
{
    private readonly ILogger<TareaController> _logger;


    private ApplicationDbContext _context;

    public TareaController(ILogger<TareaController> logger, ApplicationDbContext context)
    {
        _logger = logger;

        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }


    // Mostrar listado tarea

    public JsonResult ListadoTarea(int? id)
    {

        List<VistaTarea> tareasMostrar = new List<VistaTarea>();

        var tareas = _context.Tareas.ToList();

        var tipotarea = _context.TipoTareas.ToList();


        foreach (var tarea in tareas)

        {
            var tipoTareas = tipotarea.Where(n => n.TipoTareaID == tarea.TipoTareaID).SingleOrDefault();
            if (tipoTareas != null)
              
                {
                    VistaTarea nuevaTarea = new VistaTarea
                    {
                        TareaID = tarea.TareaID,
                        TipoTareaID = tarea.TipoTareaID,
                        TituloTarea = tarea.TituloTarea,
                        Nombretipotarea =tipoTareas.Nombre,
                        TipoSistemaID = tarea.TipoSistemaID,
                        UsuarioID = tarea.UsuarioID,
                        FechaInicio = tarea.FechaInicio,
                        TiempoEstimado = tarea.TiempoEstimado,
                        Observaciones = tarea.Observaciones,
                        Estado = tarea.Estado
                    };

                    tareasMostrar.Add(nuevaTarea);
                }


        }return Json(tareasMostrar);





    } 



}

