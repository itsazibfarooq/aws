
const base = document.querySelector('#base');
const calculate = document.getElementById('calculate');
const power = document.getElementById('power');
const res = document.getElementById('res');

calculate.addEventListener('click', () => {
    // getResult(base.value, power.value);
    res.value = Math.pow(base.value, power.value);
});


var getResult = (base, power) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var payload = JSON.stringify({"base":base,"power":power});
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: payload,
        redirect: 'follow'
    };

    fetch("https://cndnheyapc.execute-api.us-east-2.amazonaws.com/dev", requestOptions)
    .then(response => response.text())
    .then(result =>  res.value = JSON.parse(JSON.parse(result).body).result)
    .catch(error => console.log('error', error));
}