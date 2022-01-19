using BuildingSystem.Modal;
using Microsoft.EntityFrameworkCore;

namespace BuildingSystem.Persistance
{
    public class BMSDbContext : DbContext
    {
        public DbSet<Message> Messages { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<ServiceItem> ServiceItems { get; set; }

        public DbSet<Service> Services { get; set; }

        public DbSet<Item> Items { get; set; }

        public DbSet<Budget> Budgeties { get; set; }

        public DbSet<ServiceCategory> ServiceCategories { get; set; }

        public DbSet<ItemCategory> ItemCategories { get; set; }

        public DbSet<Receipt> Receipts { get; set; }

        public DbSet<Invoice> Invoices { get; set; }

        public DbSet<Rental> Rentals { get; set; }

        public DbSet<Room> Rooms { get; set; }

        public DbSet<Customer> Customers { get; set; }

        public BMSDbContext(DbContextOptions<BMSDbContext> options) :
            base(options)
        {
        }
    }
}
