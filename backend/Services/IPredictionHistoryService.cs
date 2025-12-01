using isteodev.Models;

namespace isteodev.Services
{
    public interface IPredictionHistoryService
    {
        void Add(PredictionHistory item);
        List<PredictionHistory> GetAll();
    }
}
