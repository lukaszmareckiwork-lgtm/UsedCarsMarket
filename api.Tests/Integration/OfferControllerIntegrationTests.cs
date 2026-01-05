using System.Net;
using System.Net.Http.Headers;
using api.Data;
using api.Interfaces;
using api.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace api.Tests.Integration
{
    public class OfferControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly IServiceScopeFactory _scopeFactory;

        public OfferControllerIntegrationTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
            _scopeFactory = factory.Services.GetRequiredService<IServiceScopeFactory>();
        }

        [Fact]
        public async Task POST_offer_controller_creates_offer_and_persists_it()
        {
            // Arrange – create user + JWT
            string token;
            using (var scope = _scopeFactory.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
                var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();

                var user = new AppUser
                {
                    UserName = "test@test.com",
                    Email = "test@test.com"
                };

                await userManager.CreateAsync(user, "Test123");
                token = tokenService.CreateToken(user);
            }

            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var form = new MultipartFormDataContent
            {
                { new StringContent("1"), "MakeId" },
                { new StringContent("1"), "ModelId" },
                { new StringContent("2020"), "Year" },
                { new StringContent("100000"), "Mileage" },
                { new StringContent("0"), "FuelType" },
                { new StringContent("0"), "Transmission" },
                { new StringContent("Test title"), "Title" },
                { new StringContent("Test description"), "Description" },
                { new StringContent("Berlin"), "LocationName" },
                { new StringContent("52.52"), "LocationLat" },
                { new StringContent("13.405"), "LocationLong" },
                { new StringContent("10000"), "Price" },
                { new StringContent("EUR"), "Currency" }
            };

            // Act
            var response = await _client.PostAsync("/api/offer", form);

            // Assert – HTTP
            response.StatusCode.Should().Be(HttpStatusCode.Created);

            // Assert – DB state
            using var assertScope = _scopeFactory.CreateScope();
            var db = assertScope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

            db.Offers.Should().HaveCount(1);
            db.Offers.Single().Title.Should().Be("Test title");
        }
    }
}