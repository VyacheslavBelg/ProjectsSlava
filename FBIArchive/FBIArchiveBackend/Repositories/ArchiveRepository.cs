using FBIArchive.Data;
using FBIArchive.Models;
using Microsoft.EntityFrameworkCore;

namespace FBIArchive.Repositories
{
    public class ArchiveRepository : IArchiveRepository
    {
        private readonly FBIArchiveContext _context;

        public ArchiveRepository(FBIArchiveContext context)
        {
            _context = context;
        }

        public async Task<List<Case>> SearchCasesAsync(string query)
        {
           
            return await _context.Cases
                .Where(c => c.Code.Contains(query) || c.Name.Contains(query))
                .ToListAsync();
        }

        public async Task<List<Document>> SearchDocumentsAsync(string query)
        {
            
            return await _context.Documents
                .Include(d => d.Case)
                .Where(d => d.Name.Contains(query))
                .ToListAsync();
        }

        public async Task<List<Series>> SearchSeriesAsync(string query)
        {
            return await _context.Series
                .Where(s => s.Code.Contains(query) || s.Name.Contains(query))
                .ToListAsync();
        }
    }
}