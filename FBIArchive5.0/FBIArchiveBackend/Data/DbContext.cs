using Microsoft.EntityFrameworkCore;
using FBIArchive.Models;


namespace FBIArchive.Data
{
    public class FBIArchiveContext : DbContext
    {
        public FBIArchiveContext(DbContextOptions<FBIArchiveContext> options)
                : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<Series> Series { get; set; }
        public DbSet<Defendant> Defendants { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<InvestigationDepartment> InvestigationDepartments { get; set; }
    }
}

