var app = angular.module('app.bookApp', ['app.rest']);
// var app = angular.module('app.bookApp', ['app.rest', 'ngRoute']);

// app.config(['$routeProvider', function($routeProvider){
// 	$routeProvider
// 		.when('/books/', {

// 		})
// }])

app.controller('bookController', ['$scope', 'restfulApi', function($scope, restfulApi) {
	$scope.books = restfulApi.query();
	$scope.labels = [ 'Title', 'Author' ];

}]);

angular.module('app.rest', ['ngResource'])
	.factory('restfulApi', function($resource) {
		return $resource('http://localhost:3000/books/:id');
	});