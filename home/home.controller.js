(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'TaskService', '$rootScope', '$filter', '$routeParams'];
    function HomeController(UserService, TaskService, $rootScope, $filter, $routeParams) {
        var tm = this;

        tm.user = null;
        tm.allUsers = [];
        tm.deleteUser = deleteUser;

	tm.allTasks = [];
	tm.deleteTask = deleteTask;

        function loadAllTasks(id) {

	    TaskService.GetByUsername(id)
                .then(function (tasks) {
			
		    if (typeof $routeParams.orderBy !== "undefined") {
		    	tm.allTasks =  $filter('orderBy')(tasks, $routeParams.orderBy);
		    } else if (typeof $routeParams.filterBy !== "undefined") {
			console.log($routeParams.filterBy);
			tm.allTasks = $filter('filter')(tasks, { status: $routeParams.filterBy });
		    } else {
			tm.allTasks = tasks;	
		    }
                });
        }


        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();

        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    tm.user = user;

	    	    tm.allTasks = loadAllTasks(user.id);
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    tm.allUsers = users;
                });
        }
        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }

        function deleteTask(id) {
            TaskService.Delete(id)
            .then(function () {
                loadAllTasks();
            });
        }
    }

})();
