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
    [Route("/api/services")]
    public class ServicesController : Controller
    {
        private BMSDbContext _context { get; set; }

        public ServicesController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context
                .Services
                .Include(s => s.Category)
                .Include(s => s.Items)
                .ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getAll(int Id)
        {
            return Ok(await _context
                .Services
                .Include(s => s.Category)
                .Include(s => s.Items)
                .SingleOrDefaultAsync(s => s.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Service service)
        {
            await _context.AddAsync(service);
            await _context.SaveChangesAsync();

            return Ok(service);
        }
    }
}
