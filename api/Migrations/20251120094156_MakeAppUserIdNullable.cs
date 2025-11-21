using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class MakeAppUserIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavouriteOffers_AspNetUsers_AppUserId",
                table: "FavouriteOffers");

            migrationBuilder.DropForeignKey(
                name: "FK_FavouriteOffers_Offers_OfferId",
                table: "FavouriteOffers");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Offers",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Offers_AppUserId",
                table: "Offers",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FavouriteOffers_AspNetUsers_AppUserId",
                table: "FavouriteOffers",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FavouriteOffers_Offers_OfferId",
                table: "FavouriteOffers",
                column: "OfferId",
                principalTable: "Offers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_AspNetUsers_AppUserId",
                table: "Offers",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavouriteOffers_AspNetUsers_AppUserId",
                table: "FavouriteOffers");

            migrationBuilder.DropForeignKey(
                name: "FK_FavouriteOffers_Offers_OfferId",
                table: "FavouriteOffers");

            migrationBuilder.DropForeignKey(
                name: "FK_Offers_AspNetUsers_AppUserId",
                table: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Offers_AppUserId",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Offers");

            migrationBuilder.AddForeignKey(
                name: "FK_FavouriteOffers_AspNetUsers_AppUserId",
                table: "FavouriteOffers",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FavouriteOffers_Offers_OfferId",
                table: "FavouriteOffers",
                column: "OfferId",
                principalTable: "Offers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
