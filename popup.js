const buttoni = document.getElementById("buttoni")
const clear_button = document.getElementById("clear_button")
const list_display = document.getElementById("list_display")

const removeElement = (elementId) => {
    const elem = document.getElementById(elementId)
    elem.parentNode.removeChild(elem)
    alert("removed " + elementId)
    return false
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
            deleteButton.setAttribute("id", key)
            deleteButton.addEventListener("click", () => {
                chrome.storage.sync.remove(key, removeElement(key))
            })

            listItem.textContent = results[key]
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
