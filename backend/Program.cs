using isteodev.Data;
using isteodev.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ✅ ENV + Blob config debug (builder oluşturulduktan hemen sonra)
Console.WriteLine("ENV=" + builder.Environment.EnvironmentName);
Console.WriteLine("Blob:ContainerName=" + builder.Configuration["Blob:ContainerName"]);
Console.WriteLine("Blob:ConnLen=" + (builder.Configuration["Blob:ConnectionString"]?.Trim().Length ?? -1));

// (Senin mevcut debug bloğun da kalsın - daha detaylı)
var blobConn = builder.Configuration["Blob:ConnectionString"];
var blobContainer = builder.Configuration["Blob:ContainerName"];

Console.WriteLine("=== CONFIG CHECK ===");
Console.WriteLine($"Blob:ConnectionString NULL? {string.IsNullOrWhiteSpace(blobConn)}");
Console.WriteLine($"Blob:ConnectionString Length: {(blobConn ?? "").Trim().Length}");
Console.WriteLine($"Blob:ContainerName: '{(blobContainer ?? "").Trim()}'");
Console.WriteLine("====================");

builder.Services.AddControllers();

builder.Services.AddSingleton<BlobStorageService>();
builder.Services.AddScoped<PredictionLogService>();

builder.Services.AddHttpClient<AiInferenceClient>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(60);
});

builder.Services.AddSingleton<JwtService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwt = builder.Configuration.GetSection("JwtSettings");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["Key"]!))
        };
    });
    
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.EnableDetailedErrors();
    options.EnableSensitiveDataLogging(); // sadece Development'ta kalsın
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header. Örnek: Bearer {token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();