using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using api.Models;

namespace api.Dtos.Account
{
    public class RegisterDto
    {
        [Required]
        [StringLength(20, MinimumLength = 3)]
        [RegularExpression(
            @"^[a-zA-Z](?!.*[._]{2})[a-zA-Z0-9._]*[^._]$",
            ErrorMessage =
                "Username must start with a letter, be 3–20 characters long, contain only letters, numbers, dots or underscores, cannot contain consecutive dots or underscores, and cannot end with a dot or underscore."
        )]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(5)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [RegularExpression(
            @"^\+?[1-9]\d{6,14}$",
            ErrorMessage = "Enter a valid phone number."
        )]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [EnumDataType(typeof(SellerType))]
        public SellerType SellerType { get; set; }
    }
}
