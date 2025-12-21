using FBIArchive.Models;
using FBIArchive.Repositories;

namespace FBIArchive.Services
{
    public class ArchiveService : IArchiveService
    {
        private readonly IArchiveRepository _repository;

        public ArchiveService(IArchiveRepository repository)
        {
            _repository = repository;
        }

        public async Task<SearchResultDto> SearchGlobalAsync(string query)
        {
            var result = new SearchResultDto();

            
            if (string.IsNullOrWhiteSpace(query)) return result;

            
            var cases = await _repository.SearchCasesAsync(query);
            var docs = await _repository.SearchDocumentsAsync(query);
            var series = await _repository.SearchSeriesAsync(query);

          
            result.Cases = cases.Select(c => new CaseDto
            {
                Id = c.Id,
                Code = c.Code,
                Name = c.Name,
                Description = c.Description
            }).ToList();

            result.Documents = docs.Select(d => new DocumentDto
            {
                Id = d.Id,
                Name = d.Name,
                SecurityLevel = d.SecurityLevel,
                Type = d.DocumentType,
                CaseName = d.Case?.Name ?? "N/A"
            }).ToList();

            result.Series = series.Select(s => new SeriesDto
            {
                Id = s.Id,
                Code = s.Code,
                Name = s.Name,
                YearPeriod = s.YearPeriod
            }).ToList();

            return result;
        }
    }
}