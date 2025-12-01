using api.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace api.Service
{
    public class ImageService : IImageService
    {
        public async Task<(byte[] Small, byte[] Medium, byte[] Large)> ResizeToThreeSizesAsync(IFormFile file)
        {
            using var img = await Image.LoadAsync(file.OpenReadStream());

            return (
                Small: Resize(img, 320, 240),
                Medium: Resize(img, 1440),
                Large: ToByteArray(img)
            );
        }

        private byte[] Resize(Image image, int targetWidth, int targetHeight = 0)
        {
            using var clone = image.Clone(x => x.Resize(new ResizeOptions
            {
                Mode = ResizeMode.Max,
                Size = new Size(targetWidth, targetHeight)    
            }));

            return ToByteArray(clone);
        }

        private byte[] ToByteArray(Image image)
        {
            using var ms = new MemoryStream();
            image.SaveAsWebp(ms);
            return ms.ToArray();
        }
    }
}