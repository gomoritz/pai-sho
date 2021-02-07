export function verifyBrowser() {
    const isChrome = navigator.userAgent.indexOf("Chrome/") != -1
    const isChromium = navigator.userAgent.indexOf("Chromium/") != -1
    const valid = isChrome || isChromium

    if (valid) {
        console.log("> Browser fully supports Pai Sho")
    } else {
        console.warn("> Pai Sho isn't fully supported by this browser!")
        // @ts-ignore
        Swal.fire({
            icon: "warning",
            title: "Achtung!",
            html: "Dein Browser bietet nicht die optimale Erfahrung beim Spielen von Pai Sho. " +
                "Wir empfehlen die Verwendung von <b>Chrome</b> oder eines <b>Chromium-basierten</b> Browsers, wie " +
                "z.B. <b>Opera oder Microsoft Edge</b>."
        })
    }
}