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
    [Route("/api/serviceCategories")]
    public class ServiceCategoriesController : Controller
    {
        private BMSDbContext _context { get; set; }

        public ServiceCategoriesController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.ServiceCategories.ToListAsync());
        }

        [HttpGet("{id}")]
        public ActionResult getById(int Id)
        {
            return Ok(_context
                .ServiceCategories
                .SingleOrDefault(r => r.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult>
        post([FromBody] ServiceCategory serviceCategory)
        {
            var serviceCategoryDb =
                await _context
                    .ServiceCategories
                    .SingleOrDefaultAsync(r => r.Name == serviceCategory.Name);

            if (serviceCategoryDb != null)
                return BadRequest("This category is already registered!");

            await _context.ServiceCategories.AddAsync(serviceCategory);
            await _context.SaveChangesAsync();

            return Ok(serviceCategory);
        }

        [HttpPut("{Id}")]
        public ActionResult
        put(int Id, [FromBody] ServiceCategory serviceCategory)
        {
            var serviceCategoryDb =
                _context.ServiceCategories.SingleOrDefault(r => r.Id == Id);

            if (serviceCategoryDb == null) return NotFound("Not found");

            serviceCategoryDb.Name = serviceCategory.Name;
            _context.SaveChanges();

            return Ok(serviceCategory);
        }
    }
}
