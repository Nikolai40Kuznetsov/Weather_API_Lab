const url = "https://api.weatherbit.io/v2.0/"
let input = document.getElementById("input")
let cities = document.getElementById("container-city")
const show = document.getElementById("show")
fetch(url)
.then (response => response.json())
.then(data => {
    cities_data.push(...data)
    return cities_data
})
.catch (error => error)
function Show_Weather() {
    input.
}