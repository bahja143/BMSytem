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
    [Route("/api/receipts")]
    public class ReceiptsController : Controller
    {
        private BMSDbContext _context { get; set; }

        public ReceiptsController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context
                .Receipts
                .Include(i => i.Rental)
                .Select(i =>
                    new {
                        i.Id,
                        Name =
                            _context
                                .Customers
                                .SingleOrDefault(c =>
                                    c.Id == i.Rental.CustomerId)
                                .Name,
                        Tellphone =
                            _context
                                .Customers
                                .SingleOrDefault(c =>
                                    c.Id == i.Rental.CustomerId)
                                .Tellphone,
                        RoomNumber =
                            _context
                                .Rooms
                                .SingleOrDefault(r => r.Id == i.Rental.RoomId)
                                .RoomNumber,
                        i.Amount,
                        i.Type,
                        i.Date,
                        i.Description
                    })
                .ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context
                .Receipts
                .Include(i => i.Rental)
                .Select(i =>
                    new {
                        i.Id,
                        Name =
                            _context
                                .Customers
                                .SingleOrDefault(c =>
                                    c.Id == i.Rental.CustomerId)
                                .Name,
                        Tellphone =
                            _context
                                .Customers
                                .SingleOrDefault(c =>
                                    c.Id == i.Rental.CustomerId)
                                .Tellphone,
                        RoomNumber =
                            _context.Rooms.SingleOrDefault().RoomNumber,
                        i.Amount,
                        i.Type,
                        i.Date,
                        i.Description
                    })
                .SingleOrDefaultAsync(i => i.Id == Id));
        }

        [HttpGet("/api/balance/{RentalId}")]
        public ActionResult balance(int RentalId)
        {
            var totalInvoices =
                _context
                    .Invoices
                    .Where(i => i.RentalId == RentalId)
                    .Sum(i => i.Amount);
            var totalReceipts =
                _context
                    .Receipts
                    .Where(r => r.RentalId == RentalId)
                    .Sum(r => r.Amount);

            return Ok(totalInvoices - totalReceipts);
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Receipt receipt)
        {
            await _context.Receipts.AddAsync(receipt);
            await _context.SaveChangesAsync();

            return Ok(receipt);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> put(int Id, [FromBody] Receipt receipt)
        {
            var receiptDb =
                await _context.Receipts.SingleOrDefaultAsync(r => r.Id == Id);

            if (receiptDb == null) return NotFound("Not found");

            receiptDb.RentalId = receipt.RentalId;
            receiptDb.Amount = receipt.Amount;
            receiptDb.Date = receipt.Date;
            receiptDb.Description = receipt.Description;
            receiptDb.Type = receipt.Type;

            await _context.SaveChangesAsync();

            return Ok(receiptDb);
        }
    }
}
