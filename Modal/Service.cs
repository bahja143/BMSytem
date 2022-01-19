using System;
using System.Collections.Generic;

namespace BuildingSystem.Modal
{
    public class Service
    {
        public int Id { get; set; }

        public ServiceCategory Category { get; set; }

        public int CategoryId { get; set; }

        public DateTime Date { get; set; }

        public List<ServiceItem> Items { get; set; }
    }
}
