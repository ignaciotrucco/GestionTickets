using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GestionTicket.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using GestionTicket.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace GestionTicket.Controllers;

[Authorize]
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    private ApplicationDbContext _context;

    private readonly UserManager<IdentityUser> _userManager;

    public HomeController(ILogger<HomeController> logger, UserManager<IdentityUser> userManager, ApplicationDbContext context)
    {
        _logger = logger;

        _userManager = userManager;

        _context = context;
    }

    public IActionResult Index()
    {
        var tiposTareas = _context.TipoTareas.Where(t => t.Eliminado == false).ToList();
        tiposTareas.Add(new TipoTarea
        {
            TipoTareaID = 0,
            Nombre = "[Seleccione...]",
            TareaSimple = true
        });
        ViewBag.TipoTarea = new SelectList(tiposTareas.OrderBy(t => t.Nombre), "TipoTareaID", "Nombre");

        var userId = _userManager.GetUserId(User);
        ViewBag.UsuarioId = userId;

        return View();
    }








    public JsonResult ListadoTarea(int? id)
    {

        List<VistaTipoTarea> tareasMostrar = new List<VistaTipoTarea>();

        var tareas = _context.Tareas.ToList();

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





    public JsonResult CrearTarea(string tituloTarea, int tipoTarea, string userId)
    {
        if (string.IsNullOrEmpty(tituloTarea) || tipoTarea == 0 || string.IsNullOrEmpty(userId))
        {
            return Json(new { success = false, text = "Falta completar campos." });

        }
        else
        {

            var nuevaTarea = new Tarea
            {
                TituloTarea = tituloTarea,
                TipoTareaID = tipoTarea,
                UsuarioID = userId
            };

            _context.Tareas.Add(nuevaTarea);
            _context.SaveChanges();

            return Json(true);
        }
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
