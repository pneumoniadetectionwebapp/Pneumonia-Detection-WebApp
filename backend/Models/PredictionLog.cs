namespace isteodev.Models;

public class PredictionLog
{
    public long Id { get; set; }

    public int UserId { get; set; }

    public string BlobUrl { get; set; } = string.Empty;
    public string BlobName { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;
    public double Confidence { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}