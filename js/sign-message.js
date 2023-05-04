/*
 * JavaScript client-side example using jsrsasign
 */

// #########################################################
// #             WARNING   WARNING   WARNING               #
// #########################################################
// #                                                       #
// # This file is intended for demonstration purposes      #
// # only.                                                 #
// #                                                       #
// # It is the SOLE responsibility of YOU, the programmer  #
// # to prevent against unauthorized access to any signing #
// # functions.                                            #
// #                                                       #
// # Organizations that do not protect against un-         #
// # authorized signing will be black-listed to prevent    #
// # software piracy.                                      #
// #                                                       #
// # -QZ Industries, LLC                                   #
// #                                                       #
// #########################################################

/**
 * Depends:
 *     - jsrsasign-latest-all-min.js
 *     - qz-tray.js
 *
 * Steps:
 *
 *     1. Include jsrsasign 8.0.4 into your web page
 *        <script src="https://cdn.rawgit.com/kjur/jsrsasign/c057d3447b194fa0a3fdcea110579454898e093d/jsrsasign-all-min.js"></script>
 *
 *     2. Update the privateKey below with contents from private-key.pem
 *
 *     3. Include this script into your web page
 *        <script src="path/to/sign-message.js"></script>
 *
 *     4. Remove or comment out any other references to "setSignaturePromise"
 */
var privateKey = "-----BEGIN PRIVATE KEY-----\n" +
    "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyrG42W+dNgpCT\n" +
    "q/aaH/rdOwfCM30xC5LR89n/VvKRXHrZw+Liijy4VQ0W6XvFlj/aglUSvlYhvBgE\n" +
    "k5cltEyfRssiqeAJO1dA1LOY8KscmvDe5SbDI38/jy0wdLxMsPa4KkM/EpoqUFbP\n" +
    "gTzWoTgW89bcXo/uyNVxRSMhIpZnZc51a3CGOTxGOjOR8Y9BVMay0iKrExWLMGtv\n" +
    "jItjbQ47aTJLizbb66w9NhlboTV/R++EGRE9Towa7oyff8HhLO3NOSfLEd+UbANG\n" +
    "1kxjM0mlI0H2I5x9j8lc8E59lf8mJ3Rp496ubXvQNs9MsA5qv5dRRewParldTfB6\n" +
    "R6g/4ZHZAgMBAAECggEAGyna0ZnURvToHQNCSPk+rt6YFd61FD1Bs3iitk6WLyJD\n" +
    "rRK6Th2dEJshk8+oWQg4KfSxkVlth9BsSFnV204XbgmZvWndHRov8DPGICTKpt0p\n" +
    "bIGjDHy7jkKqqJi+vdwTjjkioxalaHRxVje8M5csC1VD35niwPc4d/F+Xz2+ZvaS\n" +
    "RxuvWsVx5H/tkhg+/FFUSgYooVds7ykXbPkj6wlCH4CvgoFP7zkkw2Tg0VBmJt4O\n" +
    "KCrMI+EtseIAh22b9sVc/yK75FuPqZSdb5u9OLgxZLE+lSBK2IJkNrKlHjQkaWav\n" +
    "UKZXJ7axohnpivdNS+yuRULNtrwtLZd4fj3/ts+G2QKBgQDy9dFlVsytjBZ5sUVF\n" +
    "UtdvgbemNSNJwfqOTfp67xNoT34fP/x6ljKfC2Q3qkIcg+PvfJkTiOpq3zJxB2Eh\n" +
    "IWlGzi7evpbokXP3Z8FKJ8pYgMBED6z//68cCVgzogcOgCTP1EM8Z+yUA9LAmCNO\n" +
    "ijnEXuzNlelugcErLl7NPv91LQKBgQC8Q1aCL+eP8vC1ksYvoeNrU5/YhYF1uPIR\n" +
    "i3c+JXc6/Xwg2cSAUKQFgt4EOGmU3t1+FxJSc3e04Y6yQGJ5oiTOdkDe/syyQFtq\n" +
    "qbLgLQ/o/MAf7BFaUo1E8XkmDRolXvo1tQwGrCbqu5YAoNIq2Oe2WdqGw8NNTfKX\n" +
    "zNqilbVS3QKBgEvYl2zmYvEOmXmV8IUKrnx950H4trJw3vILv9Uey1U18653wC7Y\n" +
    "sqbZ3IhQG2FhfwelQvhJNrz0Pn/wiM7Z6k6TUShyIRQrTCOA/WNT9qQYVW0p45zr\n" +
    "SdQbyrAbtc4+DL/giLjTzJQMeX9sPyFmn1ABPjWTxhKcaRw81pWGRCNlAoGAcN2F\n" +
    "7YK+tqQU/yZBPqk1aFC4EdzoIiWAqlgMYuufMXRqiF9F2Q9/ZfZxF+KiGagK7d7z\n" +
    "Ew86gux+2gqTfwxgOI7YkVf8bBj9NVMLdC5PzYRJwlmKhbXcD6sc0F0mgaURKEWk\n" +
    "MhPfOPbBFRtVJG7pa38u7YBLg/rpJ2ye3r4V+NkCgYEAsnv7SSOO9AWx4GmwfkF5\n" +
    "lk7EuHdYUFyQL35dwndSG4eEeQoyAs9CJPYkznrlpmLk+j2Frc1PSL1GE/A6QLlY\n" +
    "KFvWNiktipGT2U2dJMV7lZd5AIp9ZfCNVXpY8wExKKYJxhMzMtJlAsmyF+5Znyqv\n" +
    "MWuru8XkUfuB1+XXxaZBY8o=\n" +
    "-----END PRIVATE KEY-----"

qz.security.setSignatureAlgorithm("SHA512"); // Since 2.1
qz.security.setSignaturePromise(function (toSign) {
    return function (resolve, reject) {
        try {
            var pk = KEYUTIL.getKey(privateKey);
            var sig = new KJUR.crypto.Signature({ "alg": "SHA512withRSA" });  // Use "SHA1withRSA" for QZ Tray 2.0 and older
            sig.init(pk);
            sig.updateString(toSign);
            var hex = sig.sign();
            console.log("DEBUG: \n\n" + stob64(hextorstr(hex)));
            resolve(stob64(hextorstr(hex)));
        } catch (err) {
            console.error(err);
            reject(err);
        }
    };
});
