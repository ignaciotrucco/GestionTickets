using System.ComponentModel.DataAnnotations;

namespace GestionTicket.Models;
public class SubTarea {
    [Key]
    public int SubTareaID {get; set;}
    public int TareaID {get; set;}
    public string Descripcion {get; set;}
    public Estado Estado {get; set;}
    public virtual Tarea Tarea {get; set;}
}

public enum Estado {
    Pendiente = 1,
    EnProgreso,
    Finalizado,
}