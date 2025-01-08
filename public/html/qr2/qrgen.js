$(document).ready(function() {
    $('#qr-form').on('submit', function(event) {
        event.preventDefault(); 
        var text = $('#text').val();
        $('#qrcode').empty(); 
        
        $('#qrcode').qrcode({
            text: text,
            width: 200,
            height: 200
        });
    });
});

$('#save-button').on('click', function() {
var canvas = $('#qrcode canvas')[0];
var dataURL = canvas.toDataURL('image/png');
var text = $('#text').val();
fetch('/save-qr-code', {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({ index: text, image: dataURL })
})
.then(response => {
if (!response.ok) {
    return response.text().then(text => { throw new Error(text); });
}
return response.json();
})
.then(data => {
console.log(data.message);
})
.catch(error => {
console.error('Error:', error);
});});