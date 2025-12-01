using isteodev.DTOs;
using isteodev.Models;
using isteodev.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace isteodev.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PredictionController : ControllerBase
    {
        private readonly IPredictionHistoryService _historyService;

        
        public PredictionController(IPredictionHistoryService historyService)
        {
            _historyService = historyService;
        }

        [Authorize]
        [HttpPost]
        public IActionResult Predict(PredictionRequestDto dto)
        {
            if (string.IsNullOrEmpty(dto.ImageUrl))
                return BadRequest("ImageUrl boş olamaz.");

            var result = new PredictionHistory
            {
                ImageUrl = dto.ImageUrl,
                Label = "Pneumonia",
                Confidence = 0.87
            };

            _historyService.Add(result);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("history")]
        public IActionResult GetHistory()
        {
            return Ok(_historyService.GetAll());
        }
    }
}
