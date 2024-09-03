using System.ComponentModel.DataAnnotations;

namespace GestionTicket.Models;
public class TipoSistema {
    [Key]
    public int TipoSistemaID {get; set;}
    public string Nombre {get; set;}
    public bool Eliminado {get; set;}
    public ICollection<Tarea> Tareas {get; set;}
}
