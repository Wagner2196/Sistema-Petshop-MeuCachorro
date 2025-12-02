using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Meucachorro.Dominio.Entidades;

namespace Meucachorro.Repositorio.Configuracoes
{
    public class AnimalConfiguracoes : IEntityTypeConfiguration<Animal>
    {
        public void Configure(EntityTypeBuilder<Animal> builder)
        {
            // Tabela e chave
            builder.ToTable("Animal").HasKey(x => x.ID);

            // Colunas
            builder.Property(nameof(Animal.ID)).HasColumnName("AnimalID");
            builder.Property(nameof(Animal.Especie)).HasColumnName("Especie").IsRequired();
            builder.Property(nameof(Animal.Nome)).HasColumnName("Nome").IsRequired();
            builder.Property(nameof(Animal.Raca)).HasColumnName("Raca").IsRequired();
            builder.Property(nameof(Animal.DataPerdido)).HasColumnName("DataPerdido");
            builder.Property(nameof(Animal.Achado)).HasColumnName("Achado").IsRequired();
            builder.Property(nameof(Animal.UrlImagem)).HasColumnName("UrlImagem");
            builder.Property(nameof(Animal.Ativo)).HasColumnName("Ativo").IsRequired();

            builder.Property(nameof(Animal.UsuarioID))
                   .HasColumnName("UsuarioID")
                   .IsRequired();

            // Relacionamento ANIMAL → USUARIO
            builder.HasOne(a => a.Usuario)
                   .WithMany(u => u.Animal)
                   .HasForeignKey(a => a.UsuarioID)
                   .OnDelete(DeleteBehavior.Restrict);

            // RELACIONAMENTO ANIMAL → CONSULTAS (CORRIGIDO!)
            builder.HasMany(a => a.Consultas)
                   .WithOne(c => c.Animal)
                   .HasForeignKey(c => c.AnimalID)
                   .OnDelete(DeleteBehavior.Restrict); // ✔ CORREÇÃO AQUI
        }
    }
}
