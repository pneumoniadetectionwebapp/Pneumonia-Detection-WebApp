using System.Text.Json.Serialization;

namespace isteodev.Models;

public class AiPredictResult
{
    
    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;

    
    [JsonPropertyName("confidence")]
    public double Confidence { get; set; }
}