namespace isteodev.Models
{
    public class PredictionHistory
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = "";
        public string Label { get; set; } = "";
        public double Confidence { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
