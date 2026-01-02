using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using api.Repository;
using api.Service;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Moq;

namespace api.Tests.Service
{
    public class OfferCountServiceTests
    {
        private readonly Mock<IOfferCountRepository> _repo = new();

        [Fact]
        public async Task AdjustOfferCountOnUpdateAsync_WhenIdsUnchanged_DoesNothing()
        {
            int oldMakeId;
            int oldModelId;

            int newMakeId;
            int newModelId;

            oldMakeId = newMakeId = 1;
            oldModelId = newModelId = 2;

            var service = new OfferCountService(_repo.Object);

            await service.AdjustOfferCountOnUpdateAsync(oldMakeId, oldModelId, newMakeId, newModelId);

            _repo.Verify(r => r.UpdateOfferCountAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task AdjustOfferCountOnUpdateAsync_WhenIdsChange_UpdatesCounts()
        {
            int oldMakeId = 1;
            int oldModelId = 2;

            int newMakeId = 3;
            int newModelId = 4;

            var service = new OfferCountService(_repo.Object);

            await service.AdjustOfferCountOnUpdateAsync(oldMakeId, oldModelId, newMakeId, newModelId);

            _repo.Verify(r => r.UpdateOfferCountAsync(It.IsAny<int>(), It.IsAny<int?>(), It.IsAny<int>()), Times.Exactly(4));
        }
    }
}