var app = angular.module('app.bookApp', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/books/', {
            templateUrl: 'list.html',
            controller: 'bookController'
        })
        .when('/books/new', {
            templateUrl: 'new.html',
            controller: 'newBookController'
        })
        .otherwise({redirectTo: '/books/'})
});

app.controller('bookController', function ($scope, Book) {
    $scope.labels = ['Title', 'Author'];
    $scope.books = Book.query();

    $scope.remove = function (id) {
        Book.delete({ id: id });
        $scope.books = Book.query();
    };

});

app.controller('newBookController', function ($scope, $location, Book) {
    $scope.newPost = function () {
        var book = {
            title: $scope.title,
            author: $scope.author
        };
        Book.save(book, function () {
            $location.path('/books/');
        })
    }
});


app.factory('Book', function ($resource) {
    return $resource('/books/:id');
});