using System.Threading.Tasks;
using BuildingSystem.Modal;
using BuildingSystem.Persistance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildingSystem.Controllers
{
    [Authorize]
    [Route("/api/customers")]
    public class CustomersController : Controller
    {
        private BMSDbContext _context { get; set; }

        public CustomersController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.Customers.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context
                .Customers
                .SingleOrDefaultAsync(c => c.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Customer customer)
        {
            await _context.Customers.AddAsync(customer);
            await _context.SaveChangesAsync();

            return Ok(customer);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult>
        put(int Id, [FromBody] Customer customer)
        {
            var customerDb =
                await _context.Customers.SingleOrDefaultAsync(c => c.Id == Id);

            if (customerDb == null) return NotFound();

            customerDb.Name = customer.Name;
            customerDb.Tellphone = customer.Tellphone;
            customerDb.Address = customer.Address;

            await _context.SaveChangesAsync();

            return Ok(customerDb);
        }
    }
}
