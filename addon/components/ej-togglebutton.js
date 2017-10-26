import Ember from 'ember';
import layout from '../templates/components/ej-togglebutton';

export default Ember.Component.extend({
  layout,
  tags: Ember.inject.service("tags"),
  tagName: window.Syncfusion.widget.registeredWidgets["ejToggleButton"]["proto"]["validTags"][0],
  attributeBindings: ['type'],
  didInsertElement: function(){
    this._super(...arguments);
    this.$()["ejToggleButton"](this.get("tags").processTags(this.attrs, this));
  },
  willDestroyElement: function () {
    this._super(...arguments);
    this.$()["ejToggleButton"]("destroy");
  }
});
