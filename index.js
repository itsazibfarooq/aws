
const base = document.querySelector('#base');
const calculate = document.getElementById('calculate');
const power = document.getElementById('power');
const res = document.getElementById('res');

calculate.addEventListener('click', () => {
    let number = base.value;
    let n = power.value;
    res.value = Math.pow(number, n);
});