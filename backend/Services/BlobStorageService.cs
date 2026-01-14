using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;

namespace isteodev.Services;

public class BlobStorageService
{
    private readonly string _conn;
    private readonly string _containerName;

    
    private BlobContainerClient? _container;
    private readonly object _lock = new();

    public BlobStorageService(IConfiguration config)
    {
        _conn = (config["Blob:ConnectionString"] ?? "").Trim();
        _containerName = (config["Blob:ContainerName"] ?? "").Trim();

        if (string.IsNullOrWhiteSpace(_conn))
            throw new InvalidOperationException("Blob:ConnectionString eksik. appsettings.Development.json içine ekleyin.");

        if (string.IsNullOrWhiteSpace(_containerName))
            throw new InvalidOperationException("Blob:ContainerName eksik. appsettings.Development.json içine ekleyin.");

        Console.WriteLine($"[Blob] ContainerName = {_containerName}");
        Console.WriteLine($"[Blob] ConnectionString Length = {_conn.Length}");
    }

    private BlobContainerClient GetContainer()
    {
        if (_container != null) return _container;

        lock (_lock)
        {
            if (_container != null) return _container;

            var c = new BlobContainerClient(_conn, _containerName);

            
            c.CreateIfNotExists(PublicAccessType.None);

            _container = c;
            return _container;
        }
    }

    public async Task<(string BlobUrl, string BlobName)> UploadAsync(
        IFormFile file,
        string userId,
        CancellationToken ct = default)
    {
        if (file == null || file.Length == 0)
            throw new InvalidOperationException("Upload edilecek dosya boş.");

        var container = GetContainer();

        var safeName = Path.GetFileName(file.FileName);
        var blobName = $"{userId}/{DateTime.UtcNow:yyyy-MM-dd}/{Guid.NewGuid()}_{safeName}";

        var blobClient = container.GetBlobClient(blobName);

        var options = new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders
            {
                ContentType = string.IsNullOrWhiteSpace(file.ContentType)
                    ? "application/octet-stream"
                    : file.ContentType
            }
        };

        await using var stream = file.OpenReadStream();
        await blobClient.UploadAsync(stream, options, ct);

        return (blobClient.Uri.ToString(), blobName);
    }

    public async Task DeleteAsync(string blobName, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(blobName))
            return;

        var container = GetContainer();
        var blobClient = container.GetBlobClient(blobName);

        await blobClient.DeleteIfExistsAsync(
            DeleteSnapshotsOption.IncludeSnapshots,
            cancellationToken: ct
        );
    }

    /// <summary>
   
    /// </summary>
    public string GetReadSasUrl(string blobName, int expiresInMinutes = 15)
    {
        if (string.IsNullOrWhiteSpace(blobName))
            throw new ArgumentException("blobName boş olamaz", nameof(blobName));

        var container = GetContainer();
        var blobClient = container.GetBlobClient(blobName);

        
        if (!blobClient.CanGenerateSasUri)
            throw new InvalidOperationException("SAS üretilemedi. ConnectionString AccountKey içermiyor olabilir.");

        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = _containerName,
            BlobName = blobName,
            Resource = "b", // blob
            ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(expiresInMinutes)
        };

        sasBuilder.SetPermissions(BlobSasPermissions.Read);

        var sasUri = blobClient.GenerateSasUri(sasBuilder);
        return sasUri.ToString();
    }

    /// <summary>
    
    /// </summary>
    public string GetReadSasUrlFromBlobUrl(string blobUrl, int expiresInMinutes = 15)
    {
        if (string.IsNullOrWhiteSpace(blobUrl))
            throw new ArgumentException("blobUrl boş olamaz", nameof(blobUrl));

        
        var uri = new Uri(blobUrl);
        var path = uri.AbsolutePath.TrimStart('/'); // xray-images/1/2026-01-10/abc.png

        
        if (!path.StartsWith(_containerName + "/", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("blobUrl containerName ile eşleşmiyor.");

        var blobName = path.Substring(_containerName.Length + 1); 

        return GetReadSasUrl(blobName, expiresInMinutes);
    }
}