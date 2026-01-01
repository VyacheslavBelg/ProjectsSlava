namespace FBIArchive.Models
{
    public class InvestigationDepartment
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public string Description { get; set; } = "";
        public string DepartmentType { get; set; } = "";
        public DateTime EstablishedDate { get; set; }
        public string Status { get; set; } = "";

        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}