using System.Threading.Tasks;
using BuildingSystem.Modal;
using BuildingSystem.Persistance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildingSystem.Controllers
{
    [Authorize]
    [Route("/api/rooms")]
    public class RoomsController : Controller
    {
        private BMSDbContext _context { get; set; }

        public RoomsController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.Rooms.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context
                .Rooms
                .SingleOrDefaultAsync(c => c.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Room room)
        {
            await _context.Rooms.AddAsync(room);
            await _context.SaveChangesAsync();

            return Ok(room);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> put(int Id, [FromBody] Room room)
        {
            var roomDb =
                await _context.Rooms.SingleOrDefaultAsync(c => c.Id == Id);

            if (roomDb == null) return NotFound();

            roomDb.RoomNumber = room.RoomNumber;
            roomDb.Description = room.Description;

            await _context.SaveChangesAsync();

            return Ok(roomDb);
        }
    }
}
