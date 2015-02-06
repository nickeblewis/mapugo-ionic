angular.module('starter').controller('MapController',
  [ '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    'LocationsService',
    'InstructionsService',
    '$firebase',
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      $ionicModal,
      $ionicPopup,
      LocationsService,
      InstructionsService,
      $firebase
      ) {

      /**
       * Once state loaded, get put map on scope.
       */
      $scope.$on("$stateChangeSuccess", function() {

        var ref = new Firebase("https://mapugo.firebaseio.com/malta");
        var fb = $firebase(ref);
        var locationsArray = fb.$asArray();
        // syncObject.$bindTo($scope, 'locations');

        // $scope.locations = LocationsService.savedLocations;
        // $scope.locations = LocationsService;
        $scope.locations = locationsArray;
        $scope.newLocation;

        // if(!InstructionsService.instructions.newLocations.seen) {
        //
        //   var instructionsPopup = $ionicPopup.alert({
        //     title: 'Add Locations',
        //     template: InstructionsService.instructions.newLocations.text
        //   });
        //   instructionsPopup.then(function(res) {
        //     InstructionsService.instructions.newLocations.seen = true;
        //     });
        //
        // }

        $scope.map = {
          defaults: {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
          },
          markers : {},
          center: {
            lat: 35.9123281947677,
            lon:14.503449797630312
          },
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          }
        };

        // $scope.goTo(0);
        // $scope.locate();

      });

      var Location = function() {
        if ( !(this instanceof Location) ) return new Location();
        this.lat  = "";
        this.lng  = "";
        this.name = "";
      };

      $ionicModal.fromTemplateUrl('templates/addLocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
        });

      /**
       * Detect user long-pressing on map to add new location
       */
      $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
        $scope.newLocation = new Location();
        $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
        $scope.modal.show();
      });

      $scope.saveLocation = function() {
        var ref = new Firebase("https://mapugo.firebaseio.com/malta");
        var fb = $firebase(ref);
        var locationsArray = fb.$asArray();
        // syncObject.$bindTo($scope, 'locations');

        var locationKey = locationsArray.$add($scope.newLocation);

        //LocationsService.savedLocations.push($scope.newLocation);
        $scope.modal.hide();
        $scope.goTo(locationKey);
      };

      /**
       * Center map on specific saved location
       * @param locationKey
       */
      $scope.goTo = function(locationKey) {
        //var location = LocationsService(locationKey);
        //var ref = new Firebase("https://mapugo.firebaseio.com");
        //var fb = $firebase(ref);
        //var locationsArray = fb.$asArray();
        //var location = locationsArray.$getRecord(locationKey);

        // console.log($scope.locations[locationKey]);
        var location = $scope.locations[locationKey];
        $scope.map.center  = {
          lat : location.lat,
          lng : location.lng,
          zoom : 18
        };

        $scope.map.markers[locationKey] = {
          lat:location.lat,
          lng:location.lng,
          message: location.name,
          focus: true,
          draggable: false
        };

      };

      /**
       * Center map on user's current position
       */
      $scope.locate = function(){

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 18;

            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              message: "You Are Here",
              focus: true,
              draggable: false
            };

          }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });

      };

    }]);
