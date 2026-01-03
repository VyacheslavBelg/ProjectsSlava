using FBIArchive.Models;

namespace FBIArchive.Repositories
{
    public interface IArchiveRepository
    {

        Task<List<Case>> SearchCasesAsync(string query);
        Task<List<Document>> SearchDocumentsAsync(string query);
        Task<List<Series>> SearchSeriesAsync(string query);
        Task<List<Defendant>> SearchDefendantsAsync(string query);
        Task<List<Employee>> SearchEmployeesAsync(string query);


        Task<List<Document>> GetAllDocumentsAsync(string securityLevel = "", string documentType = "");
        Task<List<Case>> GetAllCasesAsync(string status = "");
        Task<List<Defendant>> GetAllDefendantsAsync(string status = "");
        Task<List<Employee>> GetAllEmployeesAsync(string post = "");
        Task<List<Series>> GetAllSeriesAsync();


        Task<List<Case>> SearchCasesWithFiltersAsync(string query, string status);
        Task<List<Document>> SearchDocumentsWithFiltersAsync(string query, string securityLevel, string documentType);
        Task<List<Defendant>> SearchDefendantsWithFiltersAsync(string query, string status);
        Task<List<Employee>> SearchEmployeesWithFiltersAsync(string query, string post);


        Task<Document?> GetDocumentByIdAsync(int id);
        Task<Case?> GetCaseByIdAsync(int id);
        Task<Series?> GetSeriesByIdAsync(int id);
        Task<Defendant?> GetDefendantByIdAsync(int id);
        Task<Employee?> GetEmployeeByIdAsync(int id);
        Task<Organization?> GetOrganizationByIdAsync(int id);
        Task<InvestigationDepartment?> GetInvestigationDepartmentByIdAsync(int id);
        Task<Organization?> GetOrganizationByDefendantIdAsync(int defendantId);
        Task<InvestigationDepartment?> GetDepartmentByEmployeeIdAsync(int employeeId);
    }
}