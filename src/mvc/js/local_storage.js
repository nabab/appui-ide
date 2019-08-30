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
        let res = {};
        bbn.fn.iterate(localStorage, (a, k) => {
          if ( a ){
            let t = JSON.parse(a);
            if ( t.value ){
              if ( bbn.fn.isString(t.value) ){
                let c1 = t.value.trim().substr(0, 1);
                if (['{', '['].includes(c1) ){
                  let tmp = false;
                  try {
                    tmp = JSON.parse(t.value);
                  }
                  catch (e){
                    
                  }
                  if (tmp) {
                    t.value = tmp;
                  }
                }
              }
            }
            res[k] = t;
          }
        });
        return res;
      }
    },
    mounted(){
      bbn.fn.log("MOUNTED!");
    },
    components: {
      props: ['source'],
      node: {
        template: ``,
        methods: {
          del(){
            
          }
        }
      }
    }
  };
})();