namespace PasswordManager.Api.Models;

public class PasswordEntry
{
    public int Id { get; set; }
    public required string Website { get; set; }
    public required string Username { get; set; }
    public required byte[] Password { get; set; }
    public DateTime CreatedAt { get; set; }
}
