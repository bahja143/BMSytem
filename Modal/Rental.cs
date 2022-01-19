using System;
using BuildingSystem.Modal;

namespace BuildingSystem.Modal
{
    public class Rental
    {
        public int Id { get; set; }

        public Customer Customer { get; set; }

        public int CustomerId { get; set; }

        public Room Room { get; set; }

        public int RoomId { get; set; }

        public int Amount { get; set; }

        public bool isCurrent { get; set; }

        public DateTime startDate { get; set; }

        public DateTime? endDate { get; set; }

        public string Document { get; set; }
    }
}
