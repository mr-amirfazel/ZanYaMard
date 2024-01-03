const name_input = document.getElementById('nameInput');
const [save_button, submit_button, clear_button] = document.querySelectorAll('button')
const [female_radio, male_radio] = document.querySelectorAll("input[type=radio]")

const prediction_container = document.getElementsByClassName('prediction_value')[0]
const error_container = document.getElementsByClassName("error")[0]
const saved_container = document.getElementById('saved_container')
const loader = document.getElementsByClassName('loader')[0]

let name_value = name_input.getAttribute("value")


console.log(name_input, save_button, submit_button, clear_button, male_radio, female_radio);

const init = () => {
    clear_button.disabled = true
    name_input.setAttribute("value", "");
    prediction_container.innerHTML = "";
    error_container.innerHTML = "";
    saved_container.innerHTML = "";
    loader.classList.toggle("hide");
}

const store_data = (key, value) => {
    window.localStorage.setItem(key, value)
}

const load_data = (key) => {
    return window.localStorage.getItem(key)
}

const remove_data = (key) => {
    window.localStorage.removeItem(key)
}

const fetch_data = () => {
    loader.classList.toggle('hide')
    fetch(`https://api.genderize.io/?name=${name_value}`)
        .then(data => data.json())
        .then(res => {
            if (res.count != 0) {
                console.log(res);
                prediction_container.innerHTML = `<p> <strong>${name_value.charAt(0).toUpperCase() + name_value.slice(1)}</strong> is <span class = "prob">${Number(res.probability) * 100}%</span>  ${res.gender} </p>`
            } else {
                error_container.innerHTML = `the Name ${name_value} is not in my Database !!!!`
            }
        })
        .catch(err => error_container.innerHTML = err)
        .finally(() => {
            loader.classList.toggle('hide')
            name_input.value = ""
        })
}

const validate_data = (data) => {
    let data_name = data.trim()
    return data_name.length > 0
}

name_input.onchange = (e) => {
    name_value = e.target.value;
}

save_button.onclick = () => {
    console.log(male_radio, female_radio);
    console.log(male_radio.checked, female_radio.checked);
    let user_choice = ''
    if (male_radio.checked)
        user_choice = 'male'
    else
        user_choice = 'female'


    console.log(name_value, user_choice);
    store_data(name_value, user_choice)
}

submit_button.onclick = () => {
    prediction_container.innerHTML = "";
    error_container.innerHTML = "";
    saved_container.innerHTML = "";


    let saved_data = load_data(name_value)
    console.log('saved', saved_data, name_value);
    if (saved_data) {
        clear_button.disabled = false
        console.log(saved_container);
        saved_container.innerHTML = `<p>you gussed ${name_value} to be a <strong>${saved_data}</strong></p>`

    }
    fetch_data()



}

clear_button.onclick = () => {
    saved_container.innerHTML = `<p><strong>${name_value}</strong> removed from local storage`
    remove_data(name_value)
    clear_button.disabled = true
}

init();