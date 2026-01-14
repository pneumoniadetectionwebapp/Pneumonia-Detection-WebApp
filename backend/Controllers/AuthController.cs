using isteodev.Data;
using isteodev.DTOs;
using isteodev.Models;
using isteodev.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace isteodev.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;

    public AuthController(AppDbContext db, JwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(x => x.Email == dto.Email))
            return BadRequest("Bu email zaten kayıtlı.");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = Hash(dto.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (user == null || user.PasswordHash != Hash(dto.Password))
            return Unauthorized("Email veya şifre hatalı");

        var token = _jwt.GenerateToken(user.Id, user.Email);

        return Ok(new { token });
    }

    private static string Hash(string input)
    {
        using var sha = SHA256.Create();
        return Convert.ToHexString(
            sha.ComputeHash(Encoding.UTF8.GetBytes(input))
        );
    }
}