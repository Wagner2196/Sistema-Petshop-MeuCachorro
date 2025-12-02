using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Meucachorro.Dominio.Entidades;

namespace Meucachorro.Repositorio.Configuracoes
{
    public class UsuarioConfiguracoes : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            // Definindo a chave primária
            builder.ToTable("Usuario").HasKey(x => x.ID);

            // Definição dos mapeamentos das propriedades
            builder.Property(nameof(Usuario.ID)).HasColumnName("UsuarioID"); // Nome da coluna no banco de dados
            builder.Property(nameof(Usuario.Nome)).HasColumnName("Nome").IsRequired(); // Nome é obrigatório
            builder.Property(nameof(Usuario.Email)).HasColumnName("Email").IsRequired(); // Email é obrigatório
            builder.Property(nameof(Usuario.Endereco)).HasColumnName("Endereco").IsRequired(); // Endereço é obrigatório
            builder.Property(nameof(Usuario.Telefone)).HasColumnName("Telefone").IsRequired(); // Telefone é obrigatório
            builder.Property(nameof(Usuario.Ativo)).HasColumnName("Ativo").IsRequired(); // Define se o usuário está ativo no sistema
            builder.Property(nameof(Usuario.TipoUsuarioID)).HasColumnName("TipoUsuarioID").IsRequired(); // Tipo de usuário é obrigatório

            // Para o campo SenhaHash, caso você deseje mapeá-lo
            builder.Property(nameof(Usuario.SenhaHash)).HasColumnName("SenhaHash"); // Senha armazenada de forma segura

            // Definição do relacionamento entre Usuario e Animal (1:N)
            builder
                .HasMany(x => x.Animal) // Um usuário pode ter vários animais
                .WithOne(x => x.Usuario) // Cada animal pertence a um único usuário
                .HasForeignKey(x => x.UsuarioID) // A chave estrangeira na tabela Animal será UsuarioID

                // ❗ CORREÇÃO IMPORTANTE:
                // Cascade obriga INNER JOIN e causava consultas sumindo nos relatórios.
                // Restrict permite LEFT JOIN e mantém integridade.
                .OnDelete(DeleteBehavior.Restrict); // Restrição para evitar exclusão em cascata de usuários

            // Definição do relacionamento entre Usuario e Consulta (1:N)
            builder
                .HasMany(x => x.Consultas) // Um usuário pode ter várias consultas (como dono ou veterinário)
                .WithOne(x => x.Usuario) // Cada consulta pertence a um único usuário
                .HasForeignKey(x => x.UsuarioID) // A chave estrangeira na tabela Consulta será UsuarioID
                .OnDelete(DeleteBehavior.Restrict); // Não permite deletar um usuário se houver consultas associadas
        }
    }
}
