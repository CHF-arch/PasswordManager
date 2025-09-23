import styles from "../styles/EditModal.module.css";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useState } from "react";
import { decryptData } from "../utils/encryption";

export default function EditModal({ passwordData, onClose, onSave }) {
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedData = {
      ...passwordData,
      website: formData.get("website"),
      username: formData.get("username"),
      password: formData.get("password"),
    };
    onSave(updatedData);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Edit Password</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Website:</label>
          <input
            type="text"
            name="website"
            defaultValue={passwordData.website}
            className={styles.input}
            required
          />
          <label className={styles.label}>Username:</label>
          <input
            type="text"
            name="username"
            defaultValue={passwordData.username}
            className={styles.input}
            required
          />
          <label className={styles.label}>Password:</label>
          {showPassword ? (
            <div className={styles.passwordContainer}>
              <input
                type="text"
                name="password"
                defaultValue={decryptData(passwordData.password)}
                className={styles.input}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(false)}
              >
                <FaEyeSlash className={styles.eyeIcon} />
              </button>
            </div>
          ) : (
            <div className={styles.passwordContainer}>
              <input
                type="password"
                name="password"
                defaultValue={decryptData(passwordData.password)}
                className={styles.input}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(true)}
              >
                <FaEye className={styles.eyeIcon} />
              </button>
            </div>
          )}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
