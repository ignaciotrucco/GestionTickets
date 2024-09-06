using System.ComponentModel.DataAnnotations;

namespace GestionTicket.Models;
public class TipoTarea {
    [Key]
    public int TipoTareaID {get; set;}
    public string Nombre {get; set;}
    public bool TareaSimple {get; set;}
    public bool Eliminado {get; set;}
    public ICollection<Tarea> Tareas {get; set;}
}