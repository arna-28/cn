/// Run-Length Encoding (RLE) function
function runLengthEncode(data) {
	let encodedData = "";
	let count = 1;

	for (let i = 0; i < data.length; i++) {
		if (data[i] === data[i + 1]) {
			count++;
		} else {
			encodedData += data[i] + count.toString();
			count = 1;
		}
	}
	return encodedData;
}

/// Run-Length Decoding (RLE) function
function runLengthDecode(encodedData) {
	let decodedData = "";
	for (let i = 0; i < encodedData.length; i += 2) {
		let char = encodedData[i];
		let count = parseInt(encodedData[i + 1]);
		decodedData += char.repeat(count);
	}
	return decodedData;
}

/// Updated Codec class to integrate RLE with Huffman Compression
class Codec {
	// ... (existing Huffman code methods remain the same)

	/// encoder function with RLE
	encode(data) {
		// Step 1: Apply Run-Length Encoding
		let rleEncodedData = runLengthEncode(data);

		// Step 2: Apply Huffman Compression
		this.heap = new MinHeap();

		var mp = new Map();
		for (let i = 0; i < rleEncodedData.length; i++) {
			if (mp.has(rleEncodedData[i])) {
				let foo = mp.get(rleEncodedData[i]);
				mp.set(rleEncodedData[i], foo + 1);
			} else {
				mp.set(rleEncodedData[i], 1);
			}
		}

		// ... (rest of the Huffman encoding logic remains the same)
	}

	/// decoder function with RLE
	decode(data) {
		// Step 1: Decode Huffman Compression
		let huffmanDecodedData = this.huffmanDecode(data); // Assume this method exists and decodes Huffman

		// Step 2: Decode Run-Length Encoding
		let finalDecodedData = runLengthDecode(huffmanDecodedData);

		return finalDecodedData;
	}
}

/// Example Usage
let codecObj = new Codec();

// Encoding
let originalData = "AAAABBBCCDAA";
let [encodedString, outputMsg] = codecObj.encode(originalData);
console.log("Encoded String:", encodedString);
console.log(outputMsg);

// Decoding
let [decodedString, outputMsg2] = codecObj.decode(encodedString);
console.log("Decoded String:", decodedString);
console.log(outputMsg2);
