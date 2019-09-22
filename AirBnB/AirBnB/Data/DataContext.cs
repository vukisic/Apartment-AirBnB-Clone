using AirBnB.Models;
using Microsoft.EntityFrameworkCore;

namespace AirBnB.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Host> Hosts { get; set; }
        public DbSet<Guest> Guests { get; set; }
        public DbSet<Apartment> Apartments { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Amenitie> Amenities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            
        }
    }
}
