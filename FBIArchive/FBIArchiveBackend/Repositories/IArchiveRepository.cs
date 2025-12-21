using FBIArchive.Models;

namespace FBIArchive.Repositories
{
    public interface IArchiveRepository
    {
        Task<List<Case>> SearchCasesAsync(string query);
        Task<List<Document>> SearchDocumentsAsync(string query);
        Task<List<Series>> SearchSeriesAsync(string query);
    }
}