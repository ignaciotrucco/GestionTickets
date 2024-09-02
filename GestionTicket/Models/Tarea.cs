namespace GestionTicket.Models;
public class Tarea {
    public int TareaID {get; set;}
    public TipoTarea TipoTarea {get; set;}
    public int UsuarioID {get; set;}
    public int TiempoEstimado {get; set;}
    public string DetalleTarea {get; set;}
    public string? Observaciones {get; set;}
}

public enum TipoTarea {
    Desarrollo = 1,
    Testing,
    Cobranzas,
    AtencionYCapacitacion,
    Migraciones,
    Implementaciones
}