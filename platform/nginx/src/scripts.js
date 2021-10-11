
const BACKEND_URI = "http://localhost:8080/api/"
let access_token = ""

document.addEventListener("DOMContentLoaded", function () {

    showPage(location.pathname)

    document.body.addEventListener("click", function (event) {

        const clicked_element = event.target

        if (clicked_element.tagName == "A") {

            if (clicked_element.hostname == location.hostname) {

                event.preventDefault()
                const uri = clicked_element.getAttribute("href")

                if (location.pathname != uri) {
                    hideCurrentPage()
                    showPage(uri)

                    history.pushState({}, "", uri)
                }
            }
        }

        console.log(location.pathname)

        if (location.pathname == '/logout') {
            access_token = ''
            history.pushState({}, "", "/")
        }

    })

    document.getElementById("login-form").addEventListener("submit", async function (event) {

        event.preventDefault()

        const username = document.getElementById("username").value
        const password = document.getElementById("password").value

        // TODO: Can add client-side validation here.

        const data = {
            username,
            password,
            grant_type: "password"
        }

        const response = await fetch(BACKEND_URI + "login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(data)
        })
        const page = document.getElementById('login-page')
        switch (response.status) {

            case 200:

                const body = await response.json()

                access_token = body.access_token

                const uri = '/home'

                hideCurrentPage()
                showPage('/home')
                history.pushState({}, "", uri)

                document.body.classList.remove("is-logged-out")
                document.body.classList.add("is-logged-in")

                // TODO: Show feedback to the user (did the login succeed?).

                break
            case 400:
                const response_body = await response.json()

                const response_arr = Object.values(response_body)



                for (const item of response_arr) {
                    const column = document.createElement("div")
                    column.className = "column is-12 is-mobile is-multiline title"
                    column.id = "error"
                    column.innerText = [item]

                    page.appendChild(column)
                }

                break
            case 500:
                const column = document.createElement("div")
                column.className = "column is-12 is-mobile is-multiline title"
                column.id = "error"
                column.innerText = 'Something went wrong'

                page.appendChild(column)
                break
            default:

        }

    })

    document.getElementById("register-form").addEventListener("submit", async function (event) {

        event.preventDefault()

        const username = document.getElementById("username_r").value
        const password = document.getElementById("password_r").value
        const password_confirmation = document.getElementById("password_confirmation").value
        const first_name = document.getElementById("first_name").value
        const last_name = document.getElementById("last_name").value
        const phone_number = document.getElementById("phone_number").value
        const email_address = document.getElementById("email_address").value

        // TODO: Can add client-side validation here.

        const account = {
            username,
            password,
            password_confirmation,
            first_name,
            last_name,
            phone_number,
            email_address
        }

        const response = await fetch(BACKEND_URI + "register", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + access_token
            },
            body: new URLSearchParams(account)
        })

        const page_reg = document.getElementById('register-page')

        switch (response.status) {

            case 200:
                location.replace("/")

                break
            case 400:
                const response_body = await response.json()

                const response_arr = Object.values(response_body)

                for (const item of response_arr) {
                    const column = document.createElement("div")
                    column.className = "column is-12 is-mobile is-multiline title"
                    column.id = "error"
                    column.innerText = [item]

                    page_reg.appendChild(column)
                }

                break
            case 500:
                const column = document.createElement("div")
                column.className = "column is-12 is-mobile is-multiline title"
                column.id = "error"
                column.innerText = 'Something went wrong'

                page_reg.appendChild(column)
                break
            default:




        }

    })

    document.getElementById("make-reservation-form").addEventListener("submit", async function (event) {

        event.preventDefault()

        const table_id = document.getElementById("table_id").value
        const reservation_date = document.getElementById("reservation_date").value
        const reservation_time = document.getElementById("reservation_time").value
        // TODO: Can add client-side validation here.

        const reservation = {
            table_id,
            reservation_date,
            reservation_time
        }

        console.log(reservation)

        const response = await fetch(BACKEND_URI + "make-reservation", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + access_token
            },
            body: new URLSearchParams(reservation)
        })
        const page_make_res = document.getElementById('make-reservation-page')
        switch (response.status) {

            case 201:
                const uri = 'my-reservations'
                history.pushState({}, "", uri)
                hideCurrentPage()
                showPage(uri)
                break
            case 400:
                const response_body = await response.json()

                const response_arr = Object.values(response_body)

                for (const item of response_arr) {
                    const column = document.createElement("div")
                    column.className = "column is-12 is-mobile is-multiline title"
                    column.id = "error"
                    column.innerText = [item]

                    page_make_res.appendChild(column)
                }

                break
            case 500:
                const column = document.createElement("div")
                column.className = "column is-12 is-mobile is-multiline title"
                column.id = "error"
                column.innerText = 'Something went wrong'

                page_make_res.appendChild(column)
                break
            default:



            // TODO.
        }
    })



})



window.addEventListener("popstate", function (event) {
    const uri = location.pathname
    hideCurrentPage()
    showPage(uri)
})

function showPage(uri) {
    let pageToShow = ""
    switch (uri) {
        case "/":
            pageToShow = "login-page"
            break
        case "/register":
            pageToShow = "register-page"
            break
        case "/home":
            loadHome()
            pageToShow = "home-page"
            break
        case "/my-reservations":
            pageToShow = "my-reservations-page"
            loadAllReservations()
            break
        case "/make-reservation":
            pageToShow = "make-reservation-page"
            break
        case "/profile":
            pageToShow = "profile-page"
            loadProfile()
            break
        case "/logout":
            pageToShow = "login-page"
            break
        case "/unauthorized":
            pageToShow = "unauthorized-page"
            break
        default:
            pageToShow = "not-found-page"
    }

    document.getElementById(pageToShow).classList.add("current-page")
}

function hideCurrentPage() {
    document.querySelector(".current-page").classList.remove("current-page")
}

async function loadAllReservations() {

    const page = document.getElementById("my-reservations-page")
    page.innerText = ""

    const response = await fetch(BACKEND_URI + "my-reservations", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + access_token
        }
    })

    switch (response.status) {
        case 200:
            const reservations = await response.json()

            const reservations_array = Object.values(reservations)

            for (const reservation of reservations_array[0]) {
                const form = document.createElement("form")
                form.className = "columns is-centered is-desktop is-multiline"
                form.id = "cancel-reservation-form"
                form.addEventListener("submit", async function (event) {

                    event.preventDefault()

                    const reservation_id = reservation.reservation_id

                    console.log(reservation_id)
                    // TODO: Can add client-side validation here.


                    const response = await fetch(BACKEND_URI + "my-reservations/" + reservation_id, {
                        method: "DELETE",
                        headers: {
                            "Accept": "application/json",
                            "Content-type": "application/json",
                            "Authorization": "Bearer " + access_token
                        }
                    })

                    switch (response.status) {

                        case 204:
                            showPage("/my-reservations")

                            const success = document.createElement("div")
                            success.innerText = "Reservation canceled"
                            success.className = "columns is-centered is-desktop is-multiline has-text-centered subtitle"

                            page.appendChild(success)

                            // TODO: Show feedback to the user (did the login succeed?).

                            break
                        case 404:
                            const response_body = await response.json()

                            const response_arr = Object.values(response_body)

                            for (const item of response_arr) {
                                const column = document.createElement("div")
                                column.className = "column is-12 is-mobile is-multiline title"
                                column.id = "error"
                                column.innerText = [item]

                                page.appendChild(column)
                            }

                            break
                        case 500:
                            const column = document.createElement("div")
                            column.className = "column is-12 is-mobile is-multiline title"
                            column.id = "error"
                            column.innerText = 'Something went wrong'

                            page.appendChild(column)
                            break
                        default:



                        // TODO.

                    }

                })

                const box = document.createElement("div")
                box.className = "box"
                const columns = document.createElement("div")
                columns.className = "columns is-centered is-desktop is-multiline"

                Object.keys(reservation).forEach(element => {
                    if (element == "user_id") {
                        return
                    }
                    const item = document.createElement("div")
                    item.className = "column has-text-left is-5-desktop is-12-tablet"
                    const p = document.createElement('p')
                    p.innerText = valueTranslation([element]) + " : "

                    const label = document.createElement("label")
                    label.className = "label"
                    label.id = element
                    // valueTranslation([element]) + " : " + 
                    label.innerText = reservation[element]

                    p.appendChild(label)
                    item.appendChild(p)
                    columns.appendChild(item)
                })

                const column = document.createElement("div")
                column.className = "column level is-8-desktop is-12-tablet"

                const input = document.createElement("input")
                input.className = "button is-success"
                input.value = "Cancle Reservation"
                input.type = "submit"

                column.appendChild(input)
                columns.appendChild(column)

                box.appendChild(columns)
                form.appendChild(box)
                page.appendChild(form)
            }
            break
        case 404:

            const response_body = await response.json()

            const response_arr = Object.values(response_body)

            for (const item of response_arr) {
                const column = document.createElement("div")
                column.className = "column is-12 is-mobile is-multiline title"
                column.id = "error"
                column.innerText = [item]

                page_make_res.appendChild(column)
            }


            break
        case 401:
            history.pushState({}, "", "/unauthorized")
            hideCurrentPage()
            showPage("/unauthorized")
            break
        case 500:

            const column = document.createElement("div")
            column.className = "column is-12 is-mobile is-multiline title"
            column.id = "error"
            column.innerText = 'Something went wrong'

            page_make_res.appendChild(column)
            break

        default:
        //TODO
    }
}

async function loadHome() {

    const response = await fetch(BACKEND_URI + "home", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + access_token
        }
    })

    switch (response.status) {
        case 200:
            break
        case 401:
            history.pushState({}, "", "/unauthorized")
            hideCurrentPage()
            showPage("/unauthorized")
            break

        case 500:
            const column = document.createElement("div")
            column.className = "column is-12 is-mobile is-multiline title"
            column.id = "error"
            column.innerText = 'Something went wrong'

            page.appendChild(column)
            break
        default:
        //TODO
    }
}


async function loadProfile() {

    const page = document.getElementById("profile-page")
    page.innerText = ""

    const response = await fetch(BACKEND_URI + "profile", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "Bearer " + access_token
        }
    })

    switch (response.status) {
        case 200:
            const profile_obj = await response.json()

            const profile_array = Object.values(profile_obj)

            for (const profile of profile_array[0]) {
                const form = document.createElement("form")
                form.className = "columns is-centered is-desktop is-multiline"
                form.id = "update-profile-form"
                form.addEventListener("submit", async function (event) {

                    event.preventDefault()
                    console.log(location.hostname)

                    const first_name = document.getElementById("first_name_profile").value
                    const last_name = document.getElementById("last_name_profile").value
                    const phone_number = document.getElementById("phone_number_profile").value
                    const email_address = document.getElementById("email_address_profile").value
                    // TODO: Can add client-side validation here.
                    const profile_data = {
                        first_name,
                        last_name,
                        phone_number,
                        email_address
                    }

                    const response = await fetch(BACKEND_URI + "profile", {
                        method: "PUT",
                        headers: {
                            "Accept": "application/json",
                            "Content-type": "application/x-www-form-urlencoded",
                            "Authorization": "Bearer " + access_token
                        },
                        body: new URLSearchParams(profile_data)
                    })

                    switch (response.status) {

                        case 204:
                            //showPage("/profile-page")

                            const success = document.createElement("div")
                            success.innerText = "Profile Updated"
                            success.className = "columns is-centered is-desktop is-multiline has-text-centered subtitle"

                            page.appendChild(success)

                            // TODO: Show feedback to the user (did the login succeed?).

                            break
                        case 404:
                            const response_body = await response.json()

                            const response_arr = Object.values(response_body)

                            for (const item of response_arr) {
                                const column = document.createElement("div")
                                column.className = "column is-12 is-mobile is-multiline title"
                                column.id = "error"
                                column.innerText = [item]

                                page.appendChild(column)
                            }

                            break
                        case 500:
                            const column = document.createElement("div")
                            column.className = "column is-12 is-mobile is-multiline title"
                            column.id = "error"
                            column.innerText = 'Something went wrong'

                            page.appendChild(column)
                            break
                        default:

                        // TODO.

                    }

                })


                const box = document.createElement("div")
                box.className = "box"
                const columns = document.createElement("div")
                columns.className = "columns is-centered is-desktop is-multiline"

                Object.keys(profile).forEach(element => {
                    if (element == "user_id") {
                        return
                    }
                    const item = document.createElement("div")
                    item.className = "column has-text-left is-5-desktop is-12-tablet"
                    const label = document.createElement("label")
                    label.className = "label"

                    // valueTranslation([element]) + " : " + 
                    label.innerText = valueTranslation([element]) + " : " + profile[element]

                    const user_input = document.createElement("input")
                    user_input.className = "input"
                    user_input.id = element + "_profile"
                    user_input.value = profile[element]

                    item.appendChild(label)
                    item.appendChild(user_input)
                    columns.appendChild(item)
                })

                const column = document.createElement("div")
                column.className = "column level is-8-desktop is-12-tablet"

                const input = document.createElement("input")
                input.className = "button is-success"
                input.value = "Update profile"
                input.type = "submit"

                column.appendChild(input)
                columns.appendChild(column)

                box.appendChild(columns)
                form.appendChild(box)
                page.appendChild(form)
            }
            break
        case 404:
            const response_body = await response.json()

            const response_arr = Object.values(response_body)

            for (const item of response_arr) {
                const column = document.createElement("div")
                column.className = "column is-12 is-mobile is-multiline title"
                column.id = "error"
                column.innerText = [item]

                page.appendChild(column)
            }

            break

        case 401:
            history.pushState({}, "", "/unauthorized")
            hideCurrentPage()
            showPage("/unauthorized")
            break
        case 500:
            break
        default:
        //TODO
    }
}

function valueTranslation(value) {

    const valueTranslations = {
        username: "Username",
        user_id: "Users ID",
        reservation_id: "Reservation ID",
        first_name: "First name",
        last_name: "Last name",
        table_id: "Table ID",
        reservation_date: "Reservation date",
        phone_number: "Phone number",
        email_address: "Email Address",
        reservation_time: "Reservation time"
    }

    const valueTranslation = value.map(v => valueTranslations[v])
    console.log(valueTranslation)

    return valueTranslation
}
