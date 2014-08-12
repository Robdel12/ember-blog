import Ember from 'ember';

var formatMarkdown = Ember.Handlebars.registerBoundHelper('markdown', function(value, options) {
  if (!value || !options){ return; }
  return new Ember.Handlebars.SafeString(window.markdown.toHTML(value));
});

export default formatMarkdown;
