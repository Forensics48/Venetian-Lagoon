function uploadImage(image, fileName, directory) {
    var formdata = new FormData();
    formdata.append('image', image);
    $.ajax({
        url: '/uploads/uploadImage/',
        headers: {'filename': fileName, 'directory': directory},
        data: formdata,
        contentType: false,
        processData: false,
        type: 'POST',
        'success': function (data) {
            console.log(data);
        }
    }, 'json');
}