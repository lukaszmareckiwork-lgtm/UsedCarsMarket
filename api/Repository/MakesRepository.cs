using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class MakesRepository : IMakesRepository
    {
        private readonly ApplicationDBContext _dbContext;

        public MakesRepository(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Make>> GetAllAsync()
        {
            return await _dbContext.Makes
                .AsNoTracking()
                .OrderBy(m => m.MakeName)
                .ToListAsync();
        }

        public async Task<List<Make>> GetModelsAsync(List<int> makeIds)
        {
            return await _dbContext.Makes
                .AsNoTracking()
                .Where(m => makeIds.Contains(m.MakeId))
                .Include(m => m.Models)
                .OrderBy(m => m.MakeName)
                .ToListAsync();
        }
    }
}
