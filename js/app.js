App = Ember.Application.create();

App.Router.map(function() {
  this.resource("about");
  this.resource("posts", function(){
    this.resource("new");
  });
  this.resource("post", { path: "/post/:post_slug" });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo("posts");
  }
});

App.PostsRoute = Ember.Route.extend({
  model: function(){
    return this.store.findAll("post");
  }
});

App.PostRoute = Ember.Route.extend({
  model: function(params) {
    //return this.store.find("post", this.get("title"));
  }
});

//this seems to do nothing
App.PostsIndexController = Ember.ArrayController.extend({
  sortProperties: ['published'],
  asortAscending: false
});

App.NewController = Ember.ObjectController.extend({

  init: function() {
    this.set('post',  Ember.Object.create());
  },

  actions: {
    publishPost: function() {
      var newPost = this.store.createRecord('post', {
        title: this.get('post.title'),
        excerpt: this.get('post.excerpt'),
        body: this.get('post.body'),
        published: new Date().getTime(),
      });
      newPost.save();
      this.setProperties({
        'post.title': '',
        'post.excerpt': '',
        'post.body': ''
      });
      this.transitionToRoute('post', newPost);
    }
  }

});

App.Post = DS.Model.extend({
  post_id: DS.attr("number"),
  title: DS.attr("string"),
  body: DS.attr("string"),
  excerpt: DS.attr("string"),
  published: DS.attr("number"),
  publishedDate: function() {
    return moment(this.get("published")).format("MMMM Do, YYYY");
  }.property("published"),
  post_slug: function(){
    return this.get("title").replace(/\s+$/g,'').replace(/\s+/g, '-').toLowerCase();
  }.property("title")
});

Ember.Handlebars.helper('markdown', function(value, options) {
  if (!value || !options){ return; }
  return new Ember.Handlebars.SafeString(window.markdown.toHTML(value));
});

App.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: new Firebase("https://boiling-fire-1133.firebaseio.com")
});

App.ApplicationSerializer = DS.FirebaseSerializer.extend();
