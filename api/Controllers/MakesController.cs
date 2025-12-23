using api.Dtos.MakesAndModels;
using api.Service;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MakesController : ControllerBase
    {
        private readonly MakesService _makesService;

        public MakesController(MakesService makesService)
        {
            _makesService = makesService;
        }

        [HttpGet]
        public async Task<ActionResult<List<MakeWithOffersDto>>> GetMakes()
        {
            var makes = await _makesService.GetMakesAsync();
            return Ok(makes);
        }

        [HttpGet("models")]
        public async Task<ActionResult<List<MakeModelsWithOffersDto>>> GetModels([FromQuery] int[] makeIds)
        {
            if (makeIds == null || makeIds.Length == 0)
                return BadRequest("Provide at least one makeId");

            var models = await _makesService.GetModelsByMakeIdsAsync(makeIds.ToList());
            return Ok(models);
        }
    }
}