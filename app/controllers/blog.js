import Ember from 'ember';

var BlogController = Ember.ArrayController.extend({
  sortProperties: ['published'],
  sortAscending: false
});

export default BlogController;
