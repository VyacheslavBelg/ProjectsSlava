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
    }
}


