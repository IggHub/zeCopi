const texti = document.getElementById("texti")
const buttoni = document.getElementById("buttoni")
const clear_button = document.getElementById("clear_button")
// buttoni.addEventListener("click", () => {
//     chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT},(tab) => {
//         chrome.tabs.sendMessage(tab[0].id, {method: 'getSelection'}, (resp) => {
//             texti.innerHTML = resp.data
//         })
//     }) 
// })


buttoni.addEventListener("click", () => {
    chrome.storage.sync.get(null, (results) => {
        const allKeys = Object.keys(results)
        // texti.innerHTML = allKeys.toString()
        texti.innerHTML = JSON.stringify(results)
    })
})

clear_button.addEventListener("click", () => {
    chrome.storage.sync.clear(() => {
        const error = chrome.runtime.lastError
        if(error) {
            console.log(error)
        } else {
            texti.innerHTML = ''
        }
    })
})
