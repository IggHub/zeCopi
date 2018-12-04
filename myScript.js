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

(() => {
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
    let zeAwesomeKey = 'zeAwesomeKey' + counter   

    if (textSelection.length > 0) {
        showtooltip(e)
        setTimeout(() => tooltip.style.opacity = 0, 500)
        chrome.storage.sync.set({[zeAwesomeKey]: textSelection}, () => {
            counter = counter + 1
            console.log('zeAwesome is set to ' + textSelection)
            console.log('Oh, counter is: ' + counter)
        })
    }
})
