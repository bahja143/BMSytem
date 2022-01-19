using System;

namespace BuildingSystem.Modal
{
    public class Message
    {
        public int Id { get; set; }

        public Customer Customer { get; set; }

        public int CustomerId { get; set; }

        public string Body { get; set; }

        public DateTime Date { get; set; }
    }
}
