document.addEventListener('DOMContentLoaded', function () {
    // Global Variables
    let isSubmitted = false;
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");

    // Update Slider Value Display
    const qualitySlider = document.getElementById('qualitySlider');
    console.log("Slider element:", qualitySlider); // Debugging statement

    if (qualitySlider) {
        qualitySlider.addEventListener('input', function () {
            console.log("Slider value changed:", this.value); // Debugging statement
            document.getElementById('qualityValue').textContent = this.value;
        });
    } else {
        console.error("Slider element (#qualitySlider) not found!");
    }

    // Modify the Submit Button Logic
    document.getElementById('submitbtn').onclick = function () {
        console.log("Submit button clicked!"); // Debugging statement
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

    // Function to update the DOM when step 1 is complete
    function onclickChanges(firstMsg, step) {
        step.innerHTML = "";
        let img = document.createElement("img");
        img.src = "done_icon3.png";
        img.id = "doneImg";
        step.appendChild(img);
        var br = document.createElement("br");
        step.appendChild(br);
        let msg = document.createElement("span");
        msg.className = "text2";
        msg.innerHTML = firstMsg;
        step.appendChild(msg);
    }

    // Function to update the DOM when step 2 is complete
    function onclickChanges2(secMsg, word) {
        decodeBtn.disabled = true;
        encodeBtn.disabled = true;
        step3.innerHTML = "";
        let msg2 = document.createElement("span");
        msg2.className = "text2";
        msg2.innerHTML = secMsg;
        step3.appendChild(msg2);
        let msg3 = document.createElement("span");
        msg3.className = "text2";
        msg3.innerHTML = " , " + word + " file will be downloaded automatically!";
        step3.appendChild(msg3);
    }

    // Function to download the file
    function myDownloadFile(fileName, text) {
        let a = document.createElement('a');
        a.href = "data:application/octet-stream," + encodeURIComponent(text);
        a.download = fileName;
        a.click();
    }

    // Function to update the DOM when the file is downloaded
    function ondownloadChanges(outputMsg) {
        step3.innerHTML = "";
        let img = document.createElement("img");
        img.src = "done_icon3.png";
        img.id = "doneImg";
        step3.appendChild(img);
        var br = document.createElement("br");
        step3.appendChild(br);
        let msg3 = document.createElement("span");
        msg3.className = "text2";
        msg3.innerHTML = outputMsg;
        step3.appendChild(msg3);
    }

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
});
