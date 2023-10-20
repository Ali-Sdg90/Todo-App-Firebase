const urlDecoder = (encryptedUrl) => {
    const hourNumber = encryptedUrl.slice(0, 2);

    let decryptedEmail = "";

    for (
        let i = 2;
        i < decodeURIComponent(decodeURIComponent(encryptedUrl)).length;
        i++
    ) {
        decryptedEmail += String.fromCharCode(
            decodeURIComponent(decodeURIComponent(encryptedUrl))
                .charAt(i)
                .charCodeAt(0) - hourNumber
        );
    }

    return decryptedEmail;
};