using System.ComponentModel.DataAnnotations;

namespace GestionTicket.Models;
public class Tarea
{
    [Key]
    public int TareaID { get; set; }
    public string TituloTarea { get; set; }
    public int TipoTareaID { get; set; }
    public int? TipoSistemaID { get; set; }
    public string? UsuarioID { get; set; }
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaCierre { get; set; }
    public decimal? TiempoEstimado { get; set; }
    public string? Observaciones { get; set; }
    public bool? Eliminado { get; set; }
    public bool? Estado { get; set; }
    public virtual TipoTarea TipoTarea { get; set; }
    public virtual TipoSistema TipoSistema { get; set; }
    public ICollection<SubTarea> SubTareas { get; set; }
}



public class VistaTipoTarea
{
    public int TipoTareaID { get; set; }
    public string? Nombretipotarea { get; set; }
    public List<VistaTarea> ListadoDelasTareas { get; set; }
    public List<VistaSistema> VistaSistema { get; set; }
}

public class VistaSistema
{
    public int? TipoSistemaID { get; set; }
    public string? NombreSistema {get; set;}
    public List<VistaTarea> ListadoDelasTareas { get; set; }
}

public class VistaTarea
{
    public int TareaID { get; set; }
    public string TituloTarea { get; set; }
    public int TipoTareaID { get; set; }
    public string? Nombretipotarea { get; set; }
    public int? TipoSistemaID { get; set; }
    public string? UsuarioID { get; set; } // el creador de la tarea pre diefinido
    public string? EmailUsuario { get; set;}
    public DateTime? FechaInicio { get; set; }
    public string? FechaIniciostring { get; set; }
    public DateTime? FechaCierre { get; set; }
    public string? FechaCierrestring { get; set; }
    public decimal? TiempoEstimado { get; set; }
    public string? Observaciones { get; set; }
    public bool? Eliminado { get; set; }
    public bool? Estado { get; set; }
}



public class VistaDetalleTarea
{
    public int TareaID { get; set; }
    public string? TituloTarea { get; set; }
    public int SubTareaID { get; set; }
    public string? Descripcion { get; set; }
    public bool EstadoSubtarea { get; set; }
    public bool EliminadoSubtarea { get; set; }
    public int TipoTareaID { get; set; }
    public string? Nombretipotarea { get; set; }
    public int? TipoSistemaID { get; set; }
    public string? Nombretiposistema { get; set; }
    public string? UsuarioID { get; set; } // el creador de la tarea pre diefinido
    public DateTime? FechaInicio { get; set; }
    public string? FechaIniciostring { get; set; }
    public decimal? TiempoEstimado { get; set; }
    public string? Observaciones { get; set; }
    public bool? Eliminado { get; set; }
    public bool? Estado { get; set; }
    public List<VistaSubTareas>? Subtareas { get; set; }
}



