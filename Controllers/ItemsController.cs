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
    [Route("/api/items")]
    public class ItemsController : Controller
    {
        private BMSDbContext _context { get; set; }

        public ItemsController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context
                .Items
                .Include(i => i.Category)
                .ToListAsync());
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context
                .Items
                .Include(i => i.Category)
                .SingleOrDefaultAsync(i => i.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Item item)
        {
            var itemDb =
                await _context
                    .Items
                    .SingleOrDefaultAsync(i => i.Name == item.Name);

            if (itemDb != null) return BadRequest("This item is already exist");

            await _context.Items.AddAsync(item);
            await _context.SaveChangesAsync();

            return Ok(item);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> put(int Id, [FromBody] Item item)
        {
            var itemDb =
                await _context
                    .Items
                    .SingleOrDefaultAsync(i => i.Name == item.Name);

            if (itemDb == null) return NotFound("Not found");

            itemDb.Name = item.Name;
            itemDb.CategoryId = item.CategoryId;
            itemDb.Description = item.Description;

            await _context.SaveChangesAsync();

            return Ok(await _context
                .Items
                .Include(i => i.Category)
                .SingleOrDefaultAsync(i => i.Id == Id));
        }
    }
}
