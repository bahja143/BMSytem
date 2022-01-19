using System;
using System.Collections.Generic;
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
    [Route("/api/invoices")]
    public class InvoicesController : Controller
    {
        private BMSDbContext _context { get; set; }

        public InvoicesController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult getAll()
        {
            var invoices =
                _context
                    .Invoices
                    .Include(i => i.Rental)
                    .ToList()
                    .GroupBy(i => i.RentalId)
                    .Select(g => g.ToList())
                    .ToList();

            var NewList = new List<Invoice>();

            foreach (var inv in invoices)
            {
                var rentalId = inv.Last().RentalId;
                var totalInvoices = inv.Sum(i => i.Amount);
                var totalReceipts =
                    _context
                        .Receipts
                        .Where(r => r.RentalId == rentalId)
                        .Sum(r => r.Amount);
                var rest = totalInvoices - totalReceipts;

                if (rest == 0)
                {
                    foreach (var invoice in inv)
                    {
                        NewList
                            .Add(new Invoice {
                                Id = invoice.Id,
                                RentalId = rentalId,
                                Rental =
                                    _context
                                        .Rentals
                                        .SingleOrDefault(r =>
                                            r.Id == invoice.RentalId),
                                Amount = 0,
                                Description = invoice.Description,
                                Date = invoice.Date
                            });
                    }
                }
                else
                {
                    foreach (var invoice in inv)
                    {
                        NewList
                            .Add(new Invoice {
                                Id = invoice.Id,
                                RentalId = rentalId,
                                Rental =
                                    _context
                                        .Rentals
                                        .SingleOrDefault(r =>
                                            r.Id == invoice.RentalId),
                                Amount =
                                    totalReceipts - invoice.Amount >= 0
                                        ? 0
                                        : Math
                                            .Abs(totalReceipts -
                                            invoice.Amount),
                                Description = invoice.Description,
                                Date = invoice.Date
                            });

                        totalReceipts =
                            totalReceipts - invoice.Amount < 0
                                ? 0
                                : totalReceipts - invoice.Amount;
                    }
                }
            }

            return Ok(NewList
                .Where(i => i.Amount != 0)
                .Select(i =>
                    new {
                        i.Id,
                        i.RentalId,
                        i.Rental,
                        i.Amount,
                        i.Date,
                        i.Description,
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
                                .RoomNumber
                    }));
        }

        [HttpGet("/api/allInvoices")]
        public ActionResult getAllInvoices()
        {
            var invoices =
                _context
                    .Invoices
                    .Include(i => i.Rental)
                    .ToList()
                    .GroupBy(i => i.RentalId)
                    .Select(g => g.ToList())
                    .ToList();

            var NewList = new List<Invoice>();

            foreach (var inv in invoices)
            {
                var rentalId = inv.Last().RentalId;
                var totalInvoices = inv.Sum(i => i.Amount);
                var totalReceipts =
                    _context
                        .Receipts
                        .Where(r => r.RentalId == rentalId)
                        .Sum(r => r.Amount);
                var rest = totalInvoices - totalReceipts;

                if (rest == 0)
                {
                    foreach (var invoice in inv)
                    {
                        NewList
                            .Add(new Invoice {
                                Id = invoice.Id,
                                RentalId = rentalId,
                                Rental =
                                    _context
                                        .Rentals
                                        .SingleOrDefault(r =>
                                            r.Id == invoice.RentalId),
                                Amount = 0,
                                Description = invoice.Description,
                                Date = invoice.Date
                            });
                    }
                }
                else
                {
                    foreach (var invoice in inv)
                    {
                        NewList
                            .Add(new Invoice {
                                Id = invoice.Id,
                                RentalId = rentalId,
                                Rental =
                                    _context
                                        .Rentals
                                        .SingleOrDefault(r =>
                                            r.Id == invoice.RentalId),
                                Amount =
                                    totalReceipts - invoice.Amount >= 0
                                        ? 0
                                        : Math
                                            .Abs(totalReceipts -
                                            invoice.Amount),
                                Description = invoice.Description,
                                Date = invoice.Date
                            });

                        totalReceipts =
                            totalReceipts - invoice.Amount < 0
                                ? 0
                                : totalReceipts - invoice.Amount;
                    }
                }
            }

            return Ok(NewList
                .Select(i =>
                    new {
                        i.Id,
                        i.RentalId,
                        i.Rental,
                        i.Amount,
                        i.Date,
                        i.Description,
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
                                .RoomNumber
                    }));
        }

        [Authorize]
        [HttpGet("/api/allInvoices/{id}")]
        public ActionResult getByIdInvoice(int Id)
        {
            var invoices =
                _context
                    .Invoices
                    .Include(i => i.Rental)
                    .ToList()
                    .GroupBy(i => i.RentalId)
                    .Select(g => g.ToList())
                    .ToList();

            var NewList = new List<Invoice>();

            foreach (var inv in invoices)
            {
                var rentalId = inv.Last().RentalId;
                var totalInvoices = inv.Sum(i => i.Amount);
                var totalReceipts =
                    _context
                        .Receipts
                        .Where(r => r.RentalId == rentalId)
                        .Sum(r => r.Amount);
                var rest = totalInvoices - totalReceipts;

                if (rest == 0)
                {
                    foreach (var invoice in inv)
                    {
                        NewList
                            .Add(new Invoice {
                                Id = invoice.Id,
                                RentalId = rentalId,
                                Rental =
                                    _context
                                        .Rentals
                                        .SingleOrDefault(r =>
                                            r.Id == invoice.RentalId),
                                Amount = 0,
                                Description = invoice.Description,
                                Date = invoice.Date
                            });
                    }
                }
                else
                {
                    foreach (var invoice in inv)
                    {
                        NewList
                            .Add(new Invoice {
                                Id = invoice.Id,
                                RentalId = rentalId,
                                Rental =
                                    _context
                                        .Rentals
                                        .SingleOrDefault(r =>
                                            r.Id == invoice.RentalId),
                                Amount =
                                    totalReceipts - invoice.Amount >= 0
                                        ? 0
                                        : Math
                                            .Abs(totalReceipts -
                                            invoice.Amount),
                                Description = invoice.Description,
                                Date = invoice.Date
                            });

                        totalReceipts =
                            totalReceipts - invoice.Amount < 0
                                ? 0
                                : totalReceipts - invoice.Amount;
                    }
                }
            }

            return Ok(NewList
                .Select(i =>
                    new {
                        i.Id,
                        i.RentalId,
                        i.Rental,
                        i.Amount,
                        i.Date,
                        i.Description,
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
                                .RoomNumber
                    })
                .SingleOrDefault(i => i.Id == Id));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context
                .Invoices
                .SingleOrDefaultAsync(i => i.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Invoice invoice)
        {
            await _context.Invoices.AddAsync(invoice);
            await _context.SaveChangesAsync();

            return Ok(invoice);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> put(int Id, [FromBody] Invoice invoice)
        {
            var invoiceDb =
                await _context.Invoices.SingleOrDefaultAsync(i => i.Id == Id);

            if (invoiceDb == null) return NotFound("Not Found");

            invoiceDb.RentalId = invoice.RentalId;
            invoiceDb.Amount = invoice.Amount;
            invoiceDb.Description = invoice.Description;
            invoiceDb.Date = invoice.Date;

            await _context.SaveChangesAsync();

            return Ok(invoice);
        }

        [HttpGet("/api/generateinvoices")]
        public async Task<ActionResult> generateInvoices()
        {
            var thisMonthInvoices =
                _context
                    .Invoices
                    .Where(i =>
                        i.Date.Month == DateTime.Now.Month &&
                        i.Description == "Rent")
                    .Select(r => r.RentalId);

            var rentals =
                await _context
                    .Rentals
                    .Where(r =>
                        r.isCurrent == true &&
                        !thisMonthInvoices.Contains(r.Id))
                    .ToListAsync();

            foreach (var rent in rentals)
            {
                var invoice =
                    new Invoice {
                        Id = 0,
                        RentalId = rent.Id,
                        Amount = rent.Amount,
                        Date = DateTime.Now,
                        Description = "Rent"
                    };
                await _context.Invoices.AddAsync(invoice);
            }

            await _context.SaveChangesAsync();

            return Ok(getAll());
        }
    }
}
