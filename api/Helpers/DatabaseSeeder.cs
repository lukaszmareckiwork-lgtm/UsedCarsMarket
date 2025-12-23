using System.Text.Json;
using api.Data;
using api.Dtos.MakesAndModels.ToDeserializeJson;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Helpers
{
    public static class DatabaseSeeder
    {
        public static async Task SeedVehicleDataAndOfferCountsAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

            // 1. Seed makes & models
            await SeedMakesAndModelsAsync(db, "files/cars_types_data/makes_and_models.json");

            // 2. Seed offer counts
            await SeedOfferCountsAsync(db);
        }

        private static async Task SeedMakesAndModelsAsync(ApplicationDBContext dbContext, string jsonPath)
        {
            if (dbContext.Makes.Any())
                return; // Already seeded

            var json = await File.ReadAllTextAsync(jsonPath);
            var makesData = JsonSerializer.Deserialize<List<MakeData>>(json);

            foreach (var makeData in makesData!)
            {
                var make = new Make
                {
                    MakeId = makeData.make_id,
                    MakeName = makeData.make_name,
                    MakeSlug = makeData.make_slug
                };

                foreach (var modelEntry in makeData.models.Values)
                {
                    var model = new Model
                    {
                        ModelId = modelEntry.model_id,
                        ModelName = modelEntry.model_name,
                        VehicleType = modelEntry.vehicle_type,
                        Years = modelEntry.years.Select(y => new ModelYear { Year = y }).ToList()
                    };

                    make.Models.Add(model);
                }

                dbContext.Makes.Add(make);
            }

            await dbContext.SaveChangesAsync();
        }

        private static async Task SeedOfferCountsAsync(ApplicationDBContext db)
        {
            // Remove existing counts (idempotent seeding)
            await db.Database.ExecuteSqlRawAsync("DELETE FROM OfferCounts");

            // Make level counts
            var makeCounts = await db.Offers
                .GroupBy(o => o.MakeId)
                .Select(g => new
                {
                    MakeId = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // Model level counts
            var modelCounts = await db.Offers
                .GroupBy(o => new { o.MakeId, o.ModelId })
                .Select(g => new
                {
                    g.Key.MakeId,
                    g.Key.ModelId,
                    Count = g.Count()
                })
                .ToListAsync();

            var now = DateTime.UtcNow;

            var offerCounts = new List<OfferCount>();

            // Add make-level rows
            offerCounts.AddRange(
                makeCounts.Select(x => new OfferCount
                {
                    MakeId = x.MakeId,
                    ModelId = null,
                    OffersCount = x.Count,
                    LastUpdated = now
                })
            );

            // Add model-level rows
            offerCounts.AddRange(
                modelCounts.Select(x => new OfferCount
                {
                    MakeId = x.MakeId,
                    ModelId = x.ModelId,
                    OffersCount = x.Count,
                    LastUpdated = now
                })
            );

            db.OfferCounts.AddRange(offerCounts);
            await db.SaveChangesAsync();
        }
    }
}