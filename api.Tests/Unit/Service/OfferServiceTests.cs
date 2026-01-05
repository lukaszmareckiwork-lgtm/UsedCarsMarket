using Xunit;
using Moq;
using FluentAssertions;
using api.Service;
using api.Interfaces;
using api.Models;
using api.Dtos.Offer;
using Microsoft.AspNetCore.Identity;


namespace api.Tests.Service
{
    public class OfferServiceTests
    {
        private readonly Mock<IOfferRepository> _repo = new();
        private readonly Mock<IBlobStorageService> _blob = new();
        private readonly Mock<IImageService> _image = new();
        private readonly Mock<UserManager<AppUser>> _userManager;

        public OfferServiceTests()
        {
            _userManager = new Mock<UserManager<AppUser>>(
                Mock.Of<IUserStore<AppUser>>(),
                null, null, null, null, null, null, null, null
            );
        }

        private OfferService CreateService()
        {
            return new OfferService(
                _repo.Object,
                _blob.Object,
                _image.Object,
                _userManager.Object
            );
        }

        [Fact]
        public async Task CreateOfferAsync_ValidDto_CreatesOffer()
        {
            var dto = new CreateOfferRequestDto
            {
                Title = "Test offer",
                Price = 10000,
                Photos = new List<PhotoDto>()
            };

            _repo.Setup(r => r.CreateAsync(It.IsAny<Offer>()))
                .ReturnsAsync((Offer o) => o);

            var service = CreateService();

            var result = await service.CreateOfferAsync(dto, appUserId: "user-1");

            result.Should().NotBeNull();
            result.Title.Should().Be("Test offer");
            result.AppUserId.Should().Be("user-1");

            _repo.Verify(r => r.CreateAsync(It.IsAny<Offer>()), Times.Once);
        }

        [Fact]
        public async Task UpdateOfferAsync_OfferDoesNotExist_ReturnsNull()
        {
            _repo.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync((Offer?)null);

            var service = CreateService();

            var result = await service.UpdateOfferAsync(1, new UpdateOfferRequestDto());

            result.Should().BeNull();
        }

        [Fact]
        public async Task DeleteOfferAsync_UserNotOwnerAndNotAdmin_ThrowsUnauthorized()
        {
            var offer = new Offer
            {
                Id = 1,
                AppUserId = "owner-id"
            };

            var user = new AppUser { Id = "other-user" };

            _repo.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(offer);

            _userManager.Setup(u => u.IsInRoleAsync(user, "Admin"))
                .ReturnsAsync(false);

            var service = CreateService();

            Func<Task> act = async () => await service.DeleteOfferAsync(1, user);

            await act.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Fact]
        public async Task DeleteOfferAsync_AdminUser_DeletesOffer()
        {
            var offer = new Offer
            {
                Id = 1,
                AppUserId = "owner-id",
                Photos =
                {
                    new Photo { UrlSmall = "s", UrlMedium = "m", UrlLarge = "l" }
                }
            };

            var admin = new AppUser { Id = "admin" };

            _repo.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(offer);

            _repo.Setup(r => r.DeleteAsync(1))
                .ReturnsAsync(offer);

            _userManager.Setup(u => u.IsInRoleAsync(admin, "Admin"))
                .ReturnsAsync(true);

            var service = CreateService();

            var result = await service.DeleteOfferAsync(1, admin);

            result.Should().NotBeNull();
            _blob.Verify(b => b.DeleteAsync(It.IsAny<string>()), Times.Exactly(3));
            _repo.Verify(r => r.DeleteAsync(1), Times.Once);
        }

        [Fact]
        public async Task DeleteOfferAsync_OfferDoesNotExist_ReturnsNull()
        {
            _repo.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync((Offer?)null);

            var service = CreateService();
            var user = new AppUser { Id = "user" };

            var result = await service.DeleteOfferAsync(1, user);

            result.Should().BeNull();
        }
    }
}