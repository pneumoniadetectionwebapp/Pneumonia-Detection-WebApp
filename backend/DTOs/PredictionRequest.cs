using Microsoft.AspNetCore.Http;

namespace isteodev.DTOs;

public class PredictionRequest
{
    public IFormFile File { get; set; } = default!;
}