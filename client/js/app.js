var app = angular.module('app.bookApp', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('tokenInterceptor');

    $routeProvider
        .when('/books/login', {
            templateUrl: 'login.html',
            controller: 'loginController'
        })
        .when('/books/list', {
            templateUrl: 'list.html',
            controller: 'bookController'
        })
        .when('/books/new', {
            templateUrl: 'new.html',
            controller: 'bookController'
        })
        .otherwise({redirectTo: '/books/login'})
});
