import Ember from 'ember';
// import FirebaseSimpleLogin from 'firebase-simple-login';

var NewController = Ember.ObjectController.extend({

  isLoggedIn: false,

  init: function() {
    this.set('post',  Ember.Object.create());
    this.set('login',  Ember.Object.create());
    var self = this;
    this.auth = new FirebaseSimpleLogin("https://boiling-fire-1133.firebaseio.com", function(error, user) {
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

export default NewController;
