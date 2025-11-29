

namespace api.Interfaces
{
    public interface IImageService
    {
        Task<(byte[] Small, byte[] Medium, byte[] Large)> ResizeToThreeSizesAsync(IFormFile file);
    }
}