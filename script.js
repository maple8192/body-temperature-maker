"use strict"

const UINT_MAX = (2 ** 32) - 1;
const LOOP_MAX = 5000;

document.addEventListener("DOMContentLoaded", () => {
    // デフォルト値を設定
    let savedAverage = localStorage.getItem("average");
    document.getElementById("average").value = savedAverage == null ? "36.5" : savedAverage;
    let savedMin = localStorage.getItem("min");
    document.getElementById("min").value = savedMin == null ? "36.0" : savedMin;
    let savedMax = localStorage.getItem("max");
    document.getElementById("max").value = savedMax == null ? "36.9" : savedMax;
    let savedDeviation = localStorage.getItem("deviation");
    document.getElementById("deviation").value = savedDeviation == null ? "0.3" : savedDeviation;
    let savedSeed = localStorage.getItem("seed");
    document.getElementById("seed").value = savedSeed == null ? Math.floor(Math.random() * (UINT_MAX - 1) + 1) : savedSeed;

    let date = new Date();
    document.getElementById("month").value = date.getMonth() + 1;
    document.getElementById("date").value = date.getDate();

    // シード値再生成ボタンが押されたときの処理
    document.getElementById("seed-reset").addEventListener("click", () => {
        document.getElementById("seed").value = Math.floor(Math.random() * (UINT_MAX - 1) + 1);
    });

    // 生成ボタンが押されたときの処理
    document.getElementById("make").addEventListener("click", () => {
        // 入力が有効かのチェック
        let failed = false;
        if (document.getElementById("average").value !== parseFloat(document.getElementById("average").value).toFixed(1)) failed = true;
        if (document.getElementById("min").value !== parseFloat(document.getElementById("min").value).toFixed(1) || parseFloat(document.getElementById("min").value) > parseFloat(document.getElementById("average").value)) failed = true;
        if (document.getElementById("max").value !== parseFloat(document.getElementById("max").value).toFixed(1) || parseFloat(document.getElementById("max").value) < parseFloat(document.getElementById("average").value)) failed = true;
        if (document.getElementById("month").value !== parseInt(document.getElementById("month").value).toString() || parseInt(document.getElementById("month").value) <= 0) failed = true;
        if (document.getElementById("date").value !== parseInt(document.getElementById("date").value).toString() || parseInt(document.getElementById("date").value) <= 0) failed = true;
        if (document.getElementById("seed").value !== parseInt(document.getElementById("seed").value).toString() || parseInt(document.getElementById("seed").value) <= 0) failed = true;
        if (document.getElementById("deviation").value !== parseFloat(document.getElementById("deviation").value).toFixed(1) || parseFloat(document.getElementById("deviation").value) < 0) failed = true;
        if (failed) {
            alert("無効な入力があります。");
            return;
        }

        // 設定値を保存
        localStorage.setItem("average", document.getElementById("average").value);
        localStorage.setItem("min", document.getElementById("min").value);
        localStorage.setItem("max", document.getElementById("max").value);
        localStorage.setItem("seed", document.getElementById("seed").value);
        localStorage.setItem("deviation", document.getElementById("deviation").value);

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

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (document.activeElement.id === "") {
            document.getElementById("make").click();
        } else {
            document.getElementById(document.activeElement.id).blur();
        }
    }
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