using Microsoft.AspNetCore.Mvc;
using PasswordManager.Api.Models;
using PasswordManager.Api.Services;

namespace PasswordManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PasswordEntriesController : ControllerBase
{
    private readonly IPasswordManagerService _passwordManagerService;

    public PasswordEntriesController(IPasswordManagerService passwordManagerService)
    {
        _passwordManagerService = passwordManagerService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetPasswordEntries()
    {
        var entries = await _passwordManagerService.GetAllPasswordEntriesAsync();
        var result = new List<object>();
        
        foreach (var entry in entries)
        {
            result.Add(new
            {
                Id = entry.Id,
                Website = entry.Website,
                Username = entry.Username,
                // Don't send the encrypted password to the client
                CreatedAt = entry.CreatedAt
            });
        }
        
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetPasswordEntry(int id)
    {
        var entry = await _passwordManagerService.GetPasswordEntryByIdAsync(id);
        if (entry == null)
            return NotFound();
            
        var decryptedPassword = await _passwordManagerService.DecryptPasswordAsync(entry.Password);
        
        return Ok(new
        {
            Id = entry.Id,
            Website = entry.Website,
            Username = entry.Username,
            Password = decryptedPassword, // Only decrypt when specifically requested
            CreatedAt = entry.CreatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<PasswordEntry>> CreatePasswordEntry([FromBody] CreatePasswordEntryRequest request)
    {
        var createdEntry = await _passwordManagerService.CreatePasswordEntryAsync(
            request.Website, request.Username, request.Password);
        return CreatedAtAction(nameof(GetPasswordEntry), new { id = createdEntry.Id }, createdEntry);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PasswordEntry>> UpdatePasswordEntry(int id, [FromBody] UpdatePasswordEntryRequest request)
    {
        var updatedEntry = await _passwordManagerService.UpdatePasswordEntryAsync(
            id, request.Website, request.Username, request.Password);
        if (updatedEntry == null)
            return NotFound();
        return Ok(updatedEntry);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePasswordEntry(int id)
    {
        var result = await _passwordManagerService.DeletePasswordEntryAsync(id);
        if (!result)
            return NotFound();
        return NoContent();
    }
}

public class CreatePasswordEntryRequest
{
    public required string Website { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
}

public class UpdatePasswordEntryRequest
{
    public required string Website { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
}