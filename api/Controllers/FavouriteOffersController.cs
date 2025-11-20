using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Extensions;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/favouriteoffers")]
    [ApiController]
    public class FavouriteOffersController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IOfferRepository _offerRepository;
        private readonly IFavouriteOffersRepository _favouriteOffersRepository;

        public FavouriteOffersController(UserManager<AppUser> userManager, IOfferRepository offerRepository, IFavouriteOffersRepository favouriteOffersRepository)
        {
            _userManager = userManager;
            _offerRepository = offerRepository;
            _favouriteOffersRepository = favouriteOffersRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserFavouriteOffers()
        {
            var email = User.GetEmail();
            var appUser = await _userManager.FindByEmailAsync(email);
            var userFavouriteOffers = await _favouriteOffersRepository.GetUserFavouriteOffers(appUser);
            return Ok(userFavouriteOffers);
        }
    }
}