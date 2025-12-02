using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Meucachorro.Dominio.Entidades;

namespace Meucachorro.Repositorio.Configuracoes
{
    public class ConsultaConfiguracoes : IEntityTypeConfiguration<Consulta>
    {
        public void Configure(EntityTypeBuilder<Consulta> builder)
        {
            // Tabela e chave primária
            builder.ToTable("Consulta")
                   .HasKey(c => c.Id)
                   .HasName("PK_Consulta");

            // Mapeamento das propriedades
            builder.Property(c => c.Id)
                .HasColumnName("ConsultaID");

            builder.Property(c => c.DataConsulta)
                .HasColumnName("DataConsulta")
                .IsRequired();

            builder.Property(c => c.Descricao)
                .HasColumnName("Descricao")
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(c => c.Valor)
                .HasColumnName("Valor")
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.Property(c => c.Ativo)
                .HasColumnName("Ativo")
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(c => c.AnimalID)
                .HasColumnName("AnimalID")
                .IsRequired();

            builder.Property(c => c.TipoConsultaID)
                .HasColumnName("TipoConsultaID")
                .IsRequired();

            builder.Property(c => c.UsuarioID)
                .HasColumnName("UsuarioID")
                .IsRequired();

            // ---------------------------
            // RELACIONAMENTO CONSULTA → ANIMAL
            // (corrigido para não fazer INNER JOIN forçado)
            // ---------------------------
            builder.HasOne(c => c.Animal)
                   .WithMany(a => a.Consultas)
                   .HasForeignKey(c => c.AnimalID)
                   .OnDelete(DeleteBehavior.Restrict);
                   // IMPORTANTE: tira o CASCADE que estava eliminando consultas

            // ---------------------------
            // RELACIONAMENTO CONSULTA → USUARIO
            // (permite que o Include funcione corretamente)
            // ---------------------------
            builder.HasOne(c => c.Usuario)
                   .WithMany(u => u.Consultas)
                   .HasForeignKey(c => c.UsuarioID)
                   .OnDelete(DeleteBehavior.Restrict);

            // Índice para melhorar desempenho
            builder.HasIndex(c => new { c.DataConsulta, c.AnimalID })
                   .HasDatabaseName("IX_Consulta_Data_Animal");
        }
    }
}
