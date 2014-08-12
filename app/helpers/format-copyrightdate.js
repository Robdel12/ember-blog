import Ember from 'ember';

var formatCopyrightDate = Ember.Handlebars.registerBoundHelper('copyrightDate', function(){
  return new Date().getFullYear();
});

export default formatCopyrightDate;
