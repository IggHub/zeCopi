let counter = 0;

const getSelection = () => {
    let selectedText = ''
    if(document.getSelection()){
        selectedText = document.getSelection().toString()
    }
    return selectedText
}

document.addEventListener('mouseup', () => {
    // const selection = document.getSelection().toString()
    const textSelection = getSelection()
    let zeAwesomeKey = 'zeAwesomeKey' + counter   
    chrome.storage.sync.get(null, (results) => {
        const allKeys = Object.keys(results)
        console.log(allKeys.toString())
    })

    chrome.storage.sync.set({[zeAwesomeKey]: textSelection}, () => {
        counter = counter + 1
        console.log('zeAwesome is set to ' + textSelection)
        console.log('Oh, counter is: ' + counter)
    })
})
