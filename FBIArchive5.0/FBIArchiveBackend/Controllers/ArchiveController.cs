using Microsoft.AspNetCore.Mvc;
using FBIArchive.Services;
using Microsoft.AspNetCore.Authorization;
using FBIArchive.Repositories;
using FBIArchive.Models;

namespace FBIArchive.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ArchiveController : ControllerBase
    {
        private readonly IArchiveService _archiveService;
        private readonly IArchiveRepository _archiveRepository;

        public ArchiveController(IArchiveService archiveService, IArchiveRepository archiveRepository)
        {
            _archiveService = archiveService;
            _archiveRepository = archiveRepository;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            var result = await _archiveService.SearchGlobalAsync(query);
            return Ok(result);
        }

        [HttpPost("search/filtered")]
        public async Task<IActionResult> SearchWithFilters([FromBody] SearchRequestDto request)
        {
            var result = await _archiveService.SearchWithFiltersAsync(request);
            return Ok(result);
        }

        [HttpGet("search/advanced")]
        public async Task<IActionResult> SearchAdvanced(
            [FromQuery] string? query,
            [FromQuery] string entityType = "all",
            [FromQuery] string status = "",
            [FromQuery] string securityLevel = "",
            [FromQuery] string documentType = "",
            [FromQuery] string post = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                string DecodeParam(string param)
                {
                    if (string.IsNullOrEmpty(param)) return "";

                    try
                    {
                        return Uri.UnescapeDataString(param);
                    }
                    catch
                    {
                        return param;
                    }
                }

                var request = new SearchRequestDto
                {
                    Query = query ?? "",
                    EntityType = DecodeParam(entityType ?? "all"),
                    Status = DecodeParam(status ?? ""),
                    SecurityLevel = DecodeParam(securityLevel ?? ""),
                    DocumentType = DecodeParam(documentType ?? ""),
                    Post = DecodeParam(post ?? ""),
                    Page = page,
                    PageSize = pageSize
                };

                var result = await _archiveService.SearchWithFiltersAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Search error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return Ok(new SearchResultDto
                {
                    Cases = new List<CaseDto>(),
                    Documents = new List<DocumentDto>(),
                    Series = new List<SeriesDto>(),
                    Defendants = new List<DefendantDto>(),
                    Employees = new List<EmployeeDto>()
                });
            }
        }

        [HttpGet("document/{id}")]
        public async Task<IActionResult> GetDocument(int id)
        {
            var document = await _archiveRepository.GetDocumentByIdAsync(id);
            if (document == null) return NotFound();

            var documentDto = new DocumentDetailDto
            {
                Id = document.Id,
                Name = document.Name ?? "",
                CreateDate = document.CreateDate,
                SecurityLevel = document.SecurityLevel ?? "",
                DocumentType = document.DocumentType ?? "",
                Case = document.Case != null ? new CaseDto
                {
                    Id = document.Case.Id,
                    Code = document.Case.Code ?? "",
                    Name = document.Case.Name ?? "",
                    Status = document.Case.Status ?? "",
                    OpenDate = document.Case.OpenDate,
                    CloseDate = document.Case.CloseDate
                } : null,
                Series = document.Series != null ? new SeriesDto
                {
                    Id = document.Series.Id,
                    Code = document.Series.Code ?? "",
                    Name = document.Series.Name ?? "",
                    YearPeriod = document.Series.YearPeriod ?? ""
                } : null
            };

            return Ok(documentDto);
        }

        [HttpGet("case/{id}")]
        public async Task<IActionResult> GetCase(int id)
        {
            var caseEntity = await _archiveRepository.GetCaseByIdAsync(id);
            if (caseEntity == null) return NotFound();

            var caseDto = new CaseDetailDto
            {
                Id = caseEntity.Id,
                Code = caseEntity.Code ?? "",
                Name = caseEntity.Name ?? "",
                Description = caseEntity.Description ?? "",
                Status = caseEntity.Status ?? "",
                OpenDate = caseEntity.OpenDate,
                CloseDate = caseEntity.CloseDate,
                Defendant = caseEntity.Defendant != null ? new DefendantDto
                {
                    Id = caseEntity.Defendant.Id,
                    Name = caseEntity.Defendant.Name ?? "",
                    Surname = caseEntity.Defendant.Surname ?? "",
                    Alias = caseEntity.Defendant.Alias ?? "",
                    BirthDate = caseEntity.Defendant.BirthDate,
                    DeathDate = caseEntity.Defendant.DeathDate,
                    Status = caseEntity.Defendant.Status ?? "",
                    PhotoUrl = caseEntity.Defendant.PhotoUrl ?? ""
                } : null,
                Employee = caseEntity.Employee != null ? new EmployeeDto
                {
                    Id = caseEntity.Employee.Id,
                    Badge = caseEntity.Employee.Badge ?? "",
                    Name = caseEntity.Employee.Name ?? "",
                    Surname = caseEntity.Employee.Surname ?? "",
                    BirthDate = caseEntity.Employee.BirthDate,
                    DeathDate = caseEntity.Employee.DeathDate,
                    Post = caseEntity.Employee.Post ?? "",
                    PhotoUrl = caseEntity.Employee.PhotoUrl ?? ""
                } : null,
                Documents = caseEntity.Documents?.Select(d => new DocumentDto
                {
                    Id = d.Id,
                    Name = d.Name ?? "",
                    SecurityLevel = d.SecurityLevel ?? "",
                    Type = d.DocumentType ?? "",
                    CaseName = d.Case?.Name ?? "N/A",
                    CreateDate = d.CreateDate
                }).ToList() ?? new List<DocumentDto>()
            };

            return Ok(caseDto);
        }

        [HttpGet("series/{id}")]
        public async Task<IActionResult> GetSeries(int id)
        {
            var series = await _archiveRepository.GetSeriesByIdAsync(id);
            if (series == null) return NotFound();

            var seriesDto = new SeriesDetailDto
            {
                Id = series.Id,
                Code = series.Code ?? "",
                Name = series.Name ?? "",
                Description = series.Description ?? "",
                YearPeriod = series.YearPeriod ?? "",
                Documents = series.Documents?.Select(d => new DocumentDto
                {
                    Id = d.Id,
                    Name = d.Name ?? "",
                    SecurityLevel = d.SecurityLevel ?? "",
                    Type = d.DocumentType ?? "",
                    CaseName = d.Case?.Name ?? "N/A",
                    CreateDate = d.CreateDate
                }).ToList() ?? new List<DocumentDto>()
            };

            return Ok(seriesDto);
        }

        [HttpGet("defendant/{id}")]
        public async Task<IActionResult> GetDefendant(int id)
        {
            var defendant = await _archiveRepository.GetDefendantByIdAsync(id);
            if (defendant == null) return NotFound();

            OrganizationDto? organizationDto = null;
            if (defendant.Organization != null)
            {
                organizationDto = new OrganizationDto
                {
                    Id = defendant.Organization.Id,
                    Name = defendant.Organization.Name ?? "",
                    Description = defendant.Organization.Description ?? "",
                    OrganizationType = defendant.Organization.OrganizationType ?? "",
                    EstablishedDate = defendant.Organization.EstablishedDate,
                    DisbandedDate = defendant.Organization.DisbandedDate,
                    Status = defendant.Organization.Status ?? ""
                };
            }

            var defendantDto = new DefendantDetailDto
            {
                Id = defendant.Id,
                Name = defendant.Name ?? "",
                Surname = defendant.Surname ?? "",
                Alias = defendant.Alias ?? "",
                BirthDate = defendant.BirthDate,
                DeathDate = defendant.DeathDate,
                Status = defendant.Status ?? "",
                PhotoUrl = defendant.PhotoUrl ?? "",
                Organization = organizationDto ?? new OrganizationDto(),
                Cases = defendant.Cases?.Select(c => new CaseDto
                {
                    Id = c.Id,
                    Code = c.Code ?? "",
                    Name = c.Name ?? "",
                    Status = c.Status ?? "",
                    OpenDate = c.OpenDate,
                    CloseDate = c.CloseDate
                }).ToList() ?? new List<CaseDto>()
            };

            return Ok(defendantDto);
        }

        [HttpGet("employee/{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var employee = await _archiveRepository.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound();

            InvestigationDepartmentDto? departmentDto = null;
            if (employee.InvestigationDepartment != null)
            {
                departmentDto = new InvestigationDepartmentDto
                {
                    Id = employee.InvestigationDepartment.Id,
                    Name = employee.InvestigationDepartment.Name ?? "",
                    Code = employee.InvestigationDepartment.Code ?? "",
                    Description = employee.InvestigationDepartment.Description ?? "",
                    DepartmentType = employee.InvestigationDepartment.DepartmentType ?? "",
                    EstablishedDate = employee.InvestigationDepartment.EstablishedDate,
                    Status = employee.InvestigationDepartment.Status ?? ""
                };
            }

            var employeeDto = new EmployeeDetailDto
            {
                Id = employee.Id,
                Badge = employee.Badge ?? "",
                Name = employee.Name ?? "",
                Surname = employee.Surname ?? "",
                BirthDate = employee.BirthDate,
                DeathDate = employee.DeathDate,
                Post = employee.Post ?? "",
                PhotoUrl = employee.PhotoUrl ?? "",
                InvestigationDepartment = departmentDto ?? new InvestigationDepartmentDto(),
                Cases = employee.Cases?.Select(c => new CaseDto
                {
                    Id = c.Id,
                    Code = c.Code ?? "",
                    Name = c.Name ?? "",
                    Status = c.Status ?? "",
                    OpenDate = c.OpenDate,
                    CloseDate = c.CloseDate
                }).ToList() ?? new List<CaseDto>()
            };

            return Ok(employeeDto);
        }

        [HttpGet("organization/{id}")]
        public async Task<IActionResult> GetOrganization(int id)
        {
            var organization = await _archiveRepository.GetOrganizationByIdAsync(id);
            if (organization == null) return NotFound();

            var organizationDto = new OrganizationDetailDto
            {
                Id = organization.Id,
                Name = organization.Name ?? "",
                Description = organization.Description ?? "",
                OrganizationType = organization.OrganizationType ?? "",
                EstablishedDate = organization.EstablishedDate,
                DisbandedDate = organization.DisbandedDate,
                Status = organization.Status ?? "",
                Defendants = organization.Defendants?.Select(d => new DefendantDto
                {
                    Id = d.Id,
                    Name = d.Name ?? "",
                    Surname = d.Surname ?? "",
                    Alias = d.Alias ?? "",
                    BirthDate = d.BirthDate,
                    DeathDate = d.DeathDate,
                    Status = d.Status ?? "",
                    PhotoUrl = d.PhotoUrl ?? ""
                }).ToList() ?? new List<DefendantDto>()
            };

            return Ok(organizationDto);
        }

        [HttpGet("department/{id}")]
        public async Task<IActionResult> GetInvestigationDepartment(int id)
        {
            var department = await _archiveRepository.GetInvestigationDepartmentByIdAsync(id);
            if (department == null) return NotFound();

            var departmentDto = new InvestigationDepartmentDetailDto
            {
                Id = department.Id,
                Name = department.Name ?? "",
                Code = department.Code ?? "",
                Description = department.Description ?? "",
                DepartmentType = department.DepartmentType ?? "",
                EstablishedDate = department.EstablishedDate,
                Status = department.Status ?? "",
                Employees = department.Employees?.Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    Badge = e.Badge ?? "",
                    Name = e.Name ?? "",
                    Surname = e.Surname ?? "",
                    BirthDate = e.BirthDate,
                    DeathDate = e.DeathDate,
                    Post = e.Post ?? "",
                    PhotoUrl = e.PhotoUrl ?? ""
                }).ToList() ?? new List<EmployeeDto>()
            };

            return Ok(departmentDto);
        }
    }
}