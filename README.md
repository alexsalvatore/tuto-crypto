# Tuto🥨Crypto

It's a small piece of code I made to illustrate on of my post on Web Crypto API.
Demo here: [salvatore.paris/tutocrypto/](https://salvatore.paris/tutocrypto/)

## Installation

Serve the project

```
npm run serve
```

## Special notes about format/types

I struggled a lot with types, using the Web Crypto API. Most methods don't take string parameters, but typed arrays. Here are the 2 main types + how encode and decode them into string.

### 1.Password & original text

You need can need 2 things to encrypt info, a text to encrypt and a password. To use them with the Web Crypto API, you need to convert them into a UInt8Array. To do this use a TextEncoder object.

```
const textEncoder = new TextEncoder();
textEncoder.encode(password)
```

If you use this, the decrypted cypher-text should also be a UInt8Array. To get back this Array into the original text format use the TextDecoder object.

```
window.crypto.subtle.decrypt(alg, derivedKey, text2decrypt).then((decrypted) => {
    const textDecoder = new TextDecoder();
    document.getElementById("text2Encrypt").value = textDecoder.decode(decrypted);
});
```

### 2.For cypher-text

The cypher-text will be a result of window.crypto.subtle.encrypt(). The returned value will be a buffer. To be able to transport and display it, you need to convert it to string. Use these methods:

```
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
```

## Author

Alexandre Salvatore [salvatore.paris](https://salvatore.paris/)
