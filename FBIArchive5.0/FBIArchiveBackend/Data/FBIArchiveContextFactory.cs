using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FBIArchive.Data
{
    public class FBIArchiveContextFactory
        : IDesignTimeDbContextFactory<FBIArchiveContext>
    {
        public FBIArchiveContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<FBIArchiveContext>();

            optionsBuilder.UseSqlServer(
                "Server=(localdb)\\mssqllocaldb;Database=FBIArchive;Trusted_Connection=true;TrustServerCertificate=true;"
            );

            return new FBIArchiveContext(optionsBuilder.Options);
        }
    }
}
