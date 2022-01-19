using System;
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
    [Route("/api/rentals")]
    public class RentalsController : Controller
    {
        private BMSDbContext _context { get; set; }

        public RentalsController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult getAll()
        {
            return Ok(_context
                .Rentals
                .Include(r => r.Customer)
                .Include(r => r.Room)
                .ToList());
        }

        [HttpGet("{id}")]
        public ActionResult getById(int Id)
        {
            return Ok(_context.Rentals.SingleOrDefault(r => r.Id == Id));
        }

        [HttpGet("/api/rental/out/{id}")]
        public async Task<ActionResult> getOut(int Id)
        {
            var rentalDb =
                await _context
                    .Rentals
                    .SingleOrDefaultAsync(r => r.Id == Id && r.isCurrent);

            rentalDb.isCurrent = false;
            rentalDb.endDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(rentalDb);
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Rental rental)
        {
            var rentalDb =
                await _context
                    .Rentals
                    .SingleOrDefaultAsync(r =>
                        r.RoomId == rental.RoomId && r.isCurrent);

            if (rentalDb != null)
                return BadRequest("This room is already rented!");

            rental.isCurrent = true;

            await _context.Rentals.AddAsync(rental);
            await _context.SaveChangesAsync();

            return Ok(rental);
        }

        [HttpPut("{Id}")]
        public ActionResult put(int Id, [FromBody] Rental rental)
        {
            var rentalDb = _context.Rentals.SingleOrDefault(r => r.Id == Id);

            if (rentalDb == null) return NotFound("Not found");

            rentalDb.CustomerId = rental.CustomerId;
            rentalDb.RoomId = rental.RoomId;
            rentalDb.Amount = rental.Amount;
            rentalDb.startDate = rental.startDate;
            rentalDb.Document = rental.Document;

            _context.SaveChanges();

            return Ok(rental);
        }
    }
}
