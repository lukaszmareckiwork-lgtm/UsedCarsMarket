using api.Models;

namespace api.Interfaces
{
    public interface IMakesRepository
    {
        Task<List<Make>> GetAllAsync();
        Task<List<Make>> GetModelsAsync(List<int> makeIds);
    }
}
