using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GestionTicket.Models;
using Microsoft.AspNetCore.Authorization;
using GestionTicket.Data;
using Microsoft.AspNetCore.Mvc.Rendering;

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

    public IActionResult Tarea()
    {
        return View();

      
    }



  public JsonResult ListadoTodasTareas(int? id)
    {

        List<VistaTipoTarea> tareasMostrar = new List<VistaTipoTarea>();

        var tareas = _context.Tareas .Where(e => !id.HasValue || e.TareaID == id.Value).ToList();

        var tipotarea = _context.TipoTareas.ToList();


        foreach (var tarea in tareas)
        {

            var tipoTarea = tipotarea.SingleOrDefault(n => n.TipoTareaID == tarea.TipoTareaID);

            if (tipoTarea != null)
            {

                var vistaTipoTarea = tareasMostrar.SingleOrDefault(v => v.TipoTareaID == tipoTarea.TipoTareaID);


                if (vistaTipoTarea == null)
                {
                    vistaTipoTarea = new VistaTipoTarea
                    {
                        TipoTareaID = tipoTarea.TipoTareaID,
                        Nombretipotarea = tipoTarea.Nombre,
                        ListadoDelasTareas = new List<VistaTarea>()
                    };
                    tareasMostrar.Add(vistaTipoTarea);
                }

                
                var nuevaTarea = new VistaTarea
                {
                    TareaID = tarea.TareaID,
                    TipoTareaID = tarea.TipoTareaID,
                    TituloTarea = tarea.TituloTarea,
                    TipoSistemaID = tarea.TipoSistemaID,
                    UsuarioID = tarea.UsuarioID,
                    FechaInicio = tarea.FechaInicio,
                    TiempoEstimado = tarea.TiempoEstimado,
                    Observaciones = tarea.Observaciones,
                    Estado = tarea.Estado
                };

                vistaTipoTarea.ListadoDelasTareas.Add(nuevaTarea);
            }


        }
        return Json(tareasMostrar);
    }
    

    }