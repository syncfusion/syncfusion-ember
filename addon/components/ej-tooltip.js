import Ember from 'ember';
import layout from '../templates/components/ej-tooltip';

export default Ember.Component.extend({
  layout,
  tags: Ember.inject.service("tags"),
  tagName: window.Syncfusion.widget.registeredWidgets["ejTooltip"]["proto"]["validTags"][0],
  didInsertElement: function(){
    this._super(...arguments);
    this.$()["ejTooltip"](this.get("tags").processTags(this.attrs, this));
  },
  willDestroyElement: function () {
    this._super(...arguments);
    this.$()["ejTooltip"]("destroy");
  }
});
