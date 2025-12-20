using api.Dtos.Common;
using api.Dtos.Offer;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using api.Service;

namespace api.Controllers
{
    [Route("api/offer")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly IOfferRepository _offerRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly OfferService _offerService;
        private readonly IFavouriteOffersRepository _favouriteOffersRepo;

        public OfferController(IOfferRepository offerRepo, UserManager<AppUser> userManager, OfferService offerService, IFavouriteOffersRepository favouriteOffersRepo)
        {
            _offerRepo = offerRepo;
            _userManager = userManager;
            _offerService = offerService;
            _favouriteOffersRepo = favouriteOffersRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] OfferQueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            string? appUserId = null;
            if (User?.Identity?.IsAuthenticated == true)
            {
                var email = User.GetEmail();
                var appUser = await _userManager.FindByEmailAsync(email);
                appUserId = appUser?.Id;
            }

            var result = await _offerRepo.GetAllAsync(query, appUserId);

            var dto = new PagedResult<OfferDto>
            {
                Items = result.Items.ToList(),
                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };

            return Ok(dto);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var offer = await _offerRepo.GetByIdAsync(id);

            if (offer == null)
                return NotFound();

            var dto = offer!.OfferDto();

            // If user is authenticated, include IsFavourite flag
            if (User.Identity?.IsAuthenticated == true)
            {
                var email = User.GetEmail();
                var appUser = await _userManager.FindByEmailAsync(email);
                if (appUser != null)
                {
                    dto.IsFavourite = await _favouriteOffersRepo.ExistsAsync(appUser.Id, offer.Id);
                }
            }

            return Ok(dto);
        }

        [HttpGet("preview")]
        public async Task<IActionResult> GetAllPreview([FromQuery] OfferQueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            string? appUserId = null;
            if (User?.Identity != null && User.Identity.IsAuthenticated)
            {
                var email = User.GetEmail();
                var appUser = await _userManager.FindByEmailAsync(email);
                appUserId = appUser?.Id;
            }

            var result = await _offerRepo.GetAllPreviewAsync(query, appUserId);

            var dto = new PagedResult<OfferPreviewDto>
            {
                Items = result.Items.ToList(),
                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };

            return Ok(dto);
        }

        [HttpGet("preview/favourites")]
        [Authorize]
        public async Task<IActionResult> GetAllPreviewFavourites([FromQuery] OfferQueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var email = User.GetEmail();
            var appUser = await _userManager.FindByEmailAsync(email);
            if (appUser == null)
                return Unauthorized();

            var result = await _offerRepo.GetAllPreviewFavouritesAsync(appUser.Id, query);

            var dto = new PagedResult<OfferPreviewDto>
            {
                Items = result.Items.ToList(),
                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };

            return Ok(dto);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromForm] CreateOfferRequestDto createOfferRequestDto, [FromForm] List<IFormFile>? files)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var email = User.GetEmail();
            var appUser = await _userManager.FindByEmailAsync(email);
            if (appUser == null) return Unauthorized();

            var created = await _offerService.CreateOfferAsync(createOfferRequestDto, files, appUser?.Id);

            var updatedCount = await _offerRepo.GetUserOffersCount(appUser!);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, new CreateOfferResponseDto { OfferDto = created.OfferDto(), UserOffersCount = updatedCount });
        }

        [HttpPut]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateOfferRequestDto updateOfferRequestDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var offerModel = await _offerService.UpdateOfferAsync(id, updateOfferRequestDto);

            if (offerModel == null)
                return NotFound();

            return Ok(offerModel.OfferDto());
        }

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var email = User.GetEmail();
            var appUser = await _userManager.FindByEmailAsync(email);
            if (appUser == null) return Unauthorized();

            var offerModel = await _offerService.DeleteOfferAsync(id, appUser);
            if (offerModel == null)
                return NotFound();

            var updatedCount = await _offerRepo.GetUserOffersCount(appUser);

            return Ok(new DeleteOfferResponseDto { OfferId = id, UserOffersCount = updatedCount });
        }

        [HttpGet("userofferscount")]
        [Authorize]
        public async Task<IActionResult> GetUserOffersCount()
        {
            var appUser = await this.GetCurrentUserAsync(_userManager);
            if (appUser == null) return Unauthorized();
            
            var userOffersCount = await _offerRepo.GetUserOffersCount(appUser);
            return Ok(userOffersCount);
        }
    }
}