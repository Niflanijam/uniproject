    
    const qrCodeScanner = new Html5Qrcode("qr-reader");
    
    document.getElementById('scan-button').addEventListener('click', () => {
qrCodeScanner.start(
    { facingMode: "environment" }, // Use rear camera
    {
        fps: 20,   
        qrbox: 350 
    },
    (decodedText, decodedResult) => {
        console.log(`Code matched = ${decodedText}`);
        // Update the status
        document.getElementById('status').textContent = `Scanned index: ${decodedText}`;
        
        fetch('/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index: decodedText })
        })
        .then(response => response.json())
        .then(data => {
            // Update the status with the server response
            document.getElementById('status').textContent = data.message;
            console.log(data.message); 
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('status').textContent = 'Error processing request.';
        });
        // Stop scanning after successful scan
        qrCodeScanner.stop().then(() => {
            console.log("QR Code scanning stopped.");
        }).catch(err => {
            console.error('Failed to stop scanning.', err);
        });
    },
    (errorMessage) => {
        console.error(`QR Code scanning error: ${errorMessage}`);
    }
).catch(err => {
    console.error(`Failed to start scanning. Error: ${err}`);
});});