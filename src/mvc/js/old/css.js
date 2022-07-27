// to do on
// https://developer.mozilla.org/en-US/docs/Web/CSS/Reference

let css = [
    {
        cfg: {show_code: 1, allow_children: 1},
        text: "Properrties",
        code: "props",
        items: []
    },
    {
        cfg: {show_code: 1, allow_children: 1},
        text: "Pseudo classes",
        code: "pseudos",
        items: []
    },
    {
        cfg: {show_code: 1, allow_children: 1},
        text: "Functions",
        code: "fns",
        items: []
    },
     {
        cfg: {show_code: 1, allow_children: 1},
        text: "Data types",
        code: "data",
        items: []
    }
];
let cats = {
    animation: ['animation'],
    spacing: ['padding', 'margin'],
    color: ['color'],
    text: ['font', 'text'],
    positioning: ['flex', 'align', 'justify', 'grid', 'columnn', 'row'],
    dimensions: ['width', 'height'],
    border: ['border'],
    background: ['background'],
    list: ['list'],
    scroll: ['overflow', 'scroll']
};
    
let selectors = document.querySelectorAll('#sect2 li > a:not(.page-not-created)');
for ( let n in selectors) {
    let a = selectors[n];
    console.log(a);
    if (!a.querySelector) {
        continue;
    }
    let name = a.querySelector('code').innerText;
    if (name.indexOf('<') === 0) {
        name = name.substr(1, name.length - 2);
        css[3].items.push({url: a.href, text: name, code: name});
    }
    else if (name.indexOf(':') === 0) {
        css[1].items.push({url: a.href, text: name, code: name});
    }
    else if (name.indexOf('(') > 0) {
        name = name.substr(0, name.indexOf('('));
        css[2].items.push({url: a.href, text: name, code: name})
    }
    else if (name && (name.indexOf('-') !== 0) && (name.indexOf('@') !== 0)) {
        let cat = '';
        for (let c in cats) {
            for (let i = 0; i < cats[c].length; i++) {
                if (name.indexOf(cats[c][i]) > -1) {
                    cat = c;
                    break;
                }
            }
        }
        css[0].items.push({url: a.href, text: name, code: name, cat: cat})
    }
    
}
console.log(JSON.stringify(css, null, 2))