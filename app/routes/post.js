import Ember from 'ember';

var PostRoute = Ember.Route.extend({
  model: function(params) {
    return params.post_slug;
    // return jQuery.getJSON("/post/" + params.post_slug);
    // var store = this.store;
    // // Get all the posts from Firebase
    // return store.findAll('post').then(function(slugs) {
    //   // Then filter the ones you want
    //   return store.filter('post', { post_slug: params.post_slug });
    // });
  },
  // serialize: function(model) {
  //   return { post_slug: model.get('data').post_slug };
  // }
});

export default PostRoute;
