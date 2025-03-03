// MinHeap and Codec classes remain the same as before

// Image Compression Function
function compressImage(file, quality, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Compress the image
            canvas.toBlob(
                function (blob) {
                    callback(blob);
                },
                'image/jpeg', // Use 'image/png' for PNG files
                quality
            );
        };
    };
}

// Update Slider Value Display
document.getElementById('qualitySlider').addEventListener('input', function () {
    document.getElementById('qualityValue').textContent = this.value;
});

// Modify the Submit Button Logic
document.getElementById('submitbtn').onclick = function () {
    const uploadedFile = document.getElementById('uploadfile').files[0];
    if (uploadedFile === undefined) {
        alert("No file uploaded.\nPlease upload a valid file and try again!");
        return;
    }

    const extension = uploadedFile.name.split('.').pop().toLowerCase();
    if (extension === 'txt') {
        alert("File submitted!");
        isSubmitted = true;
        onclickChanges("Done!! File uploaded!", step1);
    } else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
        alert("Image file submitted!");
        isSubmitted = true;
        onclickChanges("Done!! Image uploaded!", step1);
        document.getElementById('imageCompressionOptions').style.display = 'block'; // Show the slider
    } else {
        alert("Invalid file type (." + extension + ") \nPlease upload a valid .txt, .jpg, or .png file and try again!");
    }
};

// Modify the Encode Button Logic
document.getElementById('encode').onclick = function () {
    const uploadedFile = document.getElementById('uploadfile').files[0];
    if (uploadedFile === undefined) {
        alert("No file uploaded.\nPlease upload a file and try again!");
        return;
    }
    if (isSubmitted === false) {
        alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
        return;
    }

    const extension = uploadedFile.name.split('.').pop().toLowerCase();
    if (extension === 'txt') {
        // Existing text compression logic
        onclickChanges("Done!! Your file will be Compressed", step2);
        onclickChanges2("Compressing your file ...", "Compressed");
        const fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            const text = fileLoadedEvent.target.result;
            const [encodedString, outputMsg] = codecObj.encode(text);
            myDownloadFile(uploadedFile.name.split('.')[0] + "_compressed.txt", encodedString);
            ondownloadChanges(outputMsg);
        };
        fileReader.readAsText(uploadedFile, "UTF-8");
    } else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
        // Image compression logic
        const quality = parseFloat(document.getElementById('qualitySlider').value);
        compressImage(uploadedFile, quality, function (compressedBlob) {
            const compressedFile = new File([compressedBlob], uploadedFile.name, {
                type: 'image/jpeg', // Use 'image/png' for PNG files
            });
            myDownloadFile(uploadedFile.name.split('.')[0] + "_compressed.jpg", compressedFile);
            ondownloadChanges("Image compression complete and file sent for download.");
        });
    }
};
