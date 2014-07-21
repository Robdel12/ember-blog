App = Ember.Application.create();

var db = new Firebase("https://boiling-fire-1133.firebaseio.com");

App.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: db
});

App.ApplicationSerializer = DS.FirebaseSerializer.extend();

App.Router.map(function() {
  this.resource("about");
  this.resource("blog");
  this.resource("new");
  this.resource("post", { path: "/post/:post_slug" });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo("blog");
  }
});

App.BlogRoute = Ember.Route.extend({
  model: function(){
    return this.store.findAll("post");
    // return post;
  }
});

App.PostRoute = Ember.Route.extend({
  model: function(params) {
    console.log(params);
    return params.post_slug;
  }
});

App.NewRoute = Ember.Route.extend({
  model: function() {
    return;
  }
});

//this seems to do nothing
App.BlogIndexController = Ember.ArrayController.extend({
  sortProperties: ['published'],
  asortAscending: false
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
        // console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
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
    return moment(this.get("published")).format("MMMM Do, YYYY");
  }.property("published")
});

//Temp for plane ride...
// var post = [
//   {
//     title: "Post title",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title",
//     publishedDate: moment(new Date(2014, 0, 20)).format("MMM Do")
//   },
//   {
//     title: "Post title 2",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-2",
//     publishedDate: moment(new Date(2014, 01, 25)).format("MMM Do")
//   },
//   {
//     title: "Post title 3",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-3",
//     publishedDate: moment(new Date(2014, 02, 29)).format("MMM Do")
//   },
//   {
//     title: "Post title 4",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-3",
//     publishedDate: moment(new Date(2014, 03, 29)).format("MMM Do")
//   },
//   {
//     title: "Post title 5",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-3",
//     publishedDate: moment(new Date(2014, 04, 29)).format("MMM Do")
//   },
//   {
//     title: "Post title 6",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-3",
//     publishedDate: moment(new Date(2014, 29, 29)).format("MMM Do")
//   },
//   {
//     title: "Post title 7",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-3",
//     publishedDate: moment(new Date(2014, 06, 29)).format("MMM Do")
//   },
//   {
//     title: "Post title 8",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-3",
//     publishedDate: moment(new Date(2014, 07, 29)).format("MMM Do")
//   },
//   {
//     title: "Post title 9",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-3",
//     publishedDate: moment(new Date(2014, 08, 29)).format("MMM Do")
//   },
//   {
//     title: "Post title 10",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-3",
//     publishedDate: moment(new Date(2014, 09, 29)).format("MMM Do")
//   },
//   {
//     title: "Post title 11",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-3",
//     publishedDate: moment(new Date(2014, 10, 29)).format("MMM Do")
//   },
//   {
//     title: "Post title 12",
//     excerpt: "This is the little excerpt.. Maybe I should limit this to a certain amount of chars",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quo perferendis tempora odit distinctio itaque officia fugit, at, exercitationem voluptatem, ab sint maiores ad consectetur harum, error quae recusandae. Blanditiis.",
//     post_slug: "post-title-3",
//     publishedDate: moment(new Date(2014, 11, 29)).format("MMM Do")
//   },
// ];

Ember.Handlebars.helper('markdown', function(value, options) {
  if (!value || !options){ return; }
  return new Ember.Handlebars.SafeString(window.markdown.toHTML(value));
});

Ember.Handlebars.helper('copyrightDate', function(){
  return new Date().getFullYear();
});
