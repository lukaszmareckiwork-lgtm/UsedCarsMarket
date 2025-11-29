using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
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
using Microsoft.EntityFrameworkCore;
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

        public OfferController(IOfferRepository offerRepo, UserManager<AppUser> userManager, OfferService offerService)
        {
            _offerRepo = offerRepo;
            _userManager = userManager;
            _offerService = offerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] OfferQueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var result = await _offerRepo.GetAllAsync(query);

            var dto = new PagedResult<OfferDto>
            {
                Items = result.Items.Select(o => o.OfferDto()).ToList(),
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

            return Ok(offer!.OfferDto());
        }

        [HttpGet("preview")]
        public async Task<IActionResult> GetAllPreview([FromQuery] OfferQueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var result = await _offerRepo.GetAllPreviewAsync(query);

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

            var created = await _offerService.CreateOfferAsync(createOfferRequestDto, files, appUser?.Id);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.OfferDto());
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

            var offerModel = await _offerService.DeleteOfferAsync(id);

            if (offerModel == null)
                return NotFound();

            return NoContent();
        }
    }
}