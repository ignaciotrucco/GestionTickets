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
                var existeSistema = _context.TipoSistemas.Where(e => e.TipoSistemaID == TipoSistemaID).Count();
                if (existeSistema == 0)
                {
                    var nuevoSistema = new TipoSistema
                    {
                        Nombre = Nombre
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

    public JsonResult EliminarSistema(int TipoSistemaID)
    {

        var eliminarSistema = _context.TipoSistemas.Find(TipoSistemaID);
        _context.Remove(eliminarSistema);
        _context.SaveChanges();

        return Json(eliminarSistema);
    }
}
