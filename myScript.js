let counter = 0;

const getSelection = () => {
    let selectedText = ''
    if(document.getSelection()){
        selectedText = document.getSelection().toString()
    }
    return selectedText
}

const showtooltip = (e) => {
	  var evt = e
	  tooltip.style.left = evt.pageX - 10 + 'px'
	  tooltip.style.top = evt.pageY + 15 + 'px'
	  tooltip.style.opacity = 1
}

const noteBuilder = (text, textId) => {
    return {
        text,
        textId
    }
}

(function createToolTip(){
	  tooltip = document.createElement('div')
	  tooltip.style.cssText = 
		    'position:absolute; background:black; color:white; padding:4px;z-index:10000;'
		    + 'border-radius:2px; font-size:12px;box-shadow:3px 3px 3px rgba(0,0,0,.4);'
		    + 'opacity:0;transition:opacity 0.3s'
	  tooltip.innerHTML = 'Copied!'
	  document.body.appendChild(tooltip)
})()

document.addEventListener('mouseup', (e) => {
    const textSelection = getSelection()
    let noteKey
    console.log('FIRST notekey ' + noteKey)
    if (textSelection.length > 0) {
        showtooltip(e)
        setTimeout(() => tooltip.style.opacity = 0, 500)

        chrome.storage.sync.get(null, (results) => {
            console.log('results is ' + JSON.stringify(results)) // {}
            const allKeys = Object.keys(results) // []
            console.log('allKeys' + allKeys.toString())
            if (!Array.isArray(allKeys) || allKeys.length > 1){
                console.log('inside First IF ' + allKeys)
        //         const lastNoteKey = allKeys.slice(-1)[0]
                
        //         const nextNoteKeyInteger = parseInt(lastNoteKey.replace(/\D/g, '')) + 1
        //         noteKey = 'noteKey' + nextNoteKeyInteger
        //         console.log('SECOND noteKey ' + noteKey)
            } else {
                noteKey = 'noteKey0  
                console.log('SECOND ELSE noteKey ' + noteKey)
            }
        })
        // const note = noteBuilder(textSelection, counter)

        // console.log('noteKey before syncing: ' + noteKey)
        // chrome.storage.sync.set({[noteKey]: note}, () => {
        //     counter = counter + 1
        //     console.log('noteKey is set to ' + note.text)
        //     console.log('Oh, counter is: ' + note.textId)
        // })
    }
})

