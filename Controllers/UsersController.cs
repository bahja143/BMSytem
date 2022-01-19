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
    [Route("/api/users")]
    public class UsersController : Controller
    {
        public BMSDbContext _context { get; set; }

        public UsersController(BMSDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.Users.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context
                .Users
                .SingleOrDefaultAsync(u => u.Id == Id));
        }

        [HttpGet("/api/users/changePassword/{id}/{newPassword}")]
        public async Task<ActionResult>
        changePassword(int Id, string newPassword)
        {
            var userDb =
                await _context.Users.SingleOrDefaultAsync(u => u.Id == Id);

            if (userDb != null)
            {
                userDb.Password = newPassword;

                await _context.SaveChangesAsync();
            }

            return Ok(userDb);
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] User user)
        {
            if (!ModelState.IsValid) return BadRequest();

            var userDb =
                await _context
                    .Users
                    .SingleOrDefaultAsync(u => u.Username == user.Username);

            if (userDb == null)
            {
                user.Status = true;
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                return Ok(user);
            }
            else
            {
                return BadRequest("Username already exist");
            }
        }

        [HttpGet("/api/userStatus/{id}")]
        public async Task<ActionResult> userStatus(int Id)
        {
            var userDb = _context.Users.ToList().Find(u => u.Id == Id);

            if (userDb.Status)
            {
                userDb.Status = false;
            }
            else
            {
                userDb.Status = true;
            }

            await _context.SaveChangesAsync();
            return Ok(userDb);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> put(int Id, [FromBody] User user)
        {
            if (!ModelState.IsValid) return BadRequest();

            var userDb =
                await _context.Users.SingleOrDefaultAsync(u => u.Id == Id);

            if (userDb != null)
            {
                userDb.Name = user.Name;
                userDb.Username = user.Username;
                userDb.Password = user.Password;
                userDb.Role = user.Role;
                await _context.SaveChangesAsync();
            }

            return Ok(userDb);
        }
    }
}
