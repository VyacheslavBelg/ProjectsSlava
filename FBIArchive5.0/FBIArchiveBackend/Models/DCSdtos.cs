namespace FBIArchive.Models
{
    public class SearchResultDto
    {
        public List<CaseDto> Cases { get; set; } = new();
        public List<DocumentDto> Documents { get; set; } = new();
        public List<SeriesDto> Series { get; set; } = new();
        public List<DefendantDto> Defendants { get; set; } = new();
        public List<EmployeeDto> Employees { get; set; } = new();
    }

    public class CaseDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string Status { get; set; } = "";
        public DateTime OpenDate { get; set; }
        public DateTime? CloseDate { get; set; }
    }

    public class DocumentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string SecurityLevel { get; set; } = "";
        public string Type { get; set; } = "";
        public string CaseName { get; set; } = "";
        public DateTime CreateDate { get; set; }
    }

    public class SeriesDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string YearPeriod { get; set; } = "";
    }

    // Фигурант и сотрудник DTO для поиска
    public class OrganizationDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string OrganizationType { get; set; } = "";
        public DateTime? EstablishedDate { get; set; }
        public DateTime? DisbandedDate { get; set; }
        public string Status { get; set; } = "";
    }

    public class OrganizationDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string OrganizationType { get; set; } = "";
        public DateTime? EstablishedDate { get; set; }
        public DateTime? DisbandedDate { get; set; }
        public string Status { get; set; } = "";
        public List<DefendantDto> Defendants { get; set; } = new();
    }

    // DTO для отделов расследования
    public class InvestigationDepartmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public string Description { get; set; } = "";
        public string DepartmentType { get; set; } = "";
        public DateTime EstablishedDate { get; set; }
        public string Status { get; set; } = "";
    }

    public class InvestigationDepartmentDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public string Description { get; set; } = "";
        public string DepartmentType { get; set; } = "";
        public DateTime EstablishedDate { get; set; }
        public string Status { get; set; } = "";
        public List<EmployeeDto> Employees { get; set; } = new();
    }

    // Обновляем существующие DTO
    public class DefendantDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public string FullName => $"{Name} {Surname}";
        public string Alias { get; set; } = "";
        public DateTime BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public string Status { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public OrganizationDto Organization { get; set; } = null!; // Добавляем организацию
    }

    public class EmployeeDto
    {
        public int Id { get; set; }
        public string Badge { get; set; } = "";
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public string FullName => $"{Name} {Surname}";
        public DateTime BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public string Post { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public InvestigationDepartmentDto InvestigationDepartment { get; set; } = null!; // Добавляем отдел
    }

    // Детальные DTO
    public class DocumentDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime CreateDate { get; set; }
        public string SecurityLevel { get; set; } = "";
        public string DocumentType { get; set; } = "";
        public CaseDto Case { get; set; } = null!;
        public SeriesDto Series { get; set; } = null!;
    }

    public class CaseDetailDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string Status { get; set; } = "";
        public DateTime OpenDate { get; set; }
        public DateTime? CloseDate { get; set; }
        public DefendantDto Defendant { get; set; } = null!;
        public EmployeeDto Employee { get; set; } = null!;
        public List<DocumentDto> Documents { get; set; } = new();
    }

    public class SeriesDetailDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string YearPeriod { get; set; } = "";
        public List<DocumentDto> Documents { get; set; } = new();
    }

    public class DefendantDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public string Alias { get; set; } = "";
        public DateTime BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public string Status { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public OrganizationDto Organization { get; set; } = null!; // Убедитесь что это свойство есть
        public List<CaseDto> Cases { get; set; } = new();
    }

    public class EmployeeDetailDto
    {
        public int Id { get; set; }
        public string Badge { get; set; } = "";
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public DateTime BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public string Post { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public InvestigationDepartmentDto InvestigationDepartment { get; set; } = null!; // Убедитесь что это свойство есть
        public List<CaseDto> Cases { get; set; } = new();
    }
}