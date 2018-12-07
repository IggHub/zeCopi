export const getSelection = () => {
    let selectedText = ''
    if(document.getSelection()){
        selectedText = document.getSelection().toString()
    }
    return selectedText
}

