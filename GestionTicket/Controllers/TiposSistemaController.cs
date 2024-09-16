using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GestionTicket.Models;
using GestionTicket.Data;

namespace GestionTicket.Controllers;

public class TiposSistemaController : Controller
{

    private ApplicationDbContext _context;
    public TiposSistemaController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult TiposSistema()
    {
        return View();
    }

    public JsonResult ListadoTipoSistema(int? TipoSistemaID)
    {
        var listadoTipoSistema = _context.TipoSistemas.ToList();

        if (TipoSistemaID != null)
        {
            listadoTipoSistema = _context.TipoSistemas.Where(l => l.TipoSistemaID == TipoSistemaID).ToList();
        }

        return Json(listadoTipoSistema);
    }

    public JsonResult GuardarTipoSistema(int TipoSistemaID, string Nombre)
    {
        string resultado = "";

        if (!String.IsNullOrEmpty(Nombre))
        {

            Nombre = Nombre.ToUpper();

            if (TipoSistemaID == 0)
            {
                var existeSistema = _context.TipoSistemas.Where(e => e.Nombre == Nombre).Count();
                if (existeSistema == 0)
                {
                    var nuevoSistema = new TipoSistema
                    {
                        Nombre = Nombre,
                        Eliminado = false
                    };
                    _context.Add(nuevoSistema);
                    _context.SaveChanges();
                    resultado = "Sistema guardado exitosamente";
                }
                else
                {
                    resultado = "Sistema existente";
                }
            }
            else
            {
                var editarSistema = _context.TipoSistemas.Where(e => e.TipoSistemaID == TipoSistemaID).SingleOrDefault();
                if (editarSistema != null)
                {
                    var existeSistemaEditar = _context.TipoSistemas.Where(e => e.Nombre == Nombre && e.TipoSistemaID != TipoSistemaID).Count();
                    if (existeSistemaEditar == 0)
                    {
                        editarSistema.Nombre = Nombre;
                        editarSistema.Eliminado = false;
                        _context.SaveChanges();
                        resultado = "Sistema editado exitosamente";
                    }
                    else
                    {
                        resultado = "Sistema existente";
                    }
                }
            }
        }
        else
        {
            resultado = "Debe ingresar un nombre";
        }


        return Json(resultado);
    }

    public JsonResult DesactivarSistema(int TipoSistemaID)
    {
        var desactivarSistema = _context.TipoSistemas.Find(TipoSistemaID);
        desactivarSistema.Eliminado = true;
        _context.SaveChanges();


        return Json(desactivarSistema);
    }

    public JsonResult ActivarSistema(int TipoSistemaID)
    {
        var activarSistema = _context.TipoSistemas.Find(TipoSistemaID);
        activarSistema.Eliminado = false;
        _context.SaveChanges();

        return Json(activarSistema);
    }

    public JsonResult EliminarSistema(int TipoSistemaID)
    {
        bool eliminado = false;

        var existeTarea = _context.Tareas.Where(e => e.TipoSistemaID == TipoSistemaID).Count();

        if (existeTarea == 0)
        {
            var eliminarSistema = _context.TipoSistemas.Find(TipoSistemaID);
            _context.Remove(eliminarSistema);
            _context.SaveChanges();
            eliminado = true;
        }


        return Json(eliminado);
    }
}
