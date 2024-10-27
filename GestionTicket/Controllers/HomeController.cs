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
        ViewBag.TipoTareaEditar = new SelectList(tiposTareas.OrderBy(t => t.Nombre), "TipoTareaID", "Nombre");

        var tipoSistemas = _context.TipoSistemas.Where(t => t.Eliminado == false).ToList();
        tipoSistemas.Add(new TipoSistema { TipoSistemaID = 0, Nombre = "[Seleccione...]" });
        ViewBag.TipoSistemaEditar = new SelectList(tipoSistemas.OrderBy(t => t.Nombre), "TipoSistemaID", "Nombre");



        // Añadir la opción de búsqueda
        tipoSistemas.Add(new TipoSistema { TipoSistemaID = 0, Nombre = "[ Buscar]" });

        // Asignar la lista al ViewBag
        ViewBag.TipoSistemaBuscarID = new SelectList(tipoSistemas.OrderBy(c => c.Nombre), "TipoSistemaID", "Nombre");


        var userId = _userManager.GetUserId(User);
        ViewBag.UsuarioId = userId;

        return View();
    }

    public IActionResult TareaCompleta(int id)
    {
        var tipoSistemas = _context.TipoSistemas.Where(t => t.Eliminado == false).ToList();
        tipoSistemas.Add(new TipoSistema { TipoSistemaID = 0, Nombre = "[Seleccione...]" });
        ViewBag.TipoSistema = new SelectList(tipoSistemas.OrderBy(t => t.Nombre), "TipoSistemaID", "Nombre");

        var tarea = _context.Tareas.Include(t => t.TipoTarea).FirstOrDefault(t => t.TareaID == id);

        return View(tarea);
    }

    public IActionResult HistorialTareas()
    {
        var tipoSistemas = _context.TipoSistemas.Where(t => t.Eliminado == false).ToList();
        tipoSistemas.Add(new TipoSistema { TipoSistemaID = 0, Nombre = "[ Buscar]" });
        ViewBag.TipoSistemaBuscarID = new SelectList(tipoSistemas.OrderBy(c => c.Nombre), "TipoSistemaID", "Nombre");


        var tipotareas = _context.TipoTareas.Where(t => t.Eliminado == false).ToList();
        tipotareas.Add(new TipoTarea { TipoTareaID = 0, Nombre = "[ Buscar]" });
        ViewBag.TipoTareaBuscarID = new SelectList(tipotareas.OrderBy(c => c.Nombre), "TipoTareaID", "Nombre");

        return View();
    }

    public JsonResult ListadoTarea(int? id)
    {

        List<VistaTipoTarea> tareasMostrar = new List<VistaTipoTarea>();


        var userId = _userManager.GetUserId(User);


        var tareas = _context.Tareas
            .Include(t => t.TipoTarea)
            .Include(t => t.TipoSistema)
            .Where(e => e.Estado == false && e.UsuarioID == userId)
            .ToList();
        if (id != null)
        {
            tareas = tareas.Where(t => t.TareaID == id).ToList();
        }

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

    public JsonResult DetalleTarea(int tareaId)
    {

        // primero creamo el listado que comienza en 0

        List<VistaDetalleTarea> detalleTareasMostrar = new List<VistaDetalleTarea>();

        // Obtenemos las tareas filtradas por el id 
        var tareas = _context.Tareas.Where(t => t.TareaID == tareaId).ToList();


        // Obtenemos todos los tipos de tareas, subtareas y tipos de sistemas
        var tipotarea = _context.TipoTareas.ToList();
        var subTareas = _context.SubTareas.Where(s => !s.Estado).ToList();
        var tipoSistemas = _context.TipoSistemas.ToList();


        foreach (var detalletarea in tareas)
        {

            var tipoTarea = tipotarea.SingleOrDefault(n => n.TipoTareaID == detalletarea.TipoTareaID);
            var subtareas = subTareas.Where(s => s.TareaID == detalletarea.TareaID).ToList();
            var tiposistemas = tipoSistemas.SingleOrDefault(t => t.TipoSistemaID == detalletarea.TipoSistemaID);


            var vistaSubTareas = subtareas.Select(s => new VistaSubTareas
            {
                SubTareaID = s.SubTareaID,
                Descripcion = s.Descripcion,
            }).ToList();


            var nuevoDetalleTarea = new VistaDetalleTarea
            {
                TareaID = detalletarea.TareaID,
                TipoTareaID = detalletarea.TipoTareaID,
                TituloTarea = detalletarea.TituloTarea,
                TipoSistemaID = tiposistemas?.TipoSistemaID,
                Nombretiposistema = tiposistemas?.Nombre,
                UsuarioID = detalletarea.UsuarioID,
                // SubTareaID = subtarea.SubTareaID,
                FechaInicio = detalletarea.FechaInicio,
                FechaIniciostring = detalletarea.FechaInicio.HasValue
                ? detalletarea.FechaInicio.Value.ToString("dd/MM/yyyy - HH:mm")
                : string.Empty,
                TiempoEstimado = detalletarea.TiempoEstimado,
                Observaciones = detalletarea.Observaciones,
                Estado = detalletarea.Estado,
                Nombretipotarea = tipoTarea?.Nombre,
                Subtareas = vistaSubTareas
                // Descripcion = subtarea.Descripcion,
                // EliminadoSubtarea = subtarea.Eliminado
            };


            detalleTareasMostrar.Add(nuevoDetalleTarea);

        }

        return Json(detalleTareasMostrar);
    }

    public JsonResult CrearTarea(string tituloTarea, int tipoTarea, string userId)
    {
        tituloTarea = tituloTarea.ToUpper();

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

            return Json(nuevaTarea.TareaID);
        }
    }

    public JsonResult CompletarTarea(int TareaID, int TipoSistemaID, DateTime FechaInicio, decimal TiempoEstimado, string Observaciones)
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


                editarTarea.Estado = false;
                _context.SaveChanges();
                resultado = "Tarea completada";
            }
        }

        return Json(resultado);
    }

    public JsonResult GuardarSubtarea(int tareaID, string subtarea)
    {
        if (subtarea != "")
        {
            var subtareaObj = new SubTarea
            {
                TareaID = tareaID,
                Descripcion = subtarea,
                Estado = false,
                Eliminado = false
            };

            _context.SubTareas.Add(subtareaObj);
            _context.SaveChanges();

            return Json(new { success = true, subtarea = subtareaObj });
        }

        return Json(new { success = false });
    }

    public JsonResult EliminarSubtarea(int subTareaID)
    {
        var subtareaEliminar = _context.SubTareas.Find(subTareaID);

        if (subtareaEliminar != null)
        {
            _context.SubTareas.Remove(subtareaEliminar);
            _context.SaveChanges();
            return Json(new { success = true });
        }

        return Json(new { success = false });
    }


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    public JsonResult EditarTarea(int TareaID, int TipoTareaID, string TituloTarea, int TipoSistemaID, DateTime FechaInicio, decimal TiempoEstimado, string Observaciones)
    {
        string resultado = "";
        TituloTarea = TituloTarea.ToUpper();

        if (TareaID != 0)
        {
            var editarTarea = _context.Tareas.Where(e => e.TareaID == TareaID).SingleOrDefault();

            if (editarTarea != null)
            {
                editarTarea.TipoTareaID = TipoTareaID;
                editarTarea.TituloTarea = TituloTarea;
                editarTarea.TipoSistemaID = TipoSistemaID;
                editarTarea.FechaInicio = FechaInicio;
                editarTarea.TiempoEstimado = TiempoEstimado;
                editarTarea.Observaciones = Observaciones;


                editarTarea.Estado = false;
                _context.SaveChanges();
                resultado = "¡Tarea editada!";
            }
        }

        return Json(resultado);
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
                tarea.FechaCierre = DateTime.Now;
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
                tarea.FechaCierre = DateTime.Now;
                _context.SaveChanges();
            }
        }

        return Json(new { tareaCompletada });
    }

    public JsonResult ListadoHistorialTareas(int? TipoTareaBuscarID, int? TipoSistemaBuscarID, DateTime? FechaDesde, DateTime? FechaHasta, bool Todas, bool Finalizadas)
    {
        var usuarioLogueado = _userManager.GetUserId(HttpContext.User);

        List<VistaTipoTarea> tareasMostrar = new List<VistaTipoTarea>();
        var tareas = _context.Tareas
            .Include(t => t.TipoSistema)
            .Include(t => t.TipoTarea).Where(t => t.UsuarioID == usuarioLogueado).OrderBy(t => t.FechaInicio)
            .ToList();

        var usuarios = _context.Users.ToList();

        if (Todas == true)
        {
            tareas = _context.Tareas
            .Include(t => t.TipoSistema)
            .Include(t => t.TipoTarea).OrderBy(t => t.FechaInicio)
            .ToList();
        }

        if (TipoTareaBuscarID != null && TipoTareaBuscarID != 0)
        {
            tareas = tareas.Where(t => t.TipoTareaID == TipoTareaBuscarID).ToList();
        }


        if (TipoSistemaBuscarID != null && TipoSistemaBuscarID != 0)
        {
            tareas = tareas.Where(t => t.TipoSistemaID == TipoSistemaBuscarID).ToList();
        }


        if (FechaDesde != null && FechaHasta != null)
        {
            tareas = tareas.Where(t => t.FechaInicio >= FechaDesde && t.FechaInicio <= FechaHasta).ToList();
        }

        if (Finalizadas == true) {
            tareas = tareas.Where(t => t.Estado == true).ToList();
        }

        foreach (var tarea in tareas)
        {
            var usuario = usuarios.Where(u => u.Id == tarea.UsuarioID).Single();

            if (tarea.TipoTarea == null || tarea.TipoSistema == null)
            {
                continue;
            }

            var tipoTareaNostrar = tareasMostrar.SingleOrDefault(n => n.TipoTareaID == tarea.TipoTareaID);

            if (tipoTareaNostrar == null)
            {
                tipoTareaNostrar = new VistaTipoTarea
                {
                    TipoTareaID = tarea.TipoTareaID,
                    Nombretipotarea = tarea.TipoTarea.Nombre,
                    VistaSistema = new List<VistaSistema>()
                };
                tareasMostrar.Add(tipoTareaNostrar);
            }

            var sistemaMostrar = tipoTareaNostrar.VistaSistema
                .SingleOrDefault(s => s.TipoSistemaID == tarea.TipoSistemaID);

            if (sistemaMostrar == null)
            {
                sistemaMostrar = new VistaSistema
                {
                    TipoSistemaID = tarea.TipoSistemaID,
                    NombreSistema = tarea.TipoSistema.Nombre,
                    ListadoDelasTareas = new List<VistaTarea>()
                };
                tipoTareaNostrar.VistaSistema.Add(sistemaMostrar);
            }

            var tareaMostrar = new VistaTarea
            {
                TareaID = tarea.TareaID,
                TituloTarea = tarea.TituloTarea,
                UsuarioID = tarea.UsuarioID,
                EmailUsuario = usuario.Email,
                FechaInicio = tarea.FechaInicio,
                FechaIniciostring = tarea.FechaInicio.HasValue
                    ? tarea.FechaInicio.Value.ToString("dd/MM/yyyy - HH:mm")
                    : string.Empty,
                FechaCierre = tarea.FechaCierre,
                FechaCierrestring = tarea.FechaCierre.HasValue
                    ? tarea.FechaCierre.Value.ToString("dd/MM/yyyy - HH:mm")
                    : string.Empty,
                TiempoEstimado = tarea.TiempoEstimado,
                Observaciones = tarea.Observaciones,
                Estado = tarea.Estado
            };


            if (sistemaMostrar != null)
            {
                sistemaMostrar.ListadoDelasTareas.Add(tareaMostrar);
            }
        }

        return Json(tareasMostrar);
    }



}













