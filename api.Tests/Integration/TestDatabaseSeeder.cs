using api.Data;
using api.Models;

namespace api.Tests.Integration
{
    public static class TestDatabaseSeeder
    {
        public static async Task SeedTestDataAsync(ApplicationDBContext db)
        {
            db.Makes.Add(new Make { MakeId = 1, MakeName = "TestMake", MakeSlug = "testmake" });

            db.Models.Add(new Model
            {
                ModelId = 1,
                ModelName = "TestModel",
                MakeId = 1,
                VehicleType = "Car"
            });

            await db.SaveChangesAsync();
        }
    }
}