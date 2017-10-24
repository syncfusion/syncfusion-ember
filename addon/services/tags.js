import Ember from 'ember';

export default Ember.Service.extend({
     processTags: function (props, cont) {
         var opt = {};
         for (var prop in props)
             if (prop.match(/^e-/g)){
                 if(typeof(props[prop]) === "object")
                     opt[prop.replace('e-', '')] = cont.get(prop);
                else
                    opt[prop.replace('e-', '')] = props[prop];
             }
         return opt;
     }
});
