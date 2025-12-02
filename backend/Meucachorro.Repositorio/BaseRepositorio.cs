public abstract class BaseRepositorio
{
    protected readonly MeucachorroContexto _contexto;

    protected BaseRepositorio(MeucachorroContexto contexto)
    {
        _contexto = contexto;
    }
}