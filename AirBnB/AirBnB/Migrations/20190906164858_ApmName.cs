using Microsoft.EntityFrameworkCore.Migrations;

namespace AirBnB.Migrations
{
    public partial class ApmName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Apartments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Apartments");
        }
    }
}
