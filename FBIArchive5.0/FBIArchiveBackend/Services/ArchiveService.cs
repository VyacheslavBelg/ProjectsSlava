using FBIArchive.Models;
using FBIArchive.Repositories;
using Microsoft.Extensions.Logging;

namespace FBIArchive.Services
{
    public class ArchiveService : IArchiveService
    {
        private readonly IArchiveRepository _repository;
        private readonly ILogger<ArchiveService> _logger;

        public ArchiveService(IArchiveRepository repository, ILogger<ArchiveService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<SearchResultDto> SearchGlobalAsync(string query)
        {
            _logger.LogInformation($"SearchGlobalAsync called with query: '{query}'");

            try
            {
                var request = new SearchRequestDto
                {
                    Query = query,
                    EntityType = "all"
                };

                return await SearchWithFiltersAsync(request);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in SearchGlobalAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<SearchResultDto> SearchWithFiltersAsync(SearchRequestDto request)
        {
            _logger.LogInformation($"SearchWithFiltersAsync called with: Query='{request.Query}', " +
                                  $"EntityType='{request.EntityType}', Status='{request.Status}', " +
                                  $"SecurityLevel='{request.SecurityLevel}', DocumentType='{request.DocumentType}', " +
                                  $"Post='{request.Post}'");

            var result = new SearchResultDto();

            try
            {
                bool isEmptyQuery = string.IsNullOrWhiteSpace(request.Query);

                _logger.LogInformation($"isEmptyQuery: {isEmptyQuery}");

                switch (request.EntityType.ToLower())
                {
                    case "all":
                        if (isEmptyQuery)
                        {
                            _logger.LogInformation("Searching ALL entities with empty query");

                            var allCasesTask = _repository.GetAllCasesAsync(request.Status);
                            var allDocsTask = _repository.GetAllDocumentsAsync(request.SecurityLevel, request.DocumentType);
                            var allSeriesTask = _repository.GetAllSeriesAsync();
                            var allDefendantsTask = _repository.GetAllDefendantsAsync(request.Status);
                            var allEmployeesTask = _repository.GetAllEmployeesAsync(request.Post);

                            await Task.WhenAll(allCasesTask, allDocsTask, allSeriesTask, allDefendantsTask, allEmployeesTask);

                            result.Cases = allCasesTask.Result.Select(c => MapToCaseDto(c)).ToList();
                            result.Documents = allDocsTask.Result.Select(d => MapToDocumentDto(d)).ToList();
                            result.Series = allSeriesTask.Result.Select(s => MapToSeriesDto(s)).ToList();
                            result.Defendants = allDefendantsTask.Result.Select(d => MapToDefendantDto(d)).ToList();
                            result.Employees = allEmployeesTask.Result.Select(e => MapToEmployeeDto(e)).ToList();

                            _logger.LogInformation($"Found: {result.Cases.Count} cases, {result.Documents.Count} docs, " +
                                                  $"{result.Series.Count} series, {result.Defendants.Count} defendants, " +
                                                  $"{result.Employees.Count} employees");
                        }
                        else
                        {
                            _logger.LogInformation($"Searching ALL entities with query: {request.Query}");

                            var casesTask = string.IsNullOrEmpty(request.Status)
                                ? _repository.SearchCasesAsync(request.Query)
                                : _repository.SearchCasesWithFiltersAsync(request.Query, request.Status);

                            var docsTask = (string.IsNullOrEmpty(request.SecurityLevel) && string.IsNullOrEmpty(request.DocumentType))
                                ? _repository.SearchDocumentsAsync(request.Query)
                                : _repository.SearchDocumentsWithFiltersAsync(request.Query, request.SecurityLevel, request.DocumentType);

                            var seriesTask = _repository.SearchSeriesAsync(request.Query);

                            var defendantsTask = string.IsNullOrEmpty(request.Status)
                                ? _repository.SearchDefendantsAsync(request.Query)
                                : _repository.SearchDefendantsWithFiltersAsync(request.Query, request.Status);

                            var employeesTask = _repository.SearchEmployeesWithFiltersAsync(request.Query, request.Post);

                            await Task.WhenAll(casesTask, docsTask, seriesTask, defendantsTask, employeesTask);

                            result.Cases = casesTask.Result.Select(c => MapToCaseDto(c)).ToList();
                            result.Documents = docsTask.Result.Select(d => MapToDocumentDto(d)).ToList();
                            result.Series = seriesTask.Result.Select(s => MapToSeriesDto(s)).ToList();
                            result.Defendants = defendantsTask.Result.Select(d => MapToDefendantDto(d)).ToList();
                            result.Employees = employeesTask.Result.Select(e => MapToEmployeeDto(e)).ToList();
                        }
                        break;

                    case "cases":
                        if (isEmptyQuery)
                        {
                            result.Cases = (await _repository.GetAllCasesAsync(request.Status))
                                .Select(c => MapToCaseDto(c)).ToList();
                        }
                        else
                        {
                            result.Cases = (await _repository.SearchCasesWithFiltersAsync(request.Query, request.Status))
                                .Select(c => MapToCaseDto(c)).ToList();
                        }
                        break;

                    case "documents":
                        if (isEmptyQuery)
                        {
                            result.Documents = (await _repository.GetAllDocumentsAsync(request.SecurityLevel, request.DocumentType))
                                .Select(d => MapToDocumentDto(d)).ToList();
                        }
                        else
                        {
                            result.Documents = (await _repository.SearchDocumentsWithFiltersAsync(
                                request.Query, request.SecurityLevel, request.DocumentType))
                                .Select(d => MapToDocumentDto(d)).ToList();
                        }
                        break;

                    case "series":
                        if (isEmptyQuery)
                        {
                            result.Series = (await _repository.GetAllSeriesAsync())
                                .Select(s => MapToSeriesDto(s)).ToList();
                        }
                        else
                        {
                            result.Series = (await _repository.SearchSeriesAsync(request.Query))
                                .Select(s => MapToSeriesDto(s)).ToList();
                        }
                        break;

                    case "defendants":
                        if (isEmptyQuery)
                        {
                            result.Defendants = (await _repository.GetAllDefendantsAsync(request.Status))
                                .Select(d => MapToDefendantDto(d)).ToList();
                        }
                        else
                        {
                            result.Defendants = (await _repository.SearchDefendantsWithFiltersAsync(request.Query, request.Status))
                                .Select(d => MapToDefendantDto(d)).ToList();
                        }
                        break;

                    case "employees":
                        if (isEmptyQuery)
                        {
                            result.Employees = (await _repository.GetAllEmployeesAsync(request.Post))
                                .Select(e => MapToEmployeeDto(e)).ToList();
                        }
                        else
                        {
                            result.Employees = (await _repository.SearchEmployeesWithFiltersAsync(request.Query, request.Post))
                                .Select(e => MapToEmployeeDto(e)).ToList();
                        }
                        break;
                }

                _logger.LogInformation($"Search completed successfully. Total results: " +
                                      $"{result.Cases.Count + result.Documents.Count + result.Series.Count +
                                        result.Defendants.Count + result.Employees.Count}");

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in SearchWithFiltersAsync: {ex.Message}");

                return new SearchResultDto
                {
                    Cases = new List<CaseDto>(),
                    Documents = new List<DocumentDto>(),
                    Series = new List<SeriesDto>(),
                    Defendants = new List<DefendantDto>(),
                    Employees = new List<EmployeeDto>()
                };
            }
        }

        private CaseDto MapToCaseDto(Case c)
        {
            return new CaseDto
            {
                Id = c.Id,
                Code = c.Code ?? "",
                Name = c.Name ?? "",
                Status = c.Status ?? "",
                OpenDate = c.OpenDate,
                CloseDate = c.CloseDate
            };
        }

        private DocumentDto MapToDocumentDto(Document d)
        {
            return new DocumentDto
            {
                Id = d.Id,
                Name = d.Name ?? "",
                SecurityLevel = d.SecurityLevel ?? "",
                Type = d.DocumentType ?? "",
                CaseName = d.Case?.Name ?? "N/A",
                CreateDate = d.CreateDate
            };
        }

        private SeriesDto MapToSeriesDto(Series s)
        {
            return new SeriesDto
            {
                Id = s.Id,
                Code = s.Code ?? "",
                Name = s.Name ?? "",
                YearPeriod = s.YearPeriod ?? ""
            };
        }

        private DefendantDto MapToDefendantDto(Defendant d)
        {
            return new DefendantDto
            {
                Id = d.Id,
                Name = d.Name ?? "",
                Surname = d.Surname ?? "",
                Alias = d.Alias ?? "",
                BirthDate = d.BirthDate,
                DeathDate = d.DeathDate,
                Status = d.Status ?? "",
                PhotoUrl = d.PhotoUrl ?? ""
            };
        }

        private EmployeeDto MapToEmployeeDto(Employee e)
        {
            return new EmployeeDto
            {
                Id = e.Id,
                Badge = e.Badge ?? "",
                Name = e.Name ?? "",
                Surname = e.Surname ?? "",
                BirthDate = e.BirthDate,
                DeathDate = e.DeathDate,
                Post = e.Post ?? "",
                PhotoUrl = e.PhotoUrl ?? ""
            };
        }
    }
}