App = Ember.Application.create();

var db = new Firebase("https://boiling-fire-1133.firebaseio.com");

App.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: db
});

App.ApplicationSerializer = DS.FirebaseSerializer.extend();

App.Router.map(function() {
  this.route("about");
  this.route("blog");
  this.route("new");
  this.route("post", { path: "/post/:post_slug" });
});

App.IndexRoute = Ember.Route.extend({

  redirect: function() {
    this.transitionTo("blog");
  }

});

App.BlogRoute = Ember.Route.extend({

  model: function(){
    return this.store.findAll("post");
  }

});

App.PostRoute = Ember.Route.extend({

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

//this seems to do nothing
App.BlogController = Ember.ArrayController.extend({
  sortProperties: ['published'],
  sortAscending: false
});

App.NewController = Ember.ObjectController.extend({

  isLoggedIn: false,

  init: function() {
    this.set('post',  Ember.Object.create());
    this.set('login',  Ember.Object.create());
    var self = this;
    this.auth = new FirebaseSimpleLogin(db, function(error, user) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
        // user authenticated with Firebase
        self.set('isLoggedIn', true);
      } else {
        self.set('isLoggedIn', false);
      }
    });
  },

  actions: {

    publishPost: function() {
      var newPost = this.store.createRecord('post', {
        title: this.get('post.title'),
        excerpt: this.get('post.excerpt'),
        body: this.get('post.body'),
        published: new Date().getTime(),
        post_slug: this.get("post.title").replace(/\s+$/g,'').replace(/\s+/g, '-').toLowerCase()
      });
      newPost.save();
      this.setProperties({
        'post.title': '',
        'post.excerpt': '',
        'post.body': ''
      });
      this.transitionToRoute('post', newPost);
    },

    logIn: function(){
      this.auth.login('password', {
        email: this.get('login.email'),
        password: this.get('login.password'),
        rememberMe: true
      });
    },

    logOut: function(){
      this.auth.logout();
    }

  }

});

App.Post = DS.Model.extend({
  post_id: DS.attr("number"),
  title: DS.attr("string"),
  body: DS.attr("string"),
  excerpt: DS.attr("string"),
  published: DS.attr("number"),
  post_slug: DS.attr("string"),
  publishedDate: function() {
    return moment(this.get("published")).format("MMM Do");
  }.property("published")
});

Ember.Handlebars.helper('markdown', function(value, options) {
  if (!value || !options){ return; }
  return new Ember.Handlebars.SafeString(window.markdown.toHTML(value));
});

Ember.Handlebars.helper('copyrightDate', function(){
  return new Date().getFullYear();
});

App.CDisqusComponent = Em.Component.extend({

  didInsertElement: function () {
    var page_id = window.location.href,
        disqus_identifier = page_id,
        disqus_url = page_id,
        disqus_title = Em.$('title').text(),
        disqus_shortname = 'robertdeluca', // CHANGE, USE YOURS
        el_id = disqus_shortname + Date.now();

    this.set('page_id', el_id);

    var dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
    dsq.id = el_id;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  },

  willDestroyElement: function () {
    Em.$('#' +  this.get('page_id')).remove();
  }
});
