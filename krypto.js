let salt = null;
let nonce = null;
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

const generateSalt = () => {
  salt = window.crypto.getRandomValues(new Uint32Array(10));
  localforage.setItem("salt", salt);
};

const generateNonce = () => {
  nonce = window.crypto.getRandomValues(new Uint32Array(10));
  document.getElementById("nonce").value = nonce;
  localforage.setItem("nonce", nonce);
  return nonce;
};

const onEncrypt = () => {
  const password = document.getElementById("password").value;
  const text2encrypt = document.getElementById("text2Encrypt").value;

  importingKey(password)
    .then((keyMaterial) => {
      return deriveKey(keyMaterial);
    })
    .then((derivedKey) => {
      // Encrypt
      nonce = generateNonce();
      let alg = { name: "AES-GCM", iv: nonce };
      return window.crypto.subtle.encrypt(
        alg,
        derivedKey,
        textEncoder.encode(text2encrypt)
      );
    })
    .then((crypted) => {
      document.getElementById("text2Decrypt").value = arrayBufferToString(
        crypted
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

const onDecrypt = () => {
  const password = document.getElementById("password").value;
  text2decrypt = stringToArrayBuffer(
    document.getElementById("text2Decrypt").value
  );

  importingKey(password)
    .then((keyMaterial) => {
      return deriveKey(keyMaterial);
    })
    .then((derivedKey) => {
      // Decrypt
      let alg = { name: "AES-GCM", iv: nonce };
      return window.crypto.subtle.decrypt(alg, derivedKey, text2decrypt);
    })
    .then((decrypted) => {
      document.getElementById("text2Encrypt").value = textDecoder.decode(
        decrypted
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

const importingKey = (password) => {
  return window.crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
};

const deriveKey = (keyMat) => {
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMat,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

const stringToArrayBuffer = (str) => {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

const arrayBufferToString = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

localforage.getItem("salt").then((value) => {
  if (!value) {
    generateSalt();
  } else {
    salt = value;
  }
  document.getElementById("salt").value = salt;
});

localforage.getItem("nonce").then((value) => {
  if (!value) return;
  nonce = value;
  document.getElementById("nonce").value = value;
});
