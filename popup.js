const buttoni = document.getElementById("button-get-value")
const clear_button = document.getElementById("clear_button")
const list_display = document.getElementById("list_display")
const copy_button = document.getElementById("copy_button")
const download_txt_button = document.getElementById("download_txt_button")
const download_json_button = document.getElementById("download_json_button")
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(
        function() {
            console.log("Async: Copying to clipboard was successful!");
        },
        function(err) {
            console.error("Async: Could not copy text: ", err);
        }
    );
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: Copying text command was " + msg);
    } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
}


const removeElement = (elementId) => {
    const elem = document.getElementById(elementId)
    const elemButton = document.getElementById(`${elementId}_delete_button`)
    elemButton.parentNode.removeChild(elemButton)
    elem.parentNode.removeChild(elem)
    alert("removed " + elementId)
    // return false
}

let noteObject;

chrome.storage.sync.get(null, (results) => {
    noteObject = results
    console.log('noteObject')
    console.log(noteObject)
    const allKeys = Object.keys(results)
    for(let key in results) {
        const listItem = document.createElement("li")
        const deleteButton = document.createElement("button")
        const spanEl = document.createElement("span")

        deleteButton.className = "delete_button"
        deleteButton.textContent = "Delete"
        deleteButton.style.margin = "10px"
        deleteButton.setAttribute("id", `${key}_delete_button`)
        deleteButton.addEventListener("click", () => {
            chrome.storage.sync.remove(key, removeElement(key))
        })

        spanEl.textContent = results[key].text
        spanEl.className = "list_content"
        listItem.appendChild(spanEl)
        listItem.setAttribute("id", key)
        // listItem.textContent = results[key].text
        listItem.appendChild(deleteButton)
        list_display.appendChild(listItem)
    }
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

copy_button.addEventListener("click", () => {
    const listCollection = list_display.getElementsByTagName("li")
    if(listCollection.length > 0) {
        const listArray = Array.from(listCollection)
        const listObj = listArray.map(list =>
           ({
               text: list.getElementsByClassName("list_content")[0].innerText
           }))
        const textFromList = listObj.map(list => (
            list.text
        )).join("\r\n")
        copyTextToClipboard(textFromList)
    } else {
        copyTextToClipboard('')
    }
})

function downloadTxtFile(options) {
    if(!options.url) {
        var blob = new Blob([ options.content ], {type : options.type});
        options.url = window.URL.createObjectURL(blob);
    }
    chrome.downloads.download({
        url: options.url,
        filename: options.filename
    })
}

function noteTxtDownloadPresenter(noteObj){
    let noteArr = [];
    for(let key in noteObj){
        noteArr.push(noteObj[key].text)
    }
    for(let i = 0; i < noteArr.length; i++){
        noteArr[i] = "- " + noteArr[i]
    }
    return noteArr.join("\r\n")
}
// TODO: abstract JSONDownloadPrenter andTxtDownloadPresenter
function noteJSONDownloadPresenter(noteObj){
    let noteJSON = {};
    for(let key in noteObj){
        
    }
}
download_txt_button.addEventListener("click", () => {
    downloadTxtFile({
        filename: "todayNote.txt",
        content: noteTxtDownloadPresenter(noteObject),
        type: "text/plain;charset=UTF-8"
    })
})


console.log(noteObject)
console.log("noteObject")

download_json_button.addEventListener("click", () => {
    downloadTxtFile({
        filename: "json_test.txt",
        content: JSON.stringify(noteObject),
        type: "application/json"
    })
})
