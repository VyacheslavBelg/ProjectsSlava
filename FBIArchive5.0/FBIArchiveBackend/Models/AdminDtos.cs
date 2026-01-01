
namespace FBIArchive.Models
{
    public class UpdateDocumentDto
    {
        public string? Name { get; set; }
        public string? SecurityLevel { get; set; }
        public string? DocumentType { get; set; }
        public int? CaseId { get; set; }
        public int? SeriesId { get; set; }
        public DateTime? CreateDate { get; set; }
    }


    public class UpdateCaseDto
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public DateTime? OpenDate { get; set; }
        public DateTime? CloseDate { get; set; }
        public int? DefendantId { get; set; }
        public int? EmployeeId { get; set; }
    }

    public class UpdateDefendantDto
    {
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Alias { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public string? Status { get; set; }
        public string? PhotoUrl { get; set; }
        public int? OrganizationId { get; set; }
    }

    public class UpdateEmployeeDto
    {
        public string? Badge { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public string? Post { get; set; }
        public string? PhotoUrl { get; set; }
        public int? InvestigationDepartmentId { get; set; }

    }

    public class UpdateSeriesDto
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? YearPeriod { get; set; }
        public string? Description { get; set; }
    }
}