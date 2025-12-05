using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Extensions
{
    public static class ControllersExtensions
    {
        public static async Task<AppUser?> GetCurrentUserAsync(this ControllerBase controller, UserManager<AppUser> userManager)
        {
            var email = controller.User?.GetEmail();
            if (email == null) return null;

            return await userManager.FindByEmailAsync(email);
        }
    }
}