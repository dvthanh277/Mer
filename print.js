function printDiv() {
  // Get the div element you want to print
  var divToPrint = document.getElementById("printBill");


  qz.websocket.connect().then(function () {
    console.log(qz.printers);
    return qz.printers.find("InHoaDon");              // Pass the printer name into the next Promise
  }).then(function (printer) {
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
printDiv()