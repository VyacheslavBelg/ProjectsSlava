using Microsoft.EntityFrameworkCore;
using HealthyAgine.Models;

namespace HealthyAgine.Data
{
    public class HealthyAgineContext : DbContext
    {
        public HealthyAgineContext(DbContextOptions<HealthyAgineContext> options) 
            : base(options)
        {
        }
        public DbSet<UserDBSave> Users { get; set; }
    }
}