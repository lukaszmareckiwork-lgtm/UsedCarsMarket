using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Offer;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;

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
        public IActionResult GetAll()
        {
            var offers = _context.Offers.ToList()
                .Select(o => o.OfferDto());

            return Ok(offers);
        }

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var offer = _context.Offers.Find(id);

            if (offer == null)
                return NotFound();

            return Ok(offer.OfferDto());
        }

        [HttpGet("preview")]
        public IActionResult GetAllPreview()
        {
            var offers = _context.Offers.ToList()
                .Select(o => o.OfferPreviewDto());

            return Ok(offers);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateOfferRequestDto createOfferRequestDto)
        {
            var offerModel = createOfferRequestDto.ToOfferFromCreateDto();
            _context.Offers.Add(offerModel);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = offerModel.Id }, offerModel.OfferDto());
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] UpdateOfferRequestDto updateOfferRequestDto)
        {
            var offerModel = _context.Offers.FirstOrDefault(o => o.Id == id);

            if(offerModel == null)
                return NotFound();

            offerModel.Guid = updateOfferRequestDto.Guid;
            offerModel.MakeId = updateOfferRequestDto.MakeId;
            offerModel.ModelId = updateOfferRequestDto.ModelId;
            //ADD EVRYTHING THAT WE WANT TO UPDATE
            offerModel.Description = updateOfferRequestDto.Description;

            _context.SaveChanges();
            
            return Ok(offerModel.OfferDto());
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            var offerModel = _context.Offers.FirstOrDefault(o => o.Id == id);

            if(offerModel == null)
                return NotFound();
            
            _context.Offers.Remove(offerModel);
            _context.SaveChanges();

            return NoContent();
        }
    }
}