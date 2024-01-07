/*
    getting input and buttons from dom
*/
const name_input = document.getElementById('nameInput');
const [save_button, submit_button, clear_button] = document.querySelectorAll('button')
const [female_radio, male_radio] = document.querySelectorAll("input[type=radio]")
/*
    getting elements to manipulate later from dom
*/
const prediction_container = document.getElementsByClassName('prediction_value')[0]
const error_container = document.getElementsByClassName("error")[0]
const saved_container = document.getElementById('saved_container')
const loader = document.getElementsByClassName('loader')[0]


//  defining var for input value
let name_value = name_input.getAttribute("value")



// setting default vlaues to some elements
const init = () => {
    clear_button.disabled = true
    name_input.setAttribute("value", "");
    prediction_container.innerHTML = "";
    error_container.innerHTML = "";
    saved_container.innerHTML = "";
    loader.classList.toggle("hide");
}

// stroing data in local storage
const store_data = (key, value) => {
    window.localStorage.setItem(key, value)
}

// getting data from local storage
const load_data = (key) => {
    return window.localStorage.getItem(key)
}

// removing data from local storage
const remove_data = (key) => {
    window.localStorage.removeItem(key)
}


// this function validates data being passed to api call
//  checking its:
//  - non-emptiness
//  - length (although its checked in html as well)
//  - regex conditions (although its checked in html as well)
const validate_data = () => {
    const isEmpty = name_value.trim() == "";

    const lencheck = name_value.length <= 255;

    const regexCheck = /[A-Za-z]+/.test(name_value)

    return !isEmpty && lencheck && regexCheck;
}


// fetching data from external api, handling different situations and showing appropriate data
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


//  updating the name value after every change on the input element value
name_input.onchange = (e) => {
    name_value = e.target.value;
}


// saving the name along with the users guess in local storage
save_button.onclick = () => {
    console.log(male_radio, female_radio);
    console.log(male_radio.checked, female_radio.checked);
    let user_choice = ''
    if (male_radio.checked)
        user_choice = 'male'
    else
        user_choice = 'female'
    store_data(name_value, user_choice)
}

// submit logic:
// - emptying message and input value
// - fetching request
// - showing users saved guess if available
submit_button.onclick = () => {
    prediction_container.innerHTML = "";
    error_container.innerHTML = "";
    saved_container.innerHTML = "";


    let saved_data = load_data(name_value)
    name_value = name_input.value
    if (validate_data())
        {
            fetch_data()
        }
    else
        {
        error_container.innerHTML = `please provide correct info`
        // name_value = ""
        return
    }
    if (saved_data) {
        clear_button.disabled = false
        saved_container.innerHTML = `<p>you gussed ${name_value} to be a <strong>${saved_data}</strong></p>`
    }
    
}


// removing users guess from local storage and giving the appropriate message
clear_button.onclick = () => {
    saved_container.innerHTML = `<p><strong>${name_value}</strong> removed from local storage`
    remove_data(name_value)
    clear_button.disabled = true
}


// calling the init function
init();