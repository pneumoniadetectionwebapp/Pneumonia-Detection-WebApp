using isteodev.DTOs;
using isteodev.Models;
using isteodev.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace isteodev.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PredictionController : ControllerBase
    {
        private readonly BlobStorageService _blob;
        private readonly AiInferenceClient _ai;
        private readonly PredictionLogService _logService;

        public PredictionController(
            BlobStorageService blob,
            AiInferenceClient ai,
            PredictionLogService logService)
        {
            _blob = blob;
            _ai = ai;
            _logService = logService;
        }

        
        [HttpPost("predict")]
        [RequestSizeLimit(10_000_000)]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Predict(
            [FromForm] PredictionRequest request,
            CancellationToken ct)
        {
            var file = request?.File;

            if (file == null || file.Length == 0)
                return BadRequest("Dosya boş olamaz.");

            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized("Token içinde userId bulunamadı.");

            // 1) Blob upload
            var (blobUrl, blobName) =
                await _blob.UploadAsync(file, userId.Value.ToString(), ct);

            // 2) AI inference
            var aiResult = await _ai.PredictAsync(file, ct);

            // 3) SQL log
            var log = new PredictionLog
            {
                UserId = userId.Value,
                BlobUrl = blobUrl,
                BlobName = blobName,
                Label = aiResult.Label,
                Confidence = aiResult.Confidence,
                CreatedAt = DateTime.UtcNow
            };

            await _logService.AddAsync(log, ct);

            
            string? sasUrl = null;
            try
            {
                if (!string.IsNullOrWhiteSpace(blobName))
                    sasUrl = _blob.GetReadSasUrl(blobName, expiresInMinutes: 15);
            }
            catch
            {
                
                sasUrl = null;
            }

            return Ok(new
            {
                message = "Prediction completed",
                blobUrl,
                blobName,
                sasUrl,         
                label = aiResult.Label,
                confidence = aiResult.Confidence,
                createdAt = log.CreatedAt
            });
        }

      
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory(CancellationToken ct)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized("Token içinde userId bulunamadı.");

            var logs = await _logService.GetByUserIdAsync(userId.Value, ct);

            
            return Ok(logs.Select(x =>
            {
                string? sasUrl = null;

                try
                {
                    if (!string.IsNullOrWhiteSpace(x.BlobName))
                        sasUrl = _blob.GetReadSasUrl(x.BlobName, expiresInMinutes: 15);
                    else if (!string.IsNullOrWhiteSpace(x.BlobUrl))
                        sasUrl = _blob.GetReadSasUrlFromBlobUrl(x.BlobUrl, expiresInMinutes: 15);
                }
                catch
                {
                    sasUrl = null; 
                }

                return new
                {
                    x.Id,
                    x.BlobUrl,
                    x.BlobName,

                    
                    imageUrl = sasUrl,
                    sasUrl = sasUrl,

                    x.Label,
                    x.Confidence,
                    x.CreatedAt
                };
            }));
        }

        
        private int? GetUserIdFromToken()
        {
            var idStr =
                User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                User.FindFirstValue("sub");

            return int.TryParse(idStr, out var id) ? id : null;
        }
    }
}