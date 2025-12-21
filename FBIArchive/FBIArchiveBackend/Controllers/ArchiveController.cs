using FBIArchive.Services;
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;

namespace FBIArchive.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class ArchiveController : ControllerBase
    {
        private readonly IArchiveService _service;

        public ArchiveController(IArchiveService service)
        {
            _service = service;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            var results = await _service.SearchGlobalAsync(query);
            return Ok(results);
        }
    }
}