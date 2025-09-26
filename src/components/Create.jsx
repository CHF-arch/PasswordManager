import styles from "../styles/Create.module.css";
import { useNavigate } from "react-router-dom";
import { createPassword } from "../Services/PasswordEntries";

export default function Create() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const website = formData.get("website");
    const username = formData.get("username");
    const plainPassword = formData.get("password");

    await createPassword(website, username, plainPassword);

    event.target.reset();
    navigate("/home");
  };

  return (
    <div className={styles.mainContainer}>
      <h2>Create New Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Website:</label>
        <input type="text" name="website" className={styles.input} required />
        <label className={styles.label}>Username:</label>
        <input type="text" name="username" className={styles.input} required />
        <label className={styles.label}>Password:</label>
        <input
          type="password"
          name="password"
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Save
        </button>
      </form>
    </div>
  );
}
