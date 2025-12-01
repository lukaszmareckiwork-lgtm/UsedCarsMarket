using api.Interfaces;
using api.Options;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Options;

namespace api.Service
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly BlobContainerClient _container;

        public BlobStorageService(IOptions<AzureBlobOptions> options)
        {
            var cfg = options?.Value ?? throw new ArgumentNullException(nameof(options));
            _container = new BlobContainerClient(cfg.ConnectionString, cfg.ContainerName);
        }

        public async Task DeleteAsync(string blobUrl)
        {
            var uri = new Uri(blobUrl);
            var blobName = uri.Segments.Last();
            await _container.DeleteBlobIfExistsAsync(blobName);
        }

        public async Task<(string Small, string Medium, string Large)> UploadResizedImagesAsync(
            byte[] small, byte[] medium, byte[] large, string fileNameBase)
        {
            string smallName = $"{fileNameBase}_small.webp";
            string mediumName = $"{fileNameBase}_medium.webp";
            string largeName = $"{fileNameBase}_large.webp";

            await _container.UploadBlobAsync(smallName, new BinaryData(small));
            await _container.UploadBlobAsync(mediumName, new BinaryData(medium));
            await _container.UploadBlobAsync(largeName, new BinaryData(large));

            return (
                $"{_container.Uri}/{smallName}",
                $"{_container.Uri}/{mediumName}",
                $"{_container.Uri}/{largeName}"
            );
        }
    }

}