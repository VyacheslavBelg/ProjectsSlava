using FBIArchive.Models;

namespace FBIArchive.Services
{
    public interface IArchiveService
    {
        Task<SearchResultDto> SearchGlobalAsync(string query);
        Task<SearchResultDto> SearchWithFiltersAsync(SearchRequestDto request);
    }
}