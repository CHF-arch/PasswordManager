import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";
import {
  deletePassword,
  getPasswordEntries,
} from "../Services/PasswordEntries";
import ConfirmModal from "./ConfirmModal";
import EditModal from "./EditModal";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function HomePage() {
  const [passwords, setPasswords] = useState([]);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [passwordToEdit, setPasswordToEdit] = useState(null);
  const [hoverEditButtons, setHoverEditButtons] = useState({});
  const [hoverDeleteButtons, setHoverDeleteButtons] = useState({});

  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    const load = async () => {
      try {
        const data = await getPasswordEntries();
        setPasswords(data);
      } catch (err) {
        console.error("Failed to load passwords:", err);
      }
    };
    load();
  }, []);

  const handleDelete = (id) => {
    setPasswordToDelete(id);
    setOpenConfirmModal(true);
  };
  const handleEdit = (id) => {
    setPasswordToEdit(id);
    setOpenEditModal(true);
  };
  const confirmDelete = async () => {
    if (!passwordToDelete) return;
    try {
      await deletePassword(passwordToDelete);
      setPasswords((prev) => prev.filter((p) => p.id !== passwordToDelete));
    } finally {
      setPasswordToDelete(null);
      setOpenConfirmModal(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Password Manager</h1>
        <Link to="/create" className={styles.addButton}>
          Add New Password
        </Link>
      </div>

      <div className={styles.passwordList}>
        {passwords.length === 0 ? (
          <p className={styles.noPasswords}>No passwords yet.</p>
        ) : (
          passwords.map((p) => (
            <div key={p.id} className={styles.passwordCard}>
              <div className={styles.passwordInfo}>
                <h3>{p.website}</h3>
                <p>Username: {p.username}</p>
                <p>Created: {new Date(p.createdAt).toLocaleString()}</p>
              </div>
              <div className={styles.buttonsDiv}>
                <button
                  onClick={() => handleDelete(p.id)}
                  className={`${styles.iconButton} ${
                    hoverDeleteButtons[p.id] ? styles.hover : ""
                  }`}
                  onMouseEnter={() =>
                    setHoverDeleteButtons((prev) => ({ ...prev, [p.id]: true }))
                  }
                  onMouseLeave={() =>
                    setHoverDeleteButtons((prev) => ({
                      ...prev,
                      [p.id]: false,
                    }))
                  }
                >
                  <span className={`${styles.text}`}>Delete</span>
                  <MdDelete className={`${styles.icon}`} />
                </button>

                <button
                  onClick={() => handleEdit(p.id)}
                  className={`${styles.iconButton} ${
                    hoverEditButtons[p.id] ? styles.hover : ""
                  }`}
                  onMouseEnter={() =>
                    setHoverEditButtons((prev) => ({ ...prev, [p.id]: true }))
                  }
                  onMouseLeave={() =>
                    setHoverEditButtons((prev) => ({ ...prev, [p.id]: false }))
                  }
                >
                  <span className={`${styles.text}`}>Edit</span>
                  <FaEdit className={`${styles.icon}`} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {openConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this password?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setPasswordToDelete(null);
            setOpenConfirmModal(false);
          }}
        />
      )}
      {openEditModal && (
        <EditModal
          id={passwordToEdit}
          onClose={() => {
            setPasswordToEdit(null);
            setOpenEditModal(false);
          }}
          onSaved={(updated) => {
            setPasswords((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            setPasswordToEdit(null);
            setOpenEditModal(false);
          }}
        />
      )}
    </div>
  );
}
