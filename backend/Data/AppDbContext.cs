using isteodev.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace isteodev.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
    }
}
