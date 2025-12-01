using isteodev.DTOs;
using isteodev.Services;
using Microsoft.AspNetCore.Mvc;

namespace isteodev.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly InMemoryUserService _userService;

        
        public AuthController(InMemoryUserService userService, JwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto dto)
        {
            try
            {
                var user = _userService.Register(dto.Name, dto.Email, dto.Password);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var user = _userService.Login(dto.Email, dto.Password);

            if (user == null)
                return Unauthorized("Email veya şifre hatalı.");

            var token = _jwtService.GenerateToken(user.Id, user.Email);

            return Ok(new
            {
                token = token,
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email
                }
            });
        }
    }
}
