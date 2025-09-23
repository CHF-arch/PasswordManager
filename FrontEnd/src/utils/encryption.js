const createKey = async () => {
  const key = window.crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...key));
};

const getKey = async () => {
  const base64Key = import.meta.env.VITE_ENCRYPTION_KEY;

  if (!base64Key) {
    throw new Error("Encryption key not set in .env file.");
  }

  const keyData = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));

  return window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
};
export const encryptData = async (text) => {
  const key = await getKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedText = new TextEncoder().encode(text);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedText
  );

  const encryptedArray = new Uint8Array(encryptedData);
  const combinedArray = new Uint8Array(iv.length + encryptedArray.length);
  combinedArray.set(iv);
  combinedArray.set(encryptedArray, iv.length);

  return btoa(String.fromCharCode(...combinedArray));
};
export const decryptData = async (encryptedText) => {
  try {
    const key = await getKey();
    const encryptedArray = Uint8Array.from(atob(encryptedText), (c) =>
      c.charCodeAt(0)
    );

    const iv = encryptedArray.slice(0, 12);
    const data = encryptedArray.slice(12);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      data
    );

    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    return "*** Decryption Failed ***";
  }
};
