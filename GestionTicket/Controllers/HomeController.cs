using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GestionTicket.Models;
using Microsoft.AspNetCore.Authorization;
using GestionTicket.Data;

namespace GestionTicket.Controllers;

[Authorize]
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

       private ApplicationDbContext _context;

    public HomeController(ILogger<HomeController> logger,ApplicationDbContext context)
    {
        _logger = logger;
         _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }


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
