using api.Dtos.OfferCount;
using api.Interfaces;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/offercount")]
    [ApiController]
    public class OfferCountsController : ControllerBase
    {
        private readonly OfferCountService _service;

        public OfferCountsController(OfferCountService service)
        {
            _service = service;
        }

        // GET: api/offercount/makes
        [HttpGet("makes")]
        public async Task<IActionResult> GetMakeCounts()
        {
            var result = await _service.GetMakeCountsAsync();
            return Ok(result);
        }

        // POST: api/offercount/models
        [HttpPost("models")]
        public async Task<IActionResult> GetModelCounts([FromBody] List<int> makeIds)
        {
            if (makeIds == null || makeIds.Count == 0)
                return BadRequest("MakeIds list is required");

            var result = await _service.GetModelCountsAsync(makeIds);
            return Ok(result);
        }
    }
}
