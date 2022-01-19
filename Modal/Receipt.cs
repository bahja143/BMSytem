using System;

namespace BuildingSystem.Modal
{
    public class Receipt
    {
        public int Id { get; set; }

        public Rental Rental { get; set; }

        public int RentalId { get; set; }

        public int Amount { get; set; }

        public string Type { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }
    }
}
