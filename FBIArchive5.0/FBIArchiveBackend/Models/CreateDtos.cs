
namespace FBIArchive.Models
{
    public class CreateDocumentDto
    {
        public string Name { get; set; } = "";
        public string SecurityLevel { get; set; } = "";
        public string DocumentType { get; set; } = "";
        public DateTime CreateDate { get; set; }
        public int SeriesId { get; set; }
        public int CaseId { get; set; }
    }

    public class CreateCaseDto
    {
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public DateTime OpenDate { get; set; }
        public DateTime? CloseDate { get; set; }
        public string Description { get; set; } = "";
        public string Status { get; set; } = "";
        public int? DefendantId { get; set; }
        public int? EmployeeId { get; set; }
    }

    public class CreateDefendantDto
    {
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public string Alias { get; set; } = "";
        public DateTime BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public string Status { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public int OrganizationId { get; set; }
    }

    public class CreateEmployeeDto
    {
        public string Badge { get; set; } = "";
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public DateTime BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public string Post { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public int InvestigationDepartmentId { get; set; }
    }

    public class CreateSeriesDto
    {
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string YearPeriod { get; set; } = "";
    }

    public class CreateOrganizationDto
    {
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string OrganizationType { get; set; } = "";
        public DateTime? EstablishedDate { get; set; }
        public DateTime? DisbandedDate { get; set; }
        public string Status { get; set; } = "";
    }

    public class CreateDepartmentDto
    {
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public string Description { get; set; } = "";
        public string DepartmentType { get; set; } = "";
        public DateTime EstablishedDate { get; set; }
        public string Status { get; set; } = "";
    }
}
