namespace BuildingSystem.Modal
{
    public class Item
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public ItemCategory Category { get; set; }

        public int CategoryId { get; set; }

        public string Description { get; set; }
    }
}
