using System.ComponentModel.DataAnnotations;

namespace GestionTicket.Models;
public class Tarea {
    [Key]
    public int TareaID {get; set;}
    public string TituloTarea {get; set;}
    public int TipoTareaID {get; set;}
    public int TipoSistemaID {get; set;}
    public int UsuarioID {get; set;}
    public DateTime FechaInicio {get; set;}
    public int TiempoEstimado {get; set;}
    public string? Observaciones {get; set;}
    public bool Eliminado {get; set;}
    public virtual TipoTarea TipoTarea {get; set;}
    public virtual TipoSistema TipoSistema {get; set;}
    public ICollection<SubTarea> SubTareas {get; set;}
}