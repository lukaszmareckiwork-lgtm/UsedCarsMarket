

namespace api.Interfaces
{
    public interface IBlobStorageService
    {
        Task DeleteAsync(string blobUrl);
        Task<(string Small, string Medium, string Large)> UploadResizedImagesAsync(byte[] small, byte[] medium, byte[] large, string fileNameBase);
    }
}