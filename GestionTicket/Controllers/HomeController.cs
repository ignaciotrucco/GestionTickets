using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GestionTicket.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using GestionTicket.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;

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

    public IActionResult TareaCompleta(int id)
    {
        var tipoSistemas = _context.TipoSistemas.ToList();
        tipoSistemas.Add(new TipoSistema { TipoSistemaID = 0, Nombre = "[Seleccione...]" });
        ViewBag.TipoSistema = new SelectList(tipoSistemas.OrderBy(t => t.Nombre), "TipoSistemaID", "Nombre");

        var tarea = _context.Tareas.Include(t => t.TipoTarea).FirstOrDefault(t => t.TareaID == id);

        return View(tarea);
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

            // Aquí recuperamos el ID de la tarea recién creada
            int tareaId = nuevaTarea.TareaID;

            // Creo url para ir a completar la tarea.
            string urlCompleta = Url.Action("TareaCompleta", "Home", new { id = tareaId });

            return Json(new { success = true, urlCompleta });
        }
    }

    public JsonResult CompletarTarea(int TareaID, int TipoSistemaID, DateTime FechaInicio, decimal TiempoEstimado, string Observaciones, bool Estado)
    {
        string resultado = "";

        if (TareaID != 0)
        {
            var editarTarea = _context.Tareas.Where(e => e.TareaID == TareaID).SingleOrDefault();
            if (editarTarea != null)
            {
                editarTarea.TipoSistemaID = TipoSistemaID;
                editarTarea.FechaInicio = FechaInicio;
                editarTarea.TiempoEstimado = TiempoEstimado;
                editarTarea.Observaciones = Observaciones;
                editarTarea.Estado = Estado;
                _context.SaveChanges();
                resultado = "Tarea completada";
            }
        }


        return Json(resultado);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
