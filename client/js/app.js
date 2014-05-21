var app = angular.module('app.bookApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/books/', {
			templateUrl: 'list.html',
			controller: 'bookController'
		})
		.when('/books/new', {
			templateUrl: 'new.html',
			controller: 'newBookController'
		})
}])

app.controller('bookController', ['$scope', 'restfulApi', function($scope, restfulApi) {
	restfulApi.list(function(books) {
		$scope.books = books;
	});
	$scope.labels = [ 'Title', 'Author' ];
}]);

app.controller('newBookController', ['$scope', '$location', 'restfulApi', function($scope, $location, restfulApi) {
	$scope.newPost = function() {
		var book = {
			title: $scope.title, 
			author: $scope.author
		}
		restfulApi.new(book, function() {
			$location.path('/books/');
		})
	}
}]);


app.factory('restfulApi', ['$http', function($http) {
	return {
		'list': function(callback) {
			$http.get('/books/').success(callback);
		},
		'new': function(book, callback) {
			$http.post('/books/', { 'title': book.title, 'author': book.author }).success(callback);
		}
	}
}]);