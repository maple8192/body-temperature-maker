"use strict"

const UINT_MAX = (2 ** 32) - 1;
const LOOP_MAX = 5000;

document.addEventListener("DOMContentLoaded", () => {
    let date = new Date();
    document.getElementById("month").value = date.getMonth() + 1;
    document.getElementById("date").value = date.getDate();

    document.getElementById("seed").value = Math.floor(Math.random() * (UINT_MAX - 1) + 1);

    document.getElementById("make").addEventListener("click", () => {
        // 体温生成
        let random = new Random(parseInt(document.getElementById("seed").value) % (UINT_MAX + 1));
        let loop = random.next();
        for (let i = 0; i < parseInt(document.getElementById("month").value); i++) random.next();
        loop += random.next();
        for (let i = 0; i < parseInt(document.getElementById("date").value); i++) random.next();
        loop += random.next();
        loop %= LOOP_MAX;
        for (let i = 0; i < loop; i++) random.next();
        let result;
        do {
            let x = random.next(), y = random.next();
            result = Math.sqrt(-2 * Math.log(x / UINT_MAX)) * Math.cos(2 * 3.141592 * (y / UINT_MAX));
            result *= parseFloat(document.getElementById("deviation").value);
            result += parseFloat(document.getElementById("average").value);
        } while (result < parseFloat(document.getElementById("min").value) || result >= (parseFloat(document.getElementById("max").value) + 0.1));
        document.getElementById("result-value").innerText = (Math.floor(result * 10) / 10).toFixed(1);

        // 結果表示の日付の部分
        document.getElementById("result-month").innerText = document.getElementById("month").value;
        document.getElementById("result-date").innerText = document.getElementById("date").value;

        // 表示
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
        this.x = Uint32Array.of(seed);
    }

    next() {
        this.x[0] = this.x[0] ^ (this.x[0] << 13);
        this.x[0] = this.x[0] ^ (this.x[0] >> 17);
        this.x[0] = this.x[0] ^ (this.x[0] << 5);
        return this.x[0];
    }
}