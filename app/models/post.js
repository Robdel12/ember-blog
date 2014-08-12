import DS from "ember-data";

var Post = DS.Model.extend({
  post_id: DS.attr("number"),
  title: DS.attr("string"),
  body: DS.attr("string"),
  excerpt: DS.attr("string"),
  published: DS.attr("number"),
  post_slug: DS.attr("string"),
  publishedDate: function() {
    // return moment(this.get("published")).format("MMM Do");
    return this.get("published");
  }.property("published")
});

export default Post;
