angular.module('starter')
.factory('LocationsService', ['$firebase', function($firebase) {

  return function(username) {
    // create a reference to the user's profile
    var ref = new Firebase("https://mapugo.firebaseio.com/").child(username);
    // return it as a synchronized object
    return $firebase(ref).$asObject();
  }

}]);
