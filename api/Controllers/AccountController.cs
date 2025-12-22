using System.Text.RegularExpressions;
using api.Dtos.Account;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
                return Unauthorized("Invalid email or password.");

            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                loginDto.Password,
                lockoutOnFailure: true
            );

            if (!result.Succeeded)
                return Unauthorized("Invalid email or password.");

            return Ok(new NewUserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Phone = user.PhoneNumber,
                SellerType = user.SellerType,
                Token = _tokenService.CreateToken(user),
                Id = user.Id,
            });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var appUser = new AppUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                PhoneNumber = Regex.Replace(registerDto.Phone, @"[^\d+]", ""),
                SellerType = registerDto.SellerType,
            };

            var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);
            if (!createdUser.Succeeded)
                return BadRequest(createdUser.Errors);

            var roleResult = await _userManager.AddToRoleAsync(appUser, "User");
            if (!roleResult.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, roleResult.Errors);

            return Ok(new NewUserDto
            {
                UserName = appUser.UserName,
                Email = appUser.Email,
                Phone = appUser.PhoneNumber,
                SellerType = appUser.SellerType,
                Token = _tokenService.CreateToken(appUser),
                Id = appUser.Id,
            });
        }
    }
}