import styles from "../styles/Create.module.css";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../utils/encryption";
import { toast } from "react-toastify";

export default function Create() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const website = formData.get("website");

    const encryptedPassword = await encryptData(formData.get("password"));

    const password = {
      id: Date.now(),
      website: website,
      username: formData.get("username"),
      password: encryptedPassword,
      createdAt: new Date().toISOString(),
    };

    const existingPasswords = JSON.parse(
      localStorage.getItem("passwords") || "[]"
    );

    localStorage.setItem(
      "passwords",
      JSON.stringify([...existingPasswords, password])
    );

    // Store the success message in sessionStorage to show it on the homepage
    sessionStorage.setItem("passwordCreated", website);

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
