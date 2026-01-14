using isteodev.Data;
using isteodev.Models;
using Microsoft.EntityFrameworkCore;

namespace isteodev.Services;

public class PredictionLogService
{
    private readonly AppDbContext _db;

    public PredictionLogService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PredictionLog> AddAsync(PredictionLog log, CancellationToken ct = default)
    {
        _db.PredictionLogs.Add(log);
        await _db.SaveChangesAsync(ct);
        return log;
    }

    public async Task<List<PredictionLog>> GetByUserIdAsync(int userId, CancellationToken ct = default)
    {
        return await _db.PredictionLogs
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(ct);
    }
}