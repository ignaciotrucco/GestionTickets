using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GestionTicket.Models;
using GestionTicket.Data;
using Microsoft.Extensions.ObjectPool;
using Microsoft.EntityFrameworkCore;

namespace GestionTicket.Controllers;

public class TipoTareaController : Controller
{
    private ApplicationDbContext _context;

    public TipoTareaController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }


    public JsonResult GuardarTipo(int? tipoTareaID, string Nombre, bool TareaSimple)
    {
        Nombre = Nombre.ToUpper();

        if(tipoTareaID == 0){

            var nombreExists = _context.TipoTareas.Where(e => e.Nombre == Nombre).Count();

            if(nombreExists == 0){

                var nuevoTipo = new TipoTarea{
                    Nombre = Nombre,
                    TareaSimple = TareaSimple
                };

                _context.TipoTareas.Add(nuevoTipo);
                _context.SaveChanges();

                return Json(new { success = true });

            }else{
                return Json(new { success = false });
            }

        }else{
            var tipoEditar = _context.TipoTareas.Where(t => t.TipoTareaID == tipoTareaID).SingleOrDefault();

            if(tipoEditar != null){

                tipoEditar.Nombre = Nombre;
                tipoEditar.TareaSimple = TareaSimple;
                _context.SaveChanges();

                return Json(new { success = true });
                
            }else{
                return Json(new { success = false });
            }
        }
    }

    public JsonResult ListarTipos(int? tipoTareaID)
    {
        var lista = _context.TipoTareas.ToList();

        if(tipoTareaID == 0){
            
            var listaNew = lista.Select(l => new TipoTarea(){
                TipoTareaID = l.TipoTareaID,
                Eliminado = l.Eliminado,
                TareaSimple = l.TareaSimple,
                Nombre = l.Nombre
            }).ToList();

            return Json(new{ success = true, lista = listaNew });
            
        }else{
            lista = lista.Where(t => t.TipoTareaID == tipoTareaID).ToList();

            var listaNew = lista.Select(l => new TipoTarea(){
                TipoTareaID = l.TipoTareaID,
                Eliminado = l.Eliminado,
                TareaSimple = l.TareaSimple,
                Nombre = l.Nombre
            }).ToList();

            return Json(new{ success = true, lista = listaNew });
        }
    }

    public JsonResult EliminarTarea(int tipoTareaID){

        var tareaConTipotarea = _context.Tareas.Include(t => t.TipoTarea).ToList();
        var tipoTareaElimnar = _context.TipoTareas.Find(tipoTareaID);

        var existsTarea = tareaConTipotarea.Any(e => e.TipoTareaID == tipoTareaID);

        if(!existsTarea){
            _context.TipoTareas.Remove(tipoTareaElimnar);
            _context.SaveChanges();

            return Json(new{success = true});

        }else{
            return Json(new{success = false});
        }
    }

    public JsonResult DesactivarTarea(int tipoTareaID)
    {
        bool eliminado = false;

        var existeTarea = _context.TipoTareas.Where(t => t.TipoTareaID == tipoTareaID).Count();

        if (existeTarea > 0)
        {
            var desactivarTarea = _context.TipoTareas.Find(tipoTareaID);
            desactivarTarea.Eliminado = true;
            _context.SaveChanges();
            eliminado = true;
        }

        return Json(eliminado);
    }
    public JsonResult ActivarTarea(int tipoTareaID)
    {
        bool eliminado = true;

        var existeTarea = _context.TipoTareas.Where(t => t.TipoTareaID == tipoTareaID).Count();

        if (existeTarea > 0)
        {
            var desactivarTarea = _context.TipoTareas.Find(tipoTareaID);
            desactivarTarea.Eliminado = false;
            _context.SaveChanges();
            eliminado = false;
        }

        return Json(eliminado);
    }

}
