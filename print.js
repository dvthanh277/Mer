function printDiv() {
  // Get the div element you want to print
  var divToPrint = document.getElementById("printBill");

  qz.websocket.connect({ host: "192.168.2.8", usingSecure: false }).then(function () {
    console.log(qz.printers);
    return qz.printers.find("InHoaDon");              // Pass the printer name into the next Promise
  }).then(function (printer) {
    qz.security.setCertificatePromise(function (resolve, reject) {
      //Preferred method - from server
      //        fetch("assets/signing/digital-certificate.txt", {cache: 'no-store', headers: {'Content-Type': 'text/plain'}})
      //          .then(function(data) { data.ok ? resolve(data.text()) : reject(data.text()); });

      //Alternate method 1 - anonymous
      //        resolve();  // remove this line in live environment

      //Alternate method 2 - direct
      resolve("-----BEGIN CERTIFICATE-----\n" +
        "MIIECzCCAvOgAwIBAgIGAYfnsl0dMA0GCSqGSIb3DQEBCwUAMIGiMQswCQYDVQQG\n" +
        "EwJVUzELMAkGA1UECAwCTlkxEjAQBgNVBAcMCUNhbmFzdG90YTEbMBkGA1UECgwS\n" +
        "UVogSW5kdXN0cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMx\n" +
        "HDAaBgkqhkiG9w0BCQEWDXN1cHBvcnRAcXouaW8xGjAYBgNVBAMMEVFaIFRyYXkg\n" +
        "RGVtbyBDZXJ0MB4XDTIzMDUwMzE2NTcxOFoXDTQzMDUwMzE2NTcxOFowgaIxCzAJ\n" +
        "BgNVBAYTAlVTMQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYD\n" +
        "VQQKDBJRWiBJbmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMs\n" +
        "IExMQzEcMBoGCSqGSIb3DQEJARYNc3VwcG9ydEBxei5pbzEaMBgGA1UEAwwRUVog\n" +
        "VHJheSBEZW1vIENlcnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCy\n" +
        "rG42W+dNgpCTq/aaH/rdOwfCM30xC5LR89n/VvKRXHrZw+Liijy4VQ0W6XvFlj/a\n" +
        "glUSvlYhvBgEk5cltEyfRssiqeAJO1dA1LOY8KscmvDe5SbDI38/jy0wdLxMsPa4\n" +
        "KkM/EpoqUFbPgTzWoTgW89bcXo/uyNVxRSMhIpZnZc51a3CGOTxGOjOR8Y9BVMay\n" +
        "0iKrExWLMGtvjItjbQ47aTJLizbb66w9NhlboTV/R++EGRE9Towa7oyff8HhLO3N\n" +
        "OSfLEd+UbANG1kxjM0mlI0H2I5x9j8lc8E59lf8mJ3Rp496ubXvQNs9MsA5qv5dR\n" +
        "RewParldTfB6R6g/4ZHZAgMBAAGjRTBDMBIGA1UdEwEB/wQIMAYBAf8CAQEwDgYD\n" +
        "VR0PAQH/BAQDAgEGMB0GA1UdDgQWBBTrepaSd1dgK5lB3gpinNtbm7sPYTANBgkq\n" +
        "hkiG9w0BAQsFAAOCAQEADcc+Enr/D3VEBgxYa+s1WthQD8hHgrThRhnfSHYssrT9\n" +
        "B6qxAr4jX277nchn3/EBeM6HqG2T+htcpfRgpUEJU2crXw8wzzKvQzDT1YbfOo0m\n" +
        "ifc1/+fSjzoaOu28XtLiBMZ1BKK60Jm+pGVoce7B3TJ0aYKNVG9yWRzTZV1J/jsx\n" +
        "SJLG6ecYTkuynbn/0aPhr8mFkxP6+V4p4tnZRDZFoqxGTvnqPYlIWPaAlwbSbfYC\n" +
        "8/3rJZNXGbcF9AuWBNjF8uHiJ/macG1RAz/82D6ni6ZS7hTcgpxu/IykoS19DzOj\n" +
        "zAXE56kBJNlDoOCUndFpZouNQIE0+DMh02ClR1CVWQ==\n" +
        "-----END CERTIFICATE-----\n");
    });

    var config = qz.configs.create(printer);       // Create a default config for the found printer
    var data = [{
      type: 'pixel',
      format: 'html',
      flavor: 'plain', // or 'plain' if the data is raw HTML
      data: divToPrint.innerHTML
    }];
    return qz.print(config, data);
  }).catch(function (e) { console.error(e); });

}
