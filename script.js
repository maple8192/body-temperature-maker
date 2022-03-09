"use strict"

document.addEventListener("DOMContentLoaded", () => {
    let date = new Date();

    document.getElementById("month").value = date.getMonth() + 1;
    document.getElementById("date").value = date.getDate();

    document.getElementById("seed").value = Math.floor(Math.random() * (65536 - 2) + 1);

    document.getElementById("make").addEventListener("click", () => {
        document.getElementById("result-month").innerText = document.getElementById("month").value;
        document.getElementById("result-date").innerText = document.getElementById("date").value;

        let x, y;
        let random = new Random(parseInt(document.getElementById("seed").value) % 65536)
        let result;
        do {
            for (let i = 0; i < parseInt(document.getElementById("month").value) * parseInt(document.getElementById("date").value); i++) {
                x = random.next() % 65536;
                y = random.next() % 65536;
            }
            result = Math.sqrt(-2 * Math.log(x / 65536)) * Math.cos(2 * 3.141592 * (y / 65536));
            result *= parseFloat(document.getElementById("deviation").value);
            result += parseFloat(document.getElementById("average").value);
        } while (result < parseFloat(document.getElementById("min").value) || result > parseFloat(document.getElementById("max").value));
        document.getElementById("result-value").innerText = result.toFixed(1);

        document.getElementById("result-lead").className = "result-lead result-deactivated";
        document.getElementById("result").className = "result-deactivated";

        setTimeout(() => {
            document.getElementById("result-lead").className = "result-lead result-activated";
            document.getElementById("result").className = "result-activated";
        }, 50);
    });
});

class Random {
    constructor(seed) {
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        this.w = seed;
    }

    next() {
        const t = this.x ^ (this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;
        return Math.abs(this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)));
    }
}