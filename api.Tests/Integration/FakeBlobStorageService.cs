using api.Interfaces;

namespace api.Tests.Integration
{
    public class FakeBlobStorageService : IBlobStorageService
    {
        public Task DeleteAsync(string blobUrl) => Task.CompletedTask;

        public Task<(string Small, string Medium, string Large)> UploadResizedImagesAsync(
            byte[] small, byte[] medium, byte[] large, string fileNameBase)
        {
            return Task.FromResult((
                "small.webp",
                "medium.webp",
                "large.webp"
            ));
        }
    }
}