app.controller('loginController', function ($scope, $window, $location, User) {
    var sessionStorage = $window.sessionStorage;

    if (sessionStorage.getItem('token')) {
        $location.path('/books/list')
    }

    function login() {
        User.login({
            username: $scope.username,
            password: $scope.password
        }, function (json, headers) {
            sessionStorage.setItem('token', json.token);
            $location.path('/books/list')
        }, function (error) {
            if (error.status == 401) {
                $scope.message = error.data.message;
            }
        });
    }

    $scope.login = login;

    $scope.register = function () {
        console.log($scope.username);
        User.signup({
            username: $scope.username,
            password: $scope.password
        }, function () {
            login();
        }, function (error) {
            if (error.status == 400) {
                $scope.message = error.data.message;
                $scope.validationErrors = error.data.validationErrors;
            }
        });
    };
});

app.controller('bookController', function ($scope, $location, Book) {
    $scope.labels = ['Title', 'Author'];
    $scope.books = Book.query();

    $scope.remove = function (id) {
        Book.delete({id: id});
        $scope.books = Book.query();
    };

    $scope.newPost = function () {
        var book = {
            title: $scope.title,
            author: $scope.author
        };
        Book.save(book, function () {
            $location.path('/books/list');
        });
    }

});
