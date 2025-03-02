/*
    Author : Samyak Jain
    Created on : 30 June 2020
*/

/// Min heap implementation
class MinHeap {
    constructor() {
        this.heap_array = [];
    }

    /// returns size of the min heap
    size() {
        return this.heap_array.length;
    }

    /// returns if the heap is empty
    empty() {
        return this.size() === 0;
    }

    /// insert a new value in the heap
    push(value) {
        this.heap_array.push(value);
        this.up_heapify();
    }

    /// updates heap by up heapifying
    up_heapify() {
        let current_index = this.size() - 1;
        while (current_index > 0) {
            let current_element = this.heap_array[current_index];
            let parent_index = Math.trunc((current_index - 1) / 2);
            let parent_element = this.heap_array[parent_index];

            if (parent_element[0] < current_element[0]) {
                break;
            } else {
                this.heap_array[parent_index] = current_element;
                this.heap_array[current_index] = parent_element;
                current_index = parent_index;
            }
        }
    }

    /// returns the top element (smallest value element)
    top() {
        return this.heap_array[0];
    }

    /// delete the top element
    pop() {
        if (!this.empty()) {
            let last_index = this.size() - 1;
            this.heap_array[0] = this.heap_array[last_index];
            this.heap_array.pop();
            this.down_heapify();
        }
    }

    /// updates heap by down heapifying
    down_heapify() {
        let current_index = 0;
        let current_element = this.heap_array[0];
        while (current_index < this.size()) {
            let child_index1 = current_index * 2 + 1;
            let child_index2 = current_index * 2 + 2;
            if (child_index1 >= this.size() && child_index2 >= this.size()) {
                break;
            } else if (child_index2 >= this.size()) {
                let child_element1 = this.heap_array[child_index1];
                if (current_element[0] < child_element1[0]) {
                    break;
                } else {
                    this.heap_array[child_index1] = current_element;
                    this.heap_array[current_index] = child_element1;
                    current_index = child_index1;
                }
            } else {
                let child_element1 = this.heap_array[child_index1];
                let child_element2 = this.heap_array[child_index2];
                if (current_element[0] < child_element1[0] && current_element[0] < child_element2[0]) {
                    break;
                } else {
                    if (child_element1[0] < child_element2[0]) {
                        this.heap_array[child_index1] = current_element;
                        this.heap_array[current_index] = child_element1;
                        current_index = child_index1;
                    } else {
                        this.heap_array[child_index2] = current_element;
                        this.heap_array[current_index] = child_element2;
                        current_index = child_index2;
                    }
                }
            }
        }
    }
}

/// Coder decoder class
class Codec {
    constructor() {
        this.codes = {};
    }

    /// Analyze file content and choose the best algorithm
    chooseBestAlgorithm(data) {
        // Check if the file has long repeated sequences (suitable for RLE)
        let maxRepeatLength = 0;
        let currentRepeatLength = 1;
        for (let i = 1; i < data.length; i++) {
            if (data[i] === data[i - 1]) {
                currentRepeatLength++;
                if (currentRepeatLength > maxRepeatLength) {
                    maxRepeatLength = currentRepeatLength;
                }
            } else {
                currentRepeatLength = 1;
            }
        }

        // If there are long repeated sequences, choose RLE
        if (maxRepeatLength >= 5) {
            return "rle";
        }

        // Check for pattern diversity (suitable for LZW)
        let uniqueChars = new Set(data);
        if (uniqueChars.size < data.length / 2) {
            return "lzw";
        }

        // Default to Huffman Coding
        return "huffman";
    }

    /// General encode function
    encode(data) {
        const algorithm = this.chooseBestAlgorithm(data);
        console.log(`Selected algorithm: ${algorithm}`);

        if (algorithm === "rle") {
            let encodedString = this.encodeRLE(data);
            let outputMessage = `Compression complete and file sent for download. \nCompression Ratio : ${(data.length / encodedString.length).toPrecision(6)}`;
            return [encodedString, outputMessage, algorithm];
        } else if (algorithm === "lzw") {
            let encodedString = this.encodeLZW(data);
            let outputMessage = `Compression complete and file sent for download. \nCompression Ratio : ${(data.length / encodedString.length).toPrecision(6)}`;
            return [encodedString, outputMessage, algorithm];
        } else {
            return [...this.encodeHuffman(data), algorithm];
        }
    }

    /// General decode function
    decode(data, algorithm) {
        if (algorithm === "rle") {
            let decodedString = this.decodeRLE(data);
            let outputMessage = "Decompression complete and file sent for download.";
            return [decodedString, outputMessage];
        } else if (algorithm === "lzw") {
            let decodedString = this.decodeLZW(data);
            let outputMessage = "Decompression complete and file sent for download.";
            return [decodedString, outputMessage];
        } else {
            return this.decodeHuffman(data);
        }
    }

    /// Huffman encoding
    encodeHuffman(data) {
        this.heap = new MinHeap();
        let mp = new Map();

        for (let i = 0; i < data.length; i++) {
            if (mp.has(data[i])) {
                mp.set(data[i], mp.get(data[i]) + 1);
            } else {
                mp.set(data[i], 1);
            }
        }

        if (mp.size === 0) {
            return ["zer#", "Compression complete and file sent for download. \nCompression Ratio : 0"];
        }

        if (mp.size === 1) {
            let key, value;
            for (let [k, v] of mp) {
                key = k;
                value = v;
            }
            return [`one#${key}#${value}`, "Compression complete and file sent for download. \nCompression Ratio : 1"];
        }

        for (let [key, value] of mp) {
            this.heap.push([value, key]);
        }

        while (this.heap.size() >= 2) {
            let min_node1 = this.heap.top();
            this.heap.pop();
            let min_node2 = this.heap.top();
            this.heap.pop();
            this.heap.push([min_node1[0] + min_node2[0], [min_node1, min_node2]]);
        }

        let huffman_tree = this.heap.top();
        this.heap.pop();
        this.codes = {};
        this.getCodes(huffman_tree, "");

        let binary_string = "";
        for (let i = 0; i < data.length; i++) {
            binary_string += this.codes[data[i]];
        }

        let padding_length = (8 - (binary_string.length % 8)) % 8;
        for (let i = 0; i < padding_length; i++) {
            binary_string += '0';
        }

        let encoded_data = "";
        for (let i = 0; i < binary_string.length; ) {
            let curr_num = 0;
            for (let j = 0; j < 8; j++, i++) {
                curr_num *= 2;
                curr_num += binary_string[i] - '0';
            }
            encoded_data += String.fromCharCode(curr_num);
        }

        let tree_string = this.make_string(huffman_tree);
        let ts_length = tree_string.length;
        let final_string = `${ts_length}#${padding_length}#${tree_string}${encoded_data}`;
        let output_message = `Compression complete and file sent for download. \nCompression Ratio : ${(data.length / final_string.length).toPrecision(6)}`;
        return [final_string, output_message];
    }

    /// Huffman decoding
    decodeHuffman(data) {
        if (data === "zer#") {
            return ["", "Decompression complete and file sent for download."];
        }

        if (data.startsWith("one#")) {
            let parts = data.split("#");
            let char = parts[1];
            let count = parseInt(parts[2]);
            return [char.repeat(count), "Decompression complete and file sent for download."];
        }

        let k = 0;
        let temp = "";
        while (k < data.length && data[k] !== '#') {
            temp += data[k];
            k++;
        }

        let ts_length = parseInt(temp);
        data = data.slice(k + 1);
        k = 0;
        temp = "";
        while (data[k] !== '#') {
            temp += data[k];
            k++;
        }

        let padding_length = parseInt(temp);
        data = data.slice(k + 1);
        let tree_string = data.slice(0, ts_length);
        let encoded_data = data.slice(ts_length);

        this.index = 0;
        let huffman_tree = this.make_tree(tree_string);

        let binary_string = "";
        for (let i = 0; i < encoded_data.length; i++) {
            let curr_num = encoded_data.charCodeAt(i);
            let curr_binary = "";
            for (let j = 7; j >= 0; j--) {
                curr_binary = (curr_num >> j) & 1 ? '1' : '0';
            }
            binary_string += curr_binary;
        }

        binary_string = binary_string.slice(0, -padding_length);

        let decoded_data = "";
        let node = huffman_tree;
        for (let i = 0; i < binary_string.length; i++) {
            if (binary_string[i] === '1') {
                node = node[1];
            } else {
                node = node[0];
            }

            if (typeof node[0] === "string") {
                decoded_data += node[0];
                node = huffman_tree;
            }
        }

        return [decoded_data, "Decompression complete and file sent for download."];
    }

    /// RLE encoding
    encodeRLE(data) {
        let encodedString = "";
        let count = 1;
        for (let i = 0; i < data.length; i++) {
            if (data[i] === data[i + 1]) {
                count++;
            } else {
                encodedString += count + data[i];
                count = 1;
            }
        }
        return encodedString;
    }

    /// RLE decoding
    decodeRLE(data) {
        let decodedString = "";
        let count = "";
        for (let i = 0; i < data.length; i++) {
            if (!isNaN(data[i])) {
                count += data[i];
            } else {
                decodedString += data[i].repeat(parseInt(count));
                count = "";
            }
        }
        return decodedString;
    }

    /// LZW encoding
    encodeLZW(data) {
        let dictionary = {};
        for (let i = 0; i < 256; i++) {
            dictionary[String.fromCharCode(i)] = i;
        }
        let currentString = "";
        let encodedData = [];
        for (let char of data) {
            let combinedString = currentString + char;
            if (dictionary.hasOwnProperty(combinedString)) {
                currentString = combinedString;
            } else {
                encodedData.push(dictionary[currentString]);
                dictionary[combinedString] = Object.keys(dictionary).length;
                currentString = char;
            }
        }
        if (currentString !== "") {
            encodedData.push(dictionary[currentString]);
        }
        return encodedData.join(",");
    }

    /// LZW decoding
    decodeLZW(data) {
        let dictionary = {};
        for (let i = 0; i < 256; i++) {
            dictionary[i] = String.fromCharCode(i);
        }
        let encodedData = data.split(",").map(Number);
        let currentCode = encodedData[0];
        let decodedString = dictionary[currentCode];
        let previousString = decodedString;
        for (let i = 1; i < encodedData.length; i++) {
            let currentCode = encodedData[i];
            let currentString;
            if (dictionary.hasOwnProperty(currentCode)) {
                currentString = dictionary[currentCode];
            } else {
                currentString = previousString + previousString[0];
            }
            decodedString += currentString;
            dictionary[Object.keys(dictionary).length] = previousString + currentString[0];
            previousString = currentString;
        }
        return decodedString;
    }
}

/// Event handlers and UI logic
window.onload = function () {
    console.log("here onload");

    // Accessing DOM elements
    const decodeBtn = document.getElementById("decode");
    const encodeBtn = document.getElementById("encode");
    const uploadFile = document.getElementById("uploadfile");
    const submitBtn = document.getElementById("submitbtn");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");

    let isSubmitted = false;
    const codecObj = new Codec();

    /// Called when submit button is clicked
    submitBtn.onclick = function () {
        const uploadedFile = uploadFile.files[0];
        if (!uploadedFile) {
            alert("No file uploaded. Please upload a valid .txt file and try again!");
            return;
        }
        const extension = uploadedFile.name.split('.').pop().toLowerCase();
        if (extension !== "txt") {
            alert(`Invalid file type (.${extension}). Please upload a valid .txt file and try again!`);
            return;
        }
        alert("File submitted!");
        isSubmitted = true;
        onclickChanges("Done!! File uploaded!", step1);
    };

    /// Called when compress button is clicked
    encodeBtn.onclick = function () {
        const uploadedFile = uploadFile.files[0];
        if (!uploadedFile) {
            alert("No file uploaded. Please upload a file and try again!");
            return;
        }
        if (!isSubmitted) {
            alert("File not submitted. Please click the submit button on the previous step to submit the file and try again!");
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            const text = fileLoadedEvent.target.result;
            const [encodedString, outputMsg, algorithm] = codecObj.encode(text);
            console.log(`Used algorithm: ${algorithm}`);
            myDownloadFile(uploadedFile.name.split('.')[0] + `_compressed_${algorithm}.txt`, encodedString);
            ondownloadChanges(outputMsg);
        };
        fileReader.readAsText(uploadedFile, "UTF-8");
    };

    /// Called when decompress button is clicked
    decodeBtn.onclick = function () {
        const uploadedFile = uploadFile.files[0];
        if (!uploadedFile) {
            alert("No file uploaded. Please upload a file and try again!");
            return;
        }
        if (!isSubmitted) {
            alert("File not submitted. Please click the submit button on the previous step to submit the file and try again!");
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            const text = fileLoadedEvent.target.result;
            // Extract algorithm from the filename
            const algorithm = uploadedFile.name.split('_').pop().split('.')[0];
            const [decodedString, outputMsg] = codecObj.decode(text, algorithm);
            myDownloadFile(uploadedFile.name.split('.')[0] + "_decompressed.txt", decodedString);
            ondownloadChanges(outputMsg);
        };
        fileReader.readAsText(uploadedFile, "UTF-8");
    };
};

/// Helper functions for UI updates
function onclickChanges(firstMsg, step) {
    step.innerHTML = "";
    const img = document.createElement("img");
    img.src = "done_icon3.png";
    img.id = "doneImg";
    step.appendChild(img);
    const br = document.createElement("br");
    step.appendChild(br);
    const msg = document.createElement("span");
    msg.className = "text2";
    msg.innerHTML = firstMsg;
    step.appendChild(msg);
}

function onclickChanges2(secMsg, word) {
    const decodeBtn = document.getElementById("decode");
    const encodeBtn = document.getElementById("encode");
    decodeBtn.disabled = true;
    encodeBtn.disabled = true;
    const step3 = document.getElementById("step3");
    step3.innerHTML = "";
    const msg2 = document.createElement("span");
    msg2.className = "text2";
    msg2.innerHTML = secMsg;
    step3.appendChild(msg2);
    const msg3 = document.createElement("span");
    msg3.className = "text2";
    msg3.innerHTML = `, ${word} file will be downloaded automatically!`;
    step3.appendChild(msg3);
}

/// Function to download file
function myDownloadFile(fileName, text) {
    const a = document.createElement('a');
    a.href = "data:application/octet-stream," + encodeURIComponent(text);
    a.download = fileName;
    a.click();
}

/// Changed DOM when file is downloaded (step 3 complete)
function ondownloadChanges(outputMsg) {
    const step3 = document.getElementById("step3");
    step3.innerHTML = "";
    const img = document.createElement("img");
    img.src = "done_icon3.png";
    img.id = "doneImg";
    step3.appendChild(img);
    const br = document.createElement("br");
    step3.appendChild(br);
    const msg3 = document.createElement("span");
    msg3.className = "text2";
    msg3.innerHTML = outputMsg;
    step3.appendChild(msg3);
}
