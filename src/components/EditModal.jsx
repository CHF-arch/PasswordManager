import styles from "../styles/EditModal.module.css";
import { useEffect, useRef, useState } from "react";
import {
  getPasswordEntryById,
  revealPassword,
  updatePassword,
} from "../Services/PasswordEntries";
import { FaEyeSlash, FaEye } from "react-icons/fa";

export default function EditModal({ id, onClose, onSaved }) {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ website: "", username: "", password: "" });
  const loaded = useRef(false); // ← guard

  useEffect(() => {
    if (loaded.current) return; // prevents the second run in dev
    loaded.current = true;

    (async () => {
      try {
        const [meta, plain] = await Promise.all([
          getPasswordEntryById(id),
          revealPassword(id),
        ]);
        setForm({
          website: meta.website,
          username: meta.username,
          password: plain,
        });
      } catch (e) {
        console.error("Failed to load for edit:", e);
        onClose();
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updatePassword(
      id,
      form.website,
      form.username,
      form.password
    );
    onSaved(updated);
  };

  if (loading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Edit Password</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Website:</label>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <label className={styles.label}>Username:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className={styles.input}
            required
          />

          <label className={styles.label}>Password:</label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                <FaEyeSlash className={styles.eyeIcon} />
              ) : (
                <FaEye className={styles.eyeIcon} />
              )}
            </button>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => {
                setForm({ website: "", username: "", password: "" });
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
