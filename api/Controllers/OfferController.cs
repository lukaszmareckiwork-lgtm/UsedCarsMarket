using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Offer;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/offer")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public OfferController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var offers = await _context.Offers.ToListAsync();
            
            var offersDtos = offers.Select(o => o.OfferDto());

            return Ok(offersDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var offer = await _context.Offers.FindAsync(id);

            if (offer == null)
                return NotFound();

            return Ok(offer.OfferDto());
        }

        [HttpGet("preview")]
        public async Task<IActionResult> GetAllPreview()
        {
            var offers = await _context.Offers.ToListAsync();

            var offersDtos = offers.Select(o => o.OfferPreviewDto());

            return Ok(offersDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOfferRequestDto createOfferRequestDto)
        {
            var offerModel = createOfferRequestDto.ToOfferFromCreateDto();
            await _context.Offers.AddAsync(offerModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = offerModel.Id }, offerModel.OfferDto());
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateOfferRequestDto updateOfferRequestDto)
        {
            var offerModel = await _context.Offers.FirstOrDefaultAsync(o => o.Id == id);

            if(offerModel == null)
                return NotFound();

            offerModel.Guid = updateOfferRequestDto.Guid;
            offerModel.MakeId = updateOfferRequestDto.MakeId;
            offerModel.ModelId = updateOfferRequestDto.ModelId;
            //ADD EVRYTHING THAT WE WANT TO UPDATE
            offerModel.Description = updateOfferRequestDto.Description;

            await _context.SaveChangesAsync();
            
            return Ok(offerModel.OfferDto());
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var offerModel = await _context.Offers.FirstOrDefaultAsync(o => o.Id == id);

            if(offerModel == null)
                return NotFound();
            
            _context.Offers.Remove(offerModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}