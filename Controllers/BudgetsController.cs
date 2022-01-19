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
    [Route("/api/budgets")]
    public class BudgetsController : Controller
    {
        private BMSDbContext _context { get; set; }

        public BudgetsController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.Budgeties.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context
                .Budgeties
                .SingleOrDefaultAsync(c => c.Id == Id));
        }

        [HttpGet("/api/budget/balance")]
        public async Task<ActionResult> budgetBalance()
        {
            var totalBudget = await _context.Budgeties.ToListAsync();
            var totalExpenses = await _context.ServiceItems.ToListAsync();
            var balance =
                totalBudget.Sum(b => b.Amount) -
                totalExpenses.Sum(e => e.Amount);

            return Ok(balance);
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Budget budget)
        {
            await _context.Budgeties.AddAsync(budget);
            await _context.SaveChangesAsync();

            return Ok(budget);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> put(int Id, [FromBody] Budget budget)
        {
            var budgetDb =
                await _context.Budgeties.SingleOrDefaultAsync(c => c.Id == Id);

            if (budgetDb == null) return NotFound();

            budgetDb.Amount = budget.Amount;
            budgetDb.Date = budget.Date;
            budgetDb.Description = budget.Description;

            await _context.SaveChangesAsync();

            return Ok(budgetDb);
        }
    }
}
