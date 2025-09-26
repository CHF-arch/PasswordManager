using Microsoft.EntityFrameworkCore;
using PasswordManager.Api.Data;
using Microsoft.OpenApi.Models;
using PasswordManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IPasswordManagerService, PasswordManagerService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();


if (app.Environment.IsDevelopment()){
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();