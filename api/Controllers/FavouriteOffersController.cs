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
        public async Task<IActionResult> GetUserFavouriteOffersIds()
        {
            var appUser = await this.GetCurrentUserAsync(_userManager);
            if (appUser == null) return Unauthorized();

            var userFavouriteOffersIds = await _favouriteOffersRepo.GetUserFavouriteOffersIds(appUser);
            return Ok(userFavouriteOffersIds);
        }

        [HttpGet("count")]
        [Authorize]
        public async Task<IActionResult> GetUserFavouriteOffersCount()
        {
            var appUser = await this.GetCurrentUserAsync(_userManager);
            if (appUser == null) return Unauthorized();
            
            var userFavouriteOffersCount = await _favouriteOffersRepo.GetUserFavouriteOffersCount(appUser);
            return Ok(userFavouriteOffersCount);
        }

        [HttpPost]
        [Route("{offerId:int}")]
        [Authorize]
        public async Task<IActionResult> AddFavouriteOffer([FromRoute] int offerId)
        {
            var appUser = await this.GetCurrentUserAsync(_userManager);
            if (appUser == null) return Unauthorized();

            var offer = await _offerRepo.GetByIdAsync(offerId);
            if(offer == null) return BadRequest("Offer not found!");

            var userFavouriteOffers = await _favouriteOffersRepo.GetUserFavouriteOffersIds(appUser);

            if(userFavouriteOffers.Contains(offerId))
            {
                var currentCount = userFavouriteOffers.Count;
                return Conflict(new { offerId, isFavourite = true, favouritesCount = currentCount });
            }

            var favouriteOfferModel = new FavouriteOffer
            {
                AppUserId = appUser.Id,
                OfferId = offer.Id
            };

            var created = await _favouriteOffersRepo.CreateAsync(favouriteOfferModel);
            if (created == null) return StatusCode(500, "Could not create new favourite offer");

            var updatedCount = await _favouriteOffersRepo.GetUserFavouriteOffersCount(appUser);

            // Return 201 Created pointing to the canonical Offer GET
            return CreatedAtAction(nameof(OfferController.GetById), "Offer", new { id = created.OfferId }, new { offerId = created.OfferId, isFavourite = true, favouritesCount = updatedCount });
        }

        [HttpDelete]
        [Route("{offerId:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteFavouriteOffer([FromRoute] int offerId)
        {
            var appUser = await this.GetCurrentUserAsync(_userManager);
            if (appUser == null) return Unauthorized();

            var wasDeleted = await _favouriteOffersRepo.DeleteAsync(appUser, offerId);
            if (wasDeleted == null)
                return NotFound("Offer is not in your favourites.");

            var updatedCount = await _favouriteOffersRepo.GetUserFavouriteOffersCount(appUser);

            return Ok(new { offerId, isFavourite = false, favouritesCount = updatedCount });
        }
    }
}