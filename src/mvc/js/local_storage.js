(() => {
  "use strict";
  return {
    data(){
      return {
        st: JSON.parse(JSON.stringify(localStorage))
      };
    },
    methods: {
      getData(node){
        if ( node ){
          bbn.fn.log("NODE", node);

          return JSON.parse(localStorage[node.text]);
        }
        return Object.keys(localStorage).map((a) => {
          let json = localStorage[a];
          let o = {
            text: a,
            object: true,
            num_children: 0
          };
          if ( json ){
            let t = JSON.parse(json);
            if ( t.value ){
              if ( bbn.fn.isArray(t.value) ){
                o.num = t.value.length;
              }
              else if ( typeof t.value === 'object' ){
                o.num = bbn.fn.numProperties(t.value)
              }
              else{
                o.text += ': ' + o.value;
              }
            }
          }
          return o;
        });
      }
    },
    mounted(){
      bbn.fn.log("MOUNTED!");
    }
  };
})();
