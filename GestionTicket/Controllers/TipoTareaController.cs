using System.Diagnostics; //Contexto principal
using Microsoft.AspNetCore.Mvc;
using GestionTicket.Models;
using GestionTicket.Data;
using Microsoft.Extensions.ObjectPool;

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


    public JsonResult GuardarTipo(int? tipoTareaID, string Nombre)
    {
        var nombreExiste = _context.TipoTareas
            .Where(t => t.Nombre.ToLower() == Nombre.ToLower() && t.Eliminado == false)
            .ToList();

        if (nombreExiste.Count > 0 )
        {
            return Json(new { success = false, prueba = nombreExiste });
        }

        if(tipoTareaID == 0){
            var nuevoTipo = new TipoTarea{
                Nombre = Nombre
            };

            _context.TipoTareas.Add(nuevoTipo);
            _context.SaveChanges();

            return Json(new { success = true, prueba = nombreExiste });
        }else{
            var tipoEditar = _context.TipoTareas.Where(t => t.TipoTareaID == tipoTareaID).SingleOrDefault();

            tipoEditar.Nombre = Nombre;

            _context.SaveChanges();

            return Json(true);
        }
    }

    public JsonResult ListarTipos(int? tipoTareaID)
    {
        var lista = _context.TipoTareas.Where( t => t.Eliminado == false).ToList();

        if(tipoTareaID == 0){
            
            var listaNew = lista.Select(l => new TipoTarea(){
                TipoTareaID = l.TipoTareaID,
                Nombre = l.Nombre
            }).ToList();

            return Json(new{ success = true, lista = listaNew });
            
        }else{
            lista = lista.Where(t => t.TipoTareaID == tipoTareaID).ToList();

            var listaNew = lista.Select(l => new TipoTarea(){
                TipoTareaID = l.TipoTareaID,
                Nombre = l.Nombre
            }).ToList();

            return Json(new{ success = true, lista = listaNew });
        }

        return Json(false);
    }

    public JsonResult EliminarTarea(int tipoTareaID){

        var tipoTareaElimnar = _context.TipoTareas.Find(tipoTareaID);

        tipoTareaElimnar.Eliminado = true;
        _context.SaveChanges();

        return Json(true);
    }

}
