let counter = 0;

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
		    'position:absolute; background:black; color:white; padding:4px;z-index:10000;'
		    + 'border-radius:2px; font-size:12px;box-shadow:3px 3px 3px rgba(0,0,0,.4);'
		    + 'opacity:0;transition:opacity 0.3s'
	  tooltip.innerHTML = 'Copied!'
	  document.body.appendChild(tooltip)
})();

(function createSnackBar(){
	  snackBar = document.createElement('input')
	  snackBar.style.cssText = 
        'visibility: hidden;min-width: 250px;margin-left: -125px;background-color: #333;color: #fff;text-align: center;border-radius: 2px;padding: 16px;position: fixed;z-index: 1;left: 50%;bottom: 30px;font-size: 17px;'
	  snackBar.innerHTML = 'Some text some message..!'
    snackBar.setAttribute("id", `snackbar`)

	  document.body.appendChild(snackBar)
})();

const displaySnackBar = () => {
    
}

const hideSnackBar = () => {

}
// a = 65
// q = 81
// ESC = 27
// 

let snack = document.getElementById("snackbar")

// document.addEventListener('keydown', function(event){
//     //console.log(event.keyCode)
//     if(event.keyCode == 16){
//         console.log(`You pressed SHIFT!`)
//         snack.style.visibility = `visible`
//         snack.focus()
//     }
//     if(event.keyCode == 27 || event.keyCode == 81) {
//         console.log("ESCaped!/ Quit")
//         snack.value = ``
//         snack.style.visibility = `hidden`
//     }
// });
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
                const note = noteBuilder(textSelection, noteKey)

                chrome.storage.sync.set({[noteKey]: note}, () => {
                    counter = counter + 1
                })

            } else {
                noteKey = '0' 
                const note = noteBuilder(textSelection, noteKey)
                chrome.storage.sync.set({[noteKey]: note}, () => {
                    counter = counter + 1
                })

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

            ev.preventDefault();
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
    key: "Q",
    desc: "Notify 'Q'",
    callback: function(ev){
        snack.value = ``
        snack.style.visibility = `hidden`
        respondQ();
    }
});
Keyboard.add_binding({
    key: "A",
    desc: "Notify 'A'",
    callback: function(ev){
        snack.style.visibility = `visible`
        respondA();
    }
});
Keyboard.add_binding({
    key: "?",
    desc: "Print this help.",
    callback: function(ev){
        log(Keyboard.list_bindings().replace(/\n/g, "<br>"));
    }
});

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
