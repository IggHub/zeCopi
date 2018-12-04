let counter = 0;

document.addEventListener('mouseup', () => {
    const selection = document.getSelection().toString()
    let zeAwesomeKey = 'zeAwesomeKey' + counter   
    chrome.storage.sync.set({zeAwesomeKey: selection}, () => {
        counter = counter + 1
        console.log('zeAwesome is set to ' + selection)
        console.log('Oh, counter is: ' + counter)
    })
})
