using Microsoft.EntityFrameworkCore;
using Meucachorro.Dominio.Entidades;
using Meucachorro.Repositorio.Configuracoes;

public class MeucachorroContexto : DbContext
{
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Animal> Animais { get; set; }
    public DbSet<Consulta> Consultas { get; set; }

    public MeucachorroContexto() { }

    public MeucachorroContexto(DbContextOptions<MeucachorroContexto> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(@"Server=DESKTOP-8VD4HDE\SQLEXPRESS;Database=MeucachorroDB;Trusted_Connection=True;TrustServerCertificate=True;");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UsuarioConfiguracoes());
        modelBuilder.ApplyConfiguration(new AnimalConfiguracoes());
        modelBuilder.ApplyConfiguration(new ConsultaConfiguracoes());
    }
}
