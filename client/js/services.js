app.factory('Book', function ($resource) {
    return $resource('/rest/books/:id');
});


app.factory('User', function ($resource) {
    return $resource('/rest/users/:userId', {userId: '@Id'}, {
        'login': {
            method: 'POST',
            url: '/rest/users/authenticate'
        },
        'signup': {
            method: 'POST',
            url: '/rest/users/signup'
        }
    });
});


app.factory('tokenInterceptor', function ($window, $location, $q) {
    return {
        request: function (config) {
            var token = $window.sessionStorage.getItem('token');
            config.headers = config.headers || {};
            if (token) {
                config.headers.Authorization = token;
            } else {
                $location.path('/books/login')
            }
            return config;
        },
        response: function (response) {
            if (response.status === 401) {
                $location.path('/books/login');
            }
            return response || $q.when(response);
        }
    }
});