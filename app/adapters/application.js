/* globals Firebase */

import DS from 'ember-data';

export default DS.FirebaseAdapter.extend({
  firebase: new Firebase('https://boiling-fire-1133.firebaseio.com')
});
