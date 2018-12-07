const buttoni = document.getElementById("buttoni")
const clear_button = document.getElementById("clear_button")
const list_display = document.getElementById("list_display")

const removeElement = (elementId) => {
    const elem = document.getElementById(elementId)
    const elemButton = document.getElementById(`${elementId}_delete_button`)
    elemButton.parentNode.removeChild(elemButton)
    elem.parentNode.removeChild(elem)
    alert("removed " + elementId)
    // return false
}

buttoni.addEventListener("click", () => {
    chrome.storage.sync.get(null, (results) => {
        const allKeys = Object.keys(results)
        // texti.innerHTML = allKeys.toString()
        for(let key in results) {
            const listItem = document.createElement("li")
            const deleteButton = document.createElement("button")

            deleteButton.className = "delete_button"
            deleteButton.textContent = "Delete"
            deleteButton.style.margin = "10px"
            deleteButton.setAttribute("id", `${key}_delete_button`)
            deleteButton.addEventListener("click", () => {
                chrome.storage.sync.remove(key, removeElement(key))
            })

            listItem.setAttribute("id", key)
            listItem.textContent = results[key].text
            listItem.appendChild(deleteButton)
            list_display.appendChild(listItem)
        }
        // list_display.innerHTML = JSON.stringify(results)
    })
})

clear_button.addEventListener("click", () => {
    chrome.storage.sync.clear(() => {
        const error = chrome.runtime.lastError
        if(error) {
            console.log(error)
        } else {
            list_display.innerHTML = ''
        }
    })
})
