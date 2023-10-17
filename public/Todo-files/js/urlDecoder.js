const urlDecoder = (encryptedUrl) => {
    const now = new Date();
    const hourNumber = now.getHours();

    let decryptedEmail = "";

    for (
        let i = 0;
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