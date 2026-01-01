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
                .Include(c => c.Defendant)
                    .ThenInclude(d => d.Organization)
                .Include(c => c.Employee)
                    .ThenInclude(e => e.InvestigationDepartment)
                .Where(c => (c.Code != null && c.Code.Contains(query ?? "")) ||
                           (c.Name != null && c.Name.Contains(query ?? "")))
                .ToListAsync();
        }

        public async Task<List<Document>> SearchDocumentsAsync(string query)
        {
            return await _context.Documents
                .Include(d => d.Case)
                    .ThenInclude(c => c.Defendant)
                        .ThenInclude(d => d.Organization)
                .Include(d => d.Case)
                    .ThenInclude(c => c.Employee)
                        .ThenInclude(e => e.InvestigationDepartment)
                .Include(d => d.Series)
                .Where(d => d.Name != null && d.Name.Contains(query ?? ""))
                .ToListAsync();
        }

        public async Task<List<Series>> SearchSeriesAsync(string query)
        {
            return await _context.Series
                .Where(s => (s.Code != null && s.Code.Contains(query ?? "")) ||
                           (s.Name != null && s.Name.Contains(query ?? "")))
                .ToListAsync();
        }


        public async Task<List<Defendant>> SearchDefendantsAsync(string query)
        {
            return await _context.Defendants
                .Include(d => d.Organization)
                .Include(d => d.Cases)
                .Where(d => (d.Name != null && d.Name.Contains(query ?? "")) ||
                           (d.Surname != null && d.Surname.Contains(query ?? "")) ||
                           (d.Alias != null && d.Alias.Contains(query ?? "")))
                .ToListAsync();
        }

        public async Task<List<Employee>> SearchEmployeesAsync(string query)
        {
            return await _context.Employees
                .Include(e => e.InvestigationDepartment)
                .Include(e => e.Cases)
                .Where(e => (e.Name != null && e.Name.Contains(query ?? "")) ||
                           (e.Surname != null && e.Surname.Contains(query ?? "")) ||
                           (e.Badge != null && e.Badge.Contains(query ?? "")) ||
                           (e.Post != null && e.Post.Contains(query ?? "")))
                .ToListAsync();
        }


        public async Task<List<Document>> GetAllDocumentsAsync(string securityLevel = "", string documentType = "")
        {
            var queryable = _context.Documents
                .Include(d => d.Case)
                    .ThenInclude(c => c.Defendant)
                        .ThenInclude(d => d.Organization)
                .Include(d => d.Case)
                    .ThenInclude(c => c.Employee)
                        .ThenInclude(e => e.InvestigationDepartment)
                .Include(d => d.Series)
                .AsQueryable();

            if (!string.IsNullOrEmpty(securityLevel))
            {
                queryable = queryable.Where(d => d.SecurityLevel == securityLevel);
            }

            if (!string.IsNullOrEmpty(documentType))
            {
                queryable = queryable.Where(d => d.DocumentType == documentType);
            }

            return await queryable.ToListAsync();
        }

        public async Task<List<Case>> GetAllCasesAsync(string status = "")
        {
            var queryable = _context.Cases
                .Include(c => c.Defendant)
                    .ThenInclude(d => d.Organization)
                .Include(c => c.Employee)
                    .ThenInclude(e => e.InvestigationDepartment)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                queryable = queryable.Where(c => c.Status == status);
            }

            return await queryable.ToListAsync();
        }

        public async Task<List<Defendant>> GetAllDefendantsAsync(string status = "")
        {
            var queryable = _context.Defendants
                .Include(d => d.Organization)
                .Include(d => d.Cases)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                queryable = queryable.Where(d => d.Status == status);
            }

            return await queryable.ToListAsync();
        }

        public async Task<List<Employee>> GetAllEmployeesAsync(string post = "")
        {
            var queryable = _context.Employees
                .Include(e => e.InvestigationDepartment)
                .Include(e => e.Cases)
                .AsQueryable();

            if (!string.IsNullOrEmpty(post))
            {
                queryable = queryable.Where(e => e.Post == post);
            }

            return await queryable.ToListAsync();
        }

        public async Task<List<Series>> GetAllSeriesAsync()
        {
            return await _context.Series
                .Include(s => s.Documents)
                .ToListAsync();
        }


        public async Task<List<Case>> SearchCasesWithFiltersAsync(string query, string status)
        {
            var queryable = _context.Cases
                .Include(c => c.Defendant)
                    .ThenInclude(d => d.Organization)
                .Include(c => c.Employee)
                    .ThenInclude(e => e.InvestigationDepartment)
                .Where(c => (c.Code != null && c.Code.Contains(query ?? "")) ||
                           (c.Name != null && c.Name.Contains(query ?? "")));

            if (!string.IsNullOrEmpty(status))
            {
                queryable = queryable.Where(c => c.Status == status);
            }

            return await queryable.ToListAsync();
        }

        public async Task<List<Document>> SearchDocumentsWithFiltersAsync(string query, string securityLevel, string documentType)
        {
            var queryable = _context.Documents
                .Include(d => d.Case)
                    .ThenInclude(c => c.Defendant)
                        .ThenInclude(d => d.Organization)
                .Include(d => d.Case)
                    .ThenInclude(c => c.Employee)
                        .ThenInclude(e => e.InvestigationDepartment)
                .Include(d => d.Series)
                .Where(d => d.Name != null && d.Name.Contains(query ?? ""));

            if (!string.IsNullOrEmpty(securityLevel))
            {
                queryable = queryable.Where(d => d.SecurityLevel == securityLevel);
            }

            if (!string.IsNullOrEmpty(documentType))
            {
                queryable = queryable.Where(d => d.DocumentType == documentType);
            }

            return await queryable.ToListAsync();
        }

        public async Task<List<Defendant>> SearchDefendantsWithFiltersAsync(string query, string status)
        {
            var queryable = _context.Defendants
                .Include(d => d.Organization)
                .Include(d => d.Cases)
                .Where(d => (d.Name != null && d.Name.Contains(query ?? "")) ||
                           (d.Surname != null && d.Surname.Contains(query ?? "")) ||
                           (d.Alias != null && d.Alias.Contains(query ?? "")));

            if (!string.IsNullOrEmpty(status))
            {
                queryable = queryable.Where(d => d.Status == status);
            }

            return await queryable.ToListAsync();
        }

        public async Task<List<Employee>> SearchEmployeesWithFiltersAsync(string query, string post)
        {
            var queryable = _context.Employees
                .Include(e => e.InvestigationDepartment)
                .Include(e => e.Cases)
                .Where(e => (e.Name != null && e.Name.Contains(query ?? "")) ||
                           (e.Surname != null && e.Surname.Contains(query ?? "")) ||
                           (e.Badge != null && e.Badge.Contains(query ?? "")) ||
                           (e.Post != null && e.Post.Contains(query ?? "")));

            if (!string.IsNullOrEmpty(post))
            {
                queryable = queryable.Where(e => e.Post == post);
            }

            return await queryable.ToListAsync();
        }


        public async Task<Document?> GetDocumentByIdAsync(int id)
        {
            return await _context.Documents
                .Include(d => d.Case)
                    .ThenInclude(c => c.Defendant)
                        .ThenInclude(d => d.Organization)
                .Include(d => d.Case)
                    .ThenInclude(c => c.Employee)
                        .ThenInclude(e => e.InvestigationDepartment)
                .Include(d => d.Series)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Case?> GetCaseByIdAsync(int id)
        {
            return await _context.Cases
                .Include(c => c.Defendant)
                    .ThenInclude(d => d.Organization)
                .Include(c => c.Employee)
                    .ThenInclude(e => e.InvestigationDepartment)
                .Include(c => c.Documents)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Series?> GetSeriesByIdAsync(int id)
        {
            return await _context.Series
                .Include(s => s.Documents)
                    .ThenInclude(d => d.Case)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Defendant?> GetDefendantByIdAsync(int id)
        {
            return await _context.Defendants
                .Include(d => d.Organization)
                .Include(d => d.Cases)
                    .ThenInclude(c => c.Documents)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int id)
        {
            return await _context.Employees
                .Include(e => e.InvestigationDepartment)
                .Include(e => e.Cases)
                    .ThenInclude(c => c.Documents)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Organization?> GetOrganizationByIdAsync(int id)
        {
            return await _context.Organizations
                .Include(o => o.Defendants)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<InvestigationDepartment?> GetInvestigationDepartmentByIdAsync(int id)
        {
            return await _context.InvestigationDepartments
                .Include(d => d.Employees)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Organization?> GetOrganizationByDefendantIdAsync(int defendantId)
        {
            return await _context.Defendants
                .Where(d => d.Id == defendantId)
                .Select(d => d.Organization)
                .FirstOrDefaultAsync();
        }

        public async Task<InvestigationDepartment?> GetDepartmentByEmployeeIdAsync(int employeeId)
        {
            return await _context.Employees
                .Where(e => e.Id == employeeId)
                .Select(e => e.InvestigationDepartment)
                .FirstOrDefaultAsync();
        }
    }
}