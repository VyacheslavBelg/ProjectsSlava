using HealthyAgine.Models;
using HealthyAgine.Services;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost("calculate_with_fat")]
        public async Task<UserOutputDto> CalculateWithFat([FromBody] UserWithFatInputDto input)
        {
            return await _userService.CalculateWithFat(input.User, input.Parametrs);
        }

    }
}