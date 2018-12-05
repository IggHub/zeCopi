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

(function createToolTip(){
	  tooltip = document.createElement('div')
	  tooltip.style.cssText = 
		    'position:absolute; background:black; color:white; padding:4px;z-index:10000;'
		    + 'border-radius:2px; font-size:12px;box-shadow:3px 3px 3px rgba(0,0,0,.4);'
		    + 'opacity:0;transition:opacity 0.3s'
	  tooltip.innerHTML = 'Copied!'
	  document.body.appendChild(tooltip)
})()

// (function createscratchpad(){ 
// 	  scratchpad = document.createElement('div')
// 	  scratchpad.style.cssText = 
// 		    'position:absolute; background:red; color:white; padding:4px;z-index:10000;'
// 		    + 'border-radius:2px; font-size:12px;box-shadow:3px 3px 3px rgba(0,0,0,.4);'
// 		    + 'opacity:1;transition:opacity 0.3s'
//         + 'right:100px; top:100px;'
//         + 'height: 100px; width: 100px;'
//         + 'margin: 10px;'
// 	  document.body.appendChild(scratchpad)
// })()

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
