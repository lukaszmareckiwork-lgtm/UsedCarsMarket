using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Offer;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/offer")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly IOfferRepository _offerRepo;
        private readonly UserManager<AppUser> _userManager;
        public OfferController(IOfferRepository offerRepo, UserManager<AppUser> userManager)
        {
            _offerRepo = offerRepo;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] OfferQueryObject query)
        {
            if(!ModelState.IsValid)
                return BadRequest();
            
            var offers = await _offerRepo.GetAllAsync(query);
            
            var offersDtos = offers.Select(o => o.OfferDto()).ToList();

            return Ok(offersDtos);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if(!ModelState.IsValid)
                return BadRequest();

            var offer = await _offerRepo.GetByIdAsync(id);

            if (offer == null)
                return NotFound();

            return Ok(offer!.OfferDto());
        }

        [HttpGet("preview")]
        public async Task<IActionResult> GetAllPreview([FromQuery] OfferQueryObject query)
        {
            if(!ModelState.IsValid)
                return BadRequest();

            var offers = await _offerRepo.GetAllAsync(query);
            var offersDtos = offers.Select(o => o.OfferPreviewDto()).ToList();

            return Ok(offersDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOfferRequestDto createOfferRequestDto)
        {
            if(!ModelState.IsValid)
                return BadRequest();

            var email = User.GetEmail();
            var appUser = await _userManager.FindByEmailAsync(email);

            var offerModel = createOfferRequestDto.ToOfferFromCreateDto();
            offerModel.AppUserId = appUser.Id;

            await _offerRepo.CreateAsync(offerModel);

            return CreatedAtAction(nameof(GetById), new { id = offerModel.Id }, offerModel.OfferDto());
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateOfferRequestDto updateOfferRequestDto)
        {
            if(!ModelState.IsValid)
                return BadRequest();

            var offerModel = await _offerRepo.UpdateAsync(id, updateOfferRequestDto);

            if(offerModel == null)
                return NotFound();
            
            return Ok(offerModel!.OfferDto());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if(!ModelState.IsValid)
                return BadRequest();
                
            var offerModel = await _offerRepo.DeleteAsync(id);

            if(offerModel == null)
                return NotFound();

            return NoContent();
        }
    }
}