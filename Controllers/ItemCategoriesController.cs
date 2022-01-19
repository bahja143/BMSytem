using System.Linq;
using System.Threading.Tasks;
using BuildingSystem.Modal;
using BuildingSystem.Persistance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildingSystem.Controllers
{
    [Authorize]
    [Route("/api/itemCategories")]
    public class ItemCategoriesController : Controller
    {
        private BMSDbContext _context { get; set; }

        public ItemCategoriesController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.ItemCategories.ToListAsync());
        }

        [HttpGet("{id}")]
        public ActionResult getById(int Id)
        {
            return Ok(_context.ItemCategories.SingleOrDefault(r => r.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult>
        post([FromBody] ItemCategory itemCategory)
        {
            var itemCategoryDb =
                await _context
                    .ItemCategories
                    .SingleOrDefaultAsync(r => r.Name == itemCategory.Name);

            if (itemCategoryDb != null)
                return BadRequest("This category is already registered!");

            await _context.ItemCategories.AddAsync(itemCategory);
            await _context.SaveChangesAsync();

            return Ok(itemCategory);
        }

        [HttpPut("{Id}")]
        public ActionResult put(int Id, [FromBody] ItemCategory itemCategory)
        {
            var itemCategoryDb =
                _context.ItemCategories.SingleOrDefault(r => r.Id == Id);

            if (itemCategoryDb == null) return NotFound("Not found");

            itemCategoryDb.Name = itemCategory.Name;
            _context.SaveChanges();

            return Ok(itemCategory);
        }
    }
}
