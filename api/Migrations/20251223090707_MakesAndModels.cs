using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class MakesAndModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Makes",
                columns: table => new
                {
                    MakeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MakeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MakeSlug = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Makes", x => x.MakeId);
                });

            migrationBuilder.CreateTable(
                name: "OfferCounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MakeId = table.Column<int>(type: "int", nullable: false),
                    ModelId = table.Column<int>(type: "int", nullable: true),
                    OffersCount = table.Column<int>(type: "int", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OfferCounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Models",
                columns: table => new
                {
                    ModelId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ModelName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VehicleType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MakeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Models", x => x.ModelId);
                    table.ForeignKey(
                        name: "FK_Models_Makes_MakeId",
                        column: x => x.MakeId,
                        principalTable: "Makes",
                        principalColumn: "MakeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ModelYears",
                columns: table => new
                {
                    ModelYearId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Year = table.Column<int>(type: "int", nullable: false),
                    ModelId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModelYears", x => x.ModelYearId);
                    table.ForeignKey(
                        name: "FK_ModelYears_Models_ModelId",
                        column: x => x.ModelId,
                        principalTable: "Models",
                        principalColumn: "ModelId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Models_MakeId",
                table: "Models",
                column: "MakeId");

            migrationBuilder.CreateIndex(
                name: "IX_ModelYears_ModelId",
                table: "ModelYears",
                column: "ModelId");

            migrationBuilder.CreateIndex(
                name: "IX_OfferCounts_MakeId",
                table: "OfferCounts",
                column: "MakeId");

            migrationBuilder.CreateIndex(
                name: "IX_OfferCounts_MakeId_ModelId",
                table: "OfferCounts",
                columns: new[] { "MakeId", "ModelId" },
                unique: true,
                filter: "[ModelId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_OfferCounts_ModelId",
                table: "OfferCounts",
                column: "ModelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ModelYears");

            migrationBuilder.DropTable(
                name: "OfferCounts");

            migrationBuilder.DropTable(
                name: "Models");

            migrationBuilder.DropTable(
                name: "Makes");
        }
    }
}
