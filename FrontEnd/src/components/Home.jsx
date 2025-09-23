import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";
import { decryptData } from "../utils/encryption";
import ConfirmModal from "./ConfirmModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import EditModal from "./EditModal";

export default function HomePage() {
  const [passwords, setPasswords] = useState([]);
  const [decryptedPasswords, setDecryptedPasswords] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState(null);
  const [passwordToEdit, setPasswordToEdit] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    const savedPasswords = JSON.parse(
      localStorage.getItem("passwords") || "[]"
    );
    setPasswords(savedPasswords);

    const website = sessionStorage.getItem("passwordCreated");
    if (website) {
      toast.success(`Password for ${website} saved successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setTimeout(() => {
        sessionStorage.removeItem("passwordCreated");
      }, 2000);
    }
  }, []);

  useEffect(() => {
    const decryptPasswords = async () => {
      const decrypted = {};
      for (const pwd of passwords) {
        try {
          decrypted[pwd.id] = await decryptData(pwd.password);
        } catch (error) {
          console.error("Failed to decrypt password:", error);
          decrypted[pwd.id] = "*** Failed to decrypt ***";
        }
      }
      setDecryptedPasswords(decrypted);
    };

    decryptPasswords();
  }, [passwords]);
  const showToastMessage = () => {
    toast.success("Your password has been deleted successfully!", {
      position: "top-right",
    });
  };

  const handleDelete = (id) => {
    setPasswordToDelete(id);
    setShowConfirmModal(true);
  };
  const handleEdit = (id) => {
    setPasswordToEdit(id);
    setShowEditModal(true);
  };

  const confirmDelete = () => {
    if (passwordToDelete) {
      const updatedPasswords = passwords.filter(
        (password) => password.id !== passwordToDelete
      );
      localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
      setPasswords(updatedPasswords);
      showToastMessage();
      setPasswordToDelete(null);
      setShowConfirmModal(false);
    }
  };
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
          <p className={styles.noPasswords}>
            No passwords saved yet. Click "Add New Password" to get started!
          </p>
        ) : (
          passwords.map((password) => (
            <div key={password.id} className={styles.passwordCard}>
              <div className={styles.passwordInfo}>
                <h3>{password.website}</h3>
                <p>Username: {password.username}</p>
                <div className={styles.passwordField}>
                  <span>Password: </span>
                  <span id={`password-${password.id}`}>
                    {visiblePasswords[password.id]
                      ? decryptedPasswords[password.id]
                      : "••••••••"}
                  </span>
                  <button
                    onClick={() => togglePasswordVisibility(password.id)}
                    className={styles.showButton}
                  >
                    {!visiblePasswords[password.id] ? (
                      <FaEye className={styles.eyeIcon} />
                    ) : (
                      <FaEyeSlash className={styles.eyeIcon} />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(password.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(password.id)}
                  className={styles.editButton}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this password?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setPasswordToDelete(null);
            setShowConfirmModal(false);
          }}
        />
      )}
      {showEditModal && (
        <EditModal
          passwordData={passwords.find((pwd) => pwd.id === passwordToEdit)}
          onSave={(updatedData) => {
            const updatedPasswords = passwords.map((pwd) =>
              pwd.id === updatedData.id ? updatedData : pwd
            );
            localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
            setPasswords(updatedPasswords);
            setShowEditModal(false);
            setPasswordToEdit(null);
            toast.success(`Password for ${updatedData.website} updated!`, {
              position: "top-right",
              autoClose: 3000,
            });
          }}
          onClose={() => {
            setPasswordToEdit(null);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}
