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

                if (tarea.Estado == false)
                {
                    VistaTarea nuevaTarea = new VistaTarea
                    {
                        TareaID = tarea.TareaID,
                        TipoTareaID = tarea.TipoTareaID,
                        TituloTarea = tarea.TituloTarea,
                        Nombretipotarea = tipoTareas.Nombre,
                        TipoSistemaID = tarea.TipoSistemaID,
                        UsuarioID = tarea.UsuarioID,
                        FechaInicio = tarea.FechaInicio,
                        TiempoEstimado = tarea.TiempoEstimado,
                        Observaciones = tarea.Observaciones,
                        Estado = tarea.Estado
                    };

                    tareasMostrar.Add(nuevaTarea);
                }
                else
                {
                    return Json(new { success = false, text = "No tienes tareas pendientes" });
                }
            }


        }
        return Json(tareasMostrar);
    }

    public JsonResult ObtenerSubTareas(int TareaID)
    {
        var subtareas = _context.SubTareas.Where(s => s.TareaID == TareaID && !s.Estado && !s.Eliminado).ToList();

        //SI NO TIENE SUBTAREAS ASIGNADAS SE MARCA LA TAREA COMO TRUE 
        if (!subtareas.Any())
        {
            var tarea = _context.Tareas.FirstOrDefault(t => t.TareaID == TareaID);
            if (tarea != null)
            {
                tarea.Estado = true;
                _context.SaveChanges();
            }
        }

        return Json(subtareas);
    }

    public JsonResult FinalizarSubTareas(int TareaID, List<int> SubTareasFinalizadas)
    {
        var subtareas = _context.SubTareas.Where(s => SubTareasFinalizadas.Contains(s.SubTareaID)).ToList();

        foreach (var subtarea in subtareas)
        {
            subtarea.Estado = true;
        }
        _context.SaveChanges();

        //VERIFICAR SI TODAS LAS SUBTAREAS DE LA TAREA ESTAN FINALIZADAS
        var tareaCompletada = _context.SubTareas.Where(t => t.TareaID == TareaID && !t.Eliminado).All(t => t.Estado == true);

        if (tareaCompletada)
        {
            var tarea = _context.Tareas.Where(t => t.TareaID == TareaID).SingleOrDefault();

            if (tarea != null)
            {
                tarea.Estado = true;
                _context.SaveChanges();
            }
        }

        return Json(new { tareaCompletada });
    }
}

