using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class SeedRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3c71bf7c-864e-429b-846c-f1ac0131cfce", "98156fae-0657-42c2-bcdf-2b7a1019b3bd", "User", "USER" },
                    { "40c0963e-f7a7-4bcd-af1a-e9ddcdb13a76", "0eb714ab-d562-4d4b-966e-153fff575adb", "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3c71bf7c-864e-429b-846c-f1ac0131cfce");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "40c0963e-f7a7-4bcd-af1a-e9ddcdb13a76");
        }
    }
}
