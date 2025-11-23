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
        private readonly IOfferRepository _offerRepo;
        private readonly IFavouriteOffersRepository _favouriteOffersRepo;

        public FavouriteOffersController(UserManager<AppUser> userManager, IOfferRepository offerRepository, IFavouriteOffersRepository favouriteOffersRepository)
        {
            _userManager = userManager;
            _offerRepo = offerRepository;
            _favouriteOffersRepo = favouriteOffersRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserFavouriteOffers()
        {
            var email = User.GetEmail();
            var appUser = await _userManager.FindByEmailAsync(email);
            var userFavouriteOffers = await _favouriteOffersRepo.GetUserFavouriteOffers(appUser);
            return Ok(userFavouriteOffers);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddFavouriteOffer(int offerId)
        {
            var email = User.GetEmail();
            var appUser = await _userManager.FindByEmailAsync(email);
            var offer = await _offerRepo.GetByIdAsync(offerId);

            if(offer == null)
                return BadRequest("Offer not found!");

            var userFavouriteOffers = await _favouriteOffersRepo.GetUserFavouriteOffers(appUser);

            if(userFavouriteOffers.Any(x => x.Id == offerId))
                return BadRequest("Offer already added!");

            var favouriteOfferModel = new FavouriteOffer
            {
                AppUserId = appUser.Id,
                OfferId = offer.Id
            };

            favouriteOfferModel = await _favouriteOffersRepo.CreateAsync(favouriteOfferModel);

            if(favouriteOfferModel == null)
                return StatusCode(500, "Could not create new favourite offer");
            else
                return Created();        
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteFavouriteOffer(int offerId)
        {
            var email = User.GetEmail();
            var appUser = await _userManager.FindByEmailAsync(email);

            var userFavouriteOffers = await _favouriteOffersRepo.GetUserFavouriteOffers(appUser);
            var filteredUserFavouriteOffers = userFavouriteOffers.Where(fo => fo.Id == offerId);

            if(filteredUserFavouriteOffers.Count() == 1)
            {
                await _favouriteOffersRepo.DeleteAsync(appUser, offerId);
            }
            else
            {
                return BadRequest("Offer is not in your favourite offers.");
            }

            return Ok();    
        }
    }
}