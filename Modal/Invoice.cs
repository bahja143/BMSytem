using System;
using BuildingSystem.Modal;

namespace BuildingSystem.Modal
{
    public class Invoice
    {
        public int Id { get; set; }

        public Rental Rental { get; set; }

        public int RentalId { get; set; }

        public int Amount { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }
    }
}
