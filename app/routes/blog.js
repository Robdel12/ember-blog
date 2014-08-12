import Ember from 'ember';

var BlogRoute = Ember.Route.extend({
  model: function(){
    return this.store.findAll("post");
  }
});

export default BlogRoute;
