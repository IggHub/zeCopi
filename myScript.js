const getSelection = () => {
    let selectedText = ''
    if(document.getSelection()){
        selectedText = document.getSelection().toString()
    }
    return selectedText
};

const showtooltip = (e) => {
	  const evt = e
	  tooltip.style.left = evt.pageX - 10 + 'px'
	  tooltip.style.top = evt.pageY + 15 + 'px'
	  tooltip.style.opacity = 1
};

const noteBuilder = (text, textId) => {
    return {
        text,
        textId
        //future: timestamp, websites it is taken from
    }
};

(function createToolTip(){
	  tooltip = document.createElement('div')
	  tooltip.style.cssText = 
		    'position:absolute;' + 
        'background:#19b5fe;' +
        'color:white;' +
        'padding:0.25rem;' +
        'z-index:10000;' +
		    'border-radius:0.125rem;' +
        'font-size:1rem;' +
        'box-shadow:3px 3px 3px rgba(0,0,0,.4);' +
		    'opacity:0;transition:opacity 0.3s'
	  tooltip.innerHTML = 'Copied!'
	  document.body.appendChild(tooltip)
})();

(function createSnackBar(){
	  snackBar = document.createElement('span')
	  snackBar.style.cssText =
        'width:15rem;' +
        'max-width: 15rem;' +
        'margin-left: -7.5rem;' +
        'background: #e4e9ed;' +
        'color: #2e3131;' +
        'border-radius: 0.25rem;' +
        'padding: 1rem;' +
        'position: fixed;' +
        'bottom: 3rem;' +
        'left: 50%;' +
        'font-size: 1rem;' +
        'box-shadow: none;' +
        'border: 0.25rem solid #19b5fe;' +
        'outline: none;' +
        'z-index: 9999;' + 
        'visibility: hidden;'

    snackBar.contentEditable = 'true'
    snackBar.setAttribute("id", `snackbar`)

    snackBar.addEventListener('focus', () => {
        snackBar.style.border = '0.25rem solid #19b5fe'
    })
    snackBar.addEventListener('blur', () => {
        snackBar.style.border = '0.25rem solid #89c4f4'
    })
    snackBar.addEventListener('keydown', (e) => {
        const snackContent = snackBar.textContent
        if(snackContent.length > 160) {
            e.preventDefault()
        }
    })
	  document.body.appendChild(snackBar)
})();

// a = 65
// q = 81
// ESC = 27
// 

let snack = document.getElementById("snackbar")

const chromeNoteSyncer = (noteKey, noteValue) => {
    chrome.storage.sync.set({[noteKey]: noteValue}, () => {
        console.log("note synced")
    })
}
document.addEventListener('mouseup', (e) => {
    const textSelection = getSelection()
    let noteKey
    if (textSelection.length > 0) {
        showtooltip(e)
        setTimeout(() => tooltip.style.opacity = 0, 500)

        chrome.storage.sync.get(null, (results) => {
            const allKeys = Object.keys(results) // []
            console.log(`allKeys: ${allKeys}`)
            if (!Array.isArray(allKeys) || allKeys.length > 0){
                const lastNoteKey = allKeys.slice(-1)[0]
                const nextNoteKeyInteger = parseInt(lastNoteKey.replace(/\D/g, '')) + 1
                noteKey = nextNoteKeyInteger
                const noteValue = noteBuilder(textSelection, noteKey)

                chromeNoteSyncer(noteKey, noteValue)
            } else {
                noteKey = 0 
                const noteValue = noteBuilder(textSelection, noteKey)
                chromeNoteSyncer(noteKey, noteValue)
            }
        })
    }
});

/* https://jsfiddle.net/B1KMusic/ofwa3pq2/embedded/result,js,html,css */ 

const Keyboard = Object.freeze({
    final: Object.freeze({
        bind_proto: Object.freeze({
            key: null,
            ctrlKey: false,
            altKey: false,
            desc: null,
            callback: null,
        })
    }),

    private: Object.seal({
        el: null,
        bindings: null,
        ev_keydown_ptr: null
    }),

    public: Object.seal({
    	/* (nothing here yet) */
    }),
    _mkbind: function(bind){
        let self = this;

        return Object.seal({...self.final.bind_proto, ...bind});
	},
    _binding_filter: function(search){
    	return bind => (
            bind.altKey  === search.altKey &&
            bind.ctrlKey === search.ctrlKey &&
            bind.key     === search.key
        );
    },
    _binding_lookup: function(bind){
        let self = this;
    	let result = self.private.bindings.find(self._binding_filter(bind));
        if(typeof result === "undefined")
            return null;
        return result;
    },
    _ev_keydown: function(){
        let self = this;

        return function(ev){
            let result = self._binding_lookup(ev);

            if(result === null)
                return;

            if(result.key !== "Enter"){
                ev.preventDefault();
            }
            // ev.preventDefault();
            // use preventDefault to prevent default browser action
            // need to make exception for Enter
            // otherwise we won't be able to submit forms by pressing Enter
            result.callback(ev);
        }
    },
    _get_label: function(binding){
        let ret = binding.key;
        if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(binding.key) !== -1)
            ret = "shift-" + ret;
        if(binding.ctrlKey)
            ret = "ctrl-" + ret;
        if(binding.altKey)
            ret = "alt-" + ret;
        return ret;
    },
    _pad_left: function(text, width){
        while(text.length < width)
            text = " " + text;
        return text;
    },
    attach: function(el){
        let self = this;
    	self.private.ev_keydown_ptr = self._ev_keydown();
        self.private.el = el;
        self.private.el.tabIndex = 0;
        self.private.el.addEventListener("keydown", self.private.ev_keydown_ptr);
        self.private.bindings = [];
    },
    detach: function(){
        let self = this;
        if(self.private.el === null)
            return;
        self.private.el.removeEventListener("keydown", self.private.ev_keydown_ptr);
    },
    add_binding: function(bind){
    	let self = this;
        let bind_proper = self._mkbind(bind);
    	let result = self._binding_lookup(bind_proper);
        if(result !== null)
            return false;
        self.private.bindings.push(bind_proper);
        return true;
    },
    remove_binding: function(bind){
        let self = this;
        let bind_proper = self._mkbind(bind);
    	let result = self._binding_lookup(bind_proper);
        let index = self.private.bindings.indexOf(result);

            return false;

        self.private.bindings.splice(index, 1);
        return true;
    },
    list_bindings: function(){
        let self = this;
        let out = "";
        let labels = self.private.bindings.map(self._get_label);
        let longest = labels.map(l => l.length).reduce((a,b) => a>b?a:b, 0);
        labels.map(label => self._pad_left(label, longest)).forEach(function(label, i){
            out += `${label}  ${self.private.bindings[i].desc}\n`;
        });
        return out;
    }
});

let inputbox = document.querySelector(".input");
let outputbox = document.querySelector(".output");

function log(msg){
    outputbox.innerHTML = msg;
}

function respondQ(){
    // alert("You pressed Q");
    console.log("Q is pressed")
}
function respondA(){
    // alert("You pressed A");
    console.log("A pressed")
}
Keyboard.attach(document.body);

// Here's where the magic is...

Keyboard.add_binding({
    key: "q",
    desc: "Notify '^q'",
    ctrlKey: true,
    callback: function(ev){
        snack.textContent = ``
        snack.style.visibility = `hidden`
        // add event listener to INPUT for ENTER
    }
});
Keyboard.add_binding({
    key: "a",
    desc: "Notify '^A'",
    ctrlKey: true,
    callback: function(ev){
        snack.style.visibility = `visible`
        snack.focus()
        // remove event listener
    }
});
// Keyboard.add_binding({
//     key: "?",
//     desc: "Print this help.",
//     callback: function(ev){
//         log(Keyboard.list_bindings().replace(/\n/g, "<br>"));
//     }
// });
Keyboard.add_binding({
    key: "Enter",
    desc: "Press Enter",
    callback: function(ev){
        // what to do on enter?
        // check if I am inside the input
        // if I am, and if input has content
        // submit
        
        if(snack && snack.style.visibility == 'visible' && snack.textContent) {
            // console.log(snack.value)
            // console.log('snack value^')
            let noteKey
            chrome.storage.sync.get(null, (results) => {
                const allKeys = Object.keys(results) // []
                console.log(`allKeys: ${allKeys}`)
                if (!Array.isArray(allKeys) || allKeys.length > 0){
                    const lastNoteKey = allKeys.slice(-1)[0]
                    const nextNoteKeyInteger = parseInt(lastNoteKey.replace(/\D/g, '')) + 1
                    noteKey = nextNoteKeyInteger
                    const noteValue = noteBuilder(snack.textContent, noteKey)
                    chromeNoteSyncer(noteKey, noteValue)
                    snack.textContent = ''

                } else {
                    noteKey = '0' 
                    const noteValue = noteBuilder(snack.textContent, noteKey)
                    chromeNoteSyncer(noteKey, noteValue)
                    snack.textContent = ''
                }
            })
        }
        console.log("ENTER")
        snack.style.visibility = 'hidden'

    }
})

/*
 * Try adding a binding for Ctrl-L, or calling
 * Keyboard.remove_binding() on ctrl-d. Notice how when a
 * binding is found, it is executed and the browser's
 * default (e.g. opening the bookmark UI) is prevented.
 * But it nothing is found, it's business as usual.
 *
 * I've provided said line below. Un-comment it to experiment.
 */

// Keyboard.remove_binding({key: "d", ctrlKey: true});
