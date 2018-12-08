let counter = 0;

const getSelection = () => {
    let selectedText = ''
    if(document.getSelection()){
        selectedText = document.getSelection().toString()
    }
    return selectedText
}

const showtooltip = (e) => {
	  const evt = e
	  tooltip.style.left = evt.pageX - 10 + 'px'
	  tooltip.style.top = evt.pageY + 15 + 'px'
	  tooltip.style.opacity = 1
}

const noteBuilder = (text, textId) => {
    return {
        text,
        textId
        //future: timestamp, websites it is taken from 
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
    //console.log('FIRST notekey ' + noteKey)
    if (textSelection.length > 0) {
        showtooltip(e)
        setTimeout(() => tooltip.style.opacity = 0, 500)

        chrome.storage.sync.get(null, (results) => {
            const allKeys = Object.keys(results) // []
            console.log(`allKeys: ${allKeys}`)
            if (!Array.isArray(allKeys) || allKeys.length > 0){
                //console.log('inside First IF ' + allKeys)
                const lastNoteKey = allKeys.slice(-1)[0]
                
                const nextNoteKeyInteger = parseInt(lastNoteKey.replace(/\D/g, '')) + 1
                noteKey = nextNoteKeyInteger
                const note = noteBuilder(textSelection, noteKey)

                chrome.storage.sync.set({[noteKey]: note}, () => {
                    counter = counter + 1
                })

            } else {
                noteKey = '0' 
                //console.log('SECOND ELSE noteKey ' + noteKey)
                const note = noteBuilder(textSelection, noteKey)
                chrome.storage.sync.set({[noteKey]: note}, () => {
                    counter = counter + 1
                    //console.log('noteKey is set to ' + note.text)
                    //console.log('Oh, counter is: ' + note.textId)
                })

            }
        })
        //console.log('notekey after if statement is : ' + noteKey)

        // //console.log('noteKey before syncing: ' + noteKey)
    }
})

