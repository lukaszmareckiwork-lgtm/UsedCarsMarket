using System.Globalization;
using api.Data;
using api.Helpers;
using api.Interfaces;
using api.Models;
using api.Repository;
using api.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Microsoft.AspNetCore.Http;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "JWT Authorization header using the Bearer scheme."
    });
    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("bearer", document)] = []
    });
});

var isIntegrationTests = builder.Environment.EnvironmentName == "IntegrationTests";

if (!isIntegrationTests)
{
    builder.Services.AddDbContext<ApplicationDBContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
}

// Bind and validate options
builder.Services.Configure<api.Options.AzureBlobOptions>(builder.Configuration.GetSection("AzureBlob"));
builder.Services.Configure<api.Options.JwtOptions>(builder.Configuration.GetSection("JWT"));

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 5;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredUniqueChars = 0;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<ApplicationDBContext>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme = 
    options.DefaultForbidScheme = 
    options.DefaultScheme = 
    options.DefaultSignInScheme = 
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    // Read JWT options from configuration (already bound above)
    var jwtOpts = builder.Configuration.GetSection("JWT").Get<api.Options.JwtOptions>()
                  ?? throw new Exception("JWT configuration section is missing");

    if (string.IsNullOrEmpty(jwtOpts.SigningKey))
        throw new Exception("JWT:SigningKey is not configured");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtOpts.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtOpts.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(jwtOpts.SigningKey)
        )
    };
});

var culture = new CultureInfo("en-US");
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture(culture);
    options.SupportedCultures = new List<CultureInfo> { culture };
    options.SupportedUICultures = new List<CultureInfo> { culture };
});

builder.Services.AddScoped<IOfferRepository, OfferRepostiory>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IFavouriteOffersRepository, FavouriteOffersRepository>();

builder.Services.AddScoped<IBlobStorageService, BlobStorageService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<OfferService>();

builder.Services.AddScoped<IMakesRepository, MakesRepository>();
builder.Services.AddScoped<MakesService>();

builder.Services.AddScoped<IOfferCountRepository, OfferCountRepository>();
builder.Services.AddScoped<OfferCountService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Lightweight health endpoint to check whether app and its database are responsive.
// Returns 200 when DB can be reached, or 503 otherwise. Uses a short timeout so
// probes return quickly while the server/database is still cold-starting.
app.MapGet("api/health", async (IServiceProvider services, CancellationToken ct) =>
{
    // If DB isn't registered (e.g., IntegrationTests), consider the app healthy.
    try
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetService<ApplicationDBContext>();
        if (db == null)
            return Results.Ok("Healthy");

        // Short timeout for health checks
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
        cts.CancelAfter(3000);

        var canConnect = await db.Database.CanConnectAsync(cts.Token);
        if (canConnect)
            return Results.Ok("Healthy");
        return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
    }
    catch (OperationCanceledException)
    {
        return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
    }
    catch (Exception)
    {
        return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
    }
});

app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    .WithOrigins(
        "https://ambitious-beach-082d32c1e.6.azurestaticapps.net",
        "http://localhost:5173") // intentionally added for simplification of portfolio project, it should be removed and/or adjusted based on enviro in real project
);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseRequestLocalization();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
    db.Database.Migrate(); // applies all pending migrations
}

// Seed makes nad models from json to database
try
{
    await DatabaseSeeder.SeedVehicleDataAndOfferCountsAsync(app.Services);
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Failed to seed vehicle data.");
}

app.Run();