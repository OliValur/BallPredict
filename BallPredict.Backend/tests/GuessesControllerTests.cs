/*
    using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using BallPredict.Backend;
using BallPredict.Backend.Services;
using BallPredict.Backend.DTOs;
using BallPredict.Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using System;

namespace BallPredict.Backend.Tests.Controllers
{
    public class GuessesControllerTests
    {
        private readonly Mock<GuessService> _mockGuessService;
        private readonly TestGuessesController _controller;

        public GuessesControllerTests()
        {
            _mockGuessService = new Mock<GuessService>(null, null);
            _controller = new TestGuessesController(_mockGuessService.Object);
        }

        [Fact]
        public async Task Get_ReturnsOkWithGuesses()
        {
            // Arrange
            var userId = "user-123";
            var week = 2;
            var guesses = new List<Games>
            {
                new Games { Id = Guid.NewGuid(), HomeTeam = "A", AwayTeam = "B", Week = week, StartTime = DateTime.UtcNow }
            };
            _mockGuessService.Setup(s => s.GetUserGuessesAsync(userId, week)).ReturnsAsync(guesses);
            _controller.SetUserId(userId);

            // Act
            var result = await _controller.Get(week);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(guesses, okResult.Value);
        }

        [Fact]
        public async Task Post_ReturnsOkWithResult()
        {
            // Arrange
            var userId = "user-456";
            var guessDto = new GuessDto { GameId = Guid.NewGuid(), Prediction = 1 };
            _mockGuessService.Setup(s => s.AddGuessAsync(It.IsAny<Guess>())).ReturnsAsync(true);
            _controller.SetUserId(userId);

            // Act
            var result = await _controller.Post(guessDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.True((bool)okResult.Value);
        }

        // Helper controller to override GetUserId
        private class TestGuessesController : GuessesController
        {
            private string _userId;
            public TestGuessesController(GuessService guessService) : base(guessService) { }
            public void SetUserId(string userId) => _userId = userId;
            protected override string GetUserId() => _userId;
        }
    }
}
*/