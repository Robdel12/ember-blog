import Ember from 'ember';

var Router = Ember.Router.extend({
  location: EmberBlogENV.locationType
});

Router.map(function() {
  this.route("about");
  this.route("blog");
  this.route("new");
  this.route("post", { path: "/post/:post_slug" });
});

export default Router;
