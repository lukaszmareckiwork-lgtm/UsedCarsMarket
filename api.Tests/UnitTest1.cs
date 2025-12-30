using Xunit;
using FluentAssertions;
using Moq;

public class SampleTests
{
    [Fact]
    public void True_ShouldBeTrue()
    {
        // Act
        var result = true;

        // Assert
        result.Should().BeTrue();
    }
}