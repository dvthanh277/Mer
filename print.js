function printDiv() {
  // Get the div element you want to print
  var divToPrint = document.getElementById("printBill");

  // Create a print job
  var printJob = {
    printer: "InHoaDon",
    data: divToPrint.innerHTML,
  };

  // Send the print job to QZ Tray
  qz.print(printJob);
}
