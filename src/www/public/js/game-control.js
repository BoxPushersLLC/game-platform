var boxxleApp = angular.module('boxxleApp', []);
boxxleApp.controller('gameCtrl', function($scope, $element, $http) {
    var el = angular.element(document.querySelector('#gameBoard'));
	var game = createBoxxer(el);
    $scope.game = game;

	getLevel = function(levelID) {
		return levelID;
	};

	game.onDone = function(endData) {
		$scope.saving = true;
		$http.post('/data', endData).then(function(res){
			//console.log(res.data);
			var newLevel = res.data;
			$scope.saving = false;
			game = createBoxxer($element, getLevel(newLevel) );
		}, function(err){ console.log(err); } );

	};


});