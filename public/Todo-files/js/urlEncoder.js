const urlEncoder = (email) => {
    let encryptedEmailAdrs = "";

    const now = new Date();
    const hourNumber = now.getHours();

    for (let i = 0; i < email.length; i++) {
        encryptedEmailAdrs += String.fromCharCode(
            email.charAt(i).charCodeAt(0) + hourNumber
        );
    }

    encryptedEmailAdrs = encodeURIComponent(
        encodeURIComponent(encryptedEmailAdrs)
    );

    // console.log(hourNumber.toString().padStart(2, "0"));

    return hourNumber.toString().padStart(2, "0") + encryptedEmailAdrs;
};