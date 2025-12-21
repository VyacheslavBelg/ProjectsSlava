using FBIArchive.Models;
using FBIArchive.Services;
using Microsoft.AspNetCore.Mvc;

namespace FBIArchive.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;

		public AuthController(IAuthService authService)
		{
			_authService = authService;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] UserRegistrationDto dto)
		{
			var result = await _authService.RegisterUserAsync(dto);

			if (!result.IsSuccess)
			{

				return BadRequest(result.ErrorMessage);
			}


			return Ok(new
			{
				message = "Регистрация успешна",
				userId = result.User!.Id,
				email = result.User.Email,
				role = result.User.Role
			});
		}

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);

            if (result.StartsWith("Error"))
            {
                return BadRequest(result);
            }

            return Ok(new { token = result });
        }

		

    }
}