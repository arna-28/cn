class MinHeap {
    constructor() {
        this.heap_array = [];
    }

    size() {
        return this.heap_array.length;
    }

    empty() {
        return (this.size() === 0);
    }

    push(value) {
        this.heap_array.push(value);
        this.up_heapify();
    }

    up_heapify() {
        var current_index = this.size() - 1;
        while (current_index > 0) {
            var current_element = this.heap_array[current_index];
            var parent_index = Math.trunc((current_index - 1) / 2);
            var parent_element = this.heap_array[parent_index];

            if (parent_element[0] < current_element[0]) {
                break;
            } else {
                this.heap_array[parent_index] = current_element;
                this.heap_array[current_index] = parent_element;
                current_index = parent_index;
            }
        }
    }

    top() {
        return this.heap_array[0];
    }

    pop() {
        if (this.empty() == false) {
            var last_index = this.size() - 1;
            this.heap_array[0] = this.heap_array[last_index];
            this.heap_array.pop();
            this.down_heapify();
        }
    }

    down_heapify() {
        var current_index = 0;
        var current_element = this.heap_array[0];
        while (current_index < this.size()) {
            var child_index1 = (current_index * 2) + 1;
            var child_index2 = (current_index * 2) + 2;
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
                var child_element1 = this.heap_array[child_index1];
                var child_element2 = this.heap_array[child_index2];
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

class Codec {
    encode(data) {
        this.heap = new MinHeap();

        var mp = new Map();
        for (let i = 0; i < data.length; i++) {
            if (mp.has(data[i])) {
                let foo = mp.get(data[i]);
                mp.set(data[i], foo + 1);
            } else {
                mp.set(data[i], 1);
            }
        }
        if (mp.size === 0) {
            let final_string = "zer#";

            let output_message = "Compression complete and file sent for download. " + '\n' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
            return [final_string, output_message];
        }

        if (mp.size === 1) {
            let key, value;
            for (let [k, v] of mp) {
                key = k;
                value = v;
            }
            let final_string = "one" + '#' + key + '#' + value.toString();
            let output_message = "Compression complete and file sent for download. " + '\n' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
            return [final_string, output_message];
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
        var huffman_tree = this.heap.top();
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
        for (let i = 0; i < binary_string.length;) {
            let curr_num = 0;
            for (let j = 0; j < 8; j++, i++) {
                curr_num *= 2;
                curr_num += binary_string[i] - '0';
            }
            encoded_data += String.fromCharCode(curr_num);
        }
        let tree_string = this.make_string(huffman_tree);
        let ts_length = tree_string.length;
        let final_string = ts_length.toString() + '#' + padding_length.toString() + '#' + tree_string + encoded_data;
        let output_message = "Compression complete and file sent for download. " + '\n' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
        return [final_string, output_message];
    }

    decode(data) {
        let k = 0;
        let temp = "";
        while (k < data.length && data[k] != '#') {
            temp += data[k];
            k++;
        }
        if (k == data.length) {
            alert("Invalid File!\nPlease submit a valid compressed .txt file to decompress and try again!");
            location.reload();
            return;
        }
        if (temp === "zer") {
            let decoded_data = "";
            let output_message = "Decompression complete and file sent for download.";
            return [decoded_data, output_message];
        }
        if (temp === "one") {
            data = data.slice(k + 1);
            k = 0;
            temp = "";
            while (data[k] != '#') {
                temp += data[k];
                k++;
            }
            let one_char = temp;
            data = data.slice(k + 1);
            let str_len = parseInt(data);
            let decoded_data = "";
            for (let i = 0; i < str_len; i++) {
                decoded_data += one_char;
            }
            let output_message = "Decompression complete and file sent for download.";
            return [decoded_data, output_message];

        }
        data = data.slice(k + 1);
        let ts_length = parseInt(temp);
        k = 0;
        temp = "";
        while (data[k] != '#') {
            temp += data[k];
            k++;
        }
        data = data.slice(k + 1);
        let padding_length = parseInt(temp);
        temp = "";
        for (k = 0; k < ts_length; k++) {
            temp += data[k];
        }
        data = data.slice(k);
        let tree_string = temp;
        temp = "";
        for (k = 0; k < data.length; k++) {
            temp +=
