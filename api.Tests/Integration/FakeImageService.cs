using api.Interfaces;
using Microsoft.AspNetCore.Http;

namespace api.Tests.Integration
{
    public class FakeImageService : IImageService
    {
        public Task<(byte[] Small, byte[] Medium, byte[] Large)> ResizeToThreeSizesAsync(IFormFile file)
        {
            return Task.FromResult((
                new byte[] { 1 },
                new byte[] { 2 },
                new byte[] { 3 }
            ));
        }
    }
}