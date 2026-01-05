using api.Data;
using api.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace api.Tests.Integration
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        private SqliteConnection _connection = null!;

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("IntegrationTests");

            builder.ConfigureAppConfiguration((context, config) =>
            {
                var testSettings = new Dictionary<string, string?>
                {
                    ["JWT:SigningKey"] = "THIS_IS_A_64_BYTE_LONG_TEST_KEY_FOR_HMACSHA512___1234567890ABCDEF",
                    ["JWT:Issuer"] = "TestIssuer",
                    ["JWT:Audience"] = "TestAudience"
                };
                config.AddInMemoryCollection(testSettings);
            });
            
            builder.ConfigureServices(async services =>
            {
                services.RemoveAll<ApplicationDBContext>();

                // SQLite in-memory (relational, constraints enforced)
                _connection = new SqliteConnection("DataSource=:memory:");
                _connection.Open();

                services.AddDbContext<ApplicationDBContext>(options =>
                {
                    options.UseSqlite(_connection);
                });

                // Replace external services
                services.RemoveAll<IBlobStorageService>();
                services.RemoveAll<IImageService>();

                services.AddScoped<IBlobStorageService, FakeBlobStorageService>();
                services.AddScoped<IImageService, FakeImageService>();

                // Build & migrate DB
                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
                db.Database.EnsureCreated();

                // Seed Makes/Models synchronously
                TestDatabaseSeeder.SeedTestDataAsync(db).GetAwaiter().GetResult();
            });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _connection.Dispose();
        }
    }
}