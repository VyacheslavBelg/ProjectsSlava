using HealthyAgine.Models;
using HealthyAgine.Services;

namespace HealthyAgine.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("calculate")]
        public async Task<UserOutputDto> Calculate([FromBody] UserInputDto input)
        {
            return await _userService.Calculate(input);
        }

    }
}