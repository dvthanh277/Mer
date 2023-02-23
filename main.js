function printHTML() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://192.168.1.87:9100');

    // Thiết lập tiêu đề của yêu cầu in
    xhr.setRequestHeader('Content-Type', 'application/raw');

    // Chuyển đổi nội dung HTML sang định dạng RAW
    var rawContent = '<RAW>' + 'Hello' + '</RAW>';

    // Gửi yêu cầu in tới máy in
    xhr.send(rawContent);
}