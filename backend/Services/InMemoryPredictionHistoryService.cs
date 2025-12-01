using isteodev.Models;

namespace isteodev.Services
{
    public class InMemoryPredictionHistoryService : IPredictionHistoryService
    {
        private static List<PredictionHistory> _history = new();
        private static int _id = 1;

        public void Add(PredictionHistory item)
        {
            item.Id = _id++;
            _history.Add(item);
        }

        public List<PredictionHistory> GetAll()
        {
            return _history.OrderByDescending(x => x.CreatedAt).ToList();
        }
    }
}
