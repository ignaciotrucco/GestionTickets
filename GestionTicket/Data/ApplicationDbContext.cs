using GestionTicket.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GestionTicket.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<TipoTarea> TipoTareas {get; set;}
    public DbSet<TipoSistema> TipoSistemas {get; set;}
    public DbSet<Tarea> Tareas {get; set;}
    public DbSet<SubTarea> SubTareas {get; set;}
}
