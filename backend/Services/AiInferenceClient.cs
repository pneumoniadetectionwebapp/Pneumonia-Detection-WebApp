using System.Net.Http.Headers;
using System.Text.Json;
using isteodev.Models;

namespace isteodev.Services;

public class AiInferenceClient
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;
    private readonly ILogger<AiInferenceClient> _logger;

    public AiInferenceClient(HttpClient http, IConfiguration config, ILogger<AiInferenceClient> logger)
    {
        _http = http;
        _config = config;
        _logger = logger;
    }

    public async Task<AiPredictResult> PredictAsync(IFormFile file, CancellationToken ct)
    {
        var baseUrl = _config["AI:BaseUrl"] ?? throw new Exception("AI:BaseUrl missing");
        var path = _config["AI:PredictPath"] ?? "/predict";
        var url = $"{baseUrl.TrimEnd('/')}{path}";

        using var form = new MultipartFormDataContent();

        var stream = file.OpenReadStream();
        var fileContent = new StreamContent(stream);

        
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType ?? "application/octet-stream");

        
        form.Add(fileContent, "file", file.FileName);

        using var resp = await _http.PostAsync(url, form, ct);
        var body = await resp.Content.ReadAsStringAsync(ct);

        _logger.LogInformation("AI status={Status} body={Body}", (int)resp.StatusCode, body);

        if (!resp.IsSuccessStatusCode)
            throw new Exception($"AI request failed: {(int)resp.StatusCode} body={body}");

        var result = JsonSerializer.Deserialize<AiPredictResult>(
            body,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        );

        if (result == null)
            throw new Exception($"AI response parse failed. body={body}");

        
        if (string.IsNullOrWhiteSpace(result.Label))
            throw new Exception($"AI returned empty label. body={body}");

        return result;
    }
}