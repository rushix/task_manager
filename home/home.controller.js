(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'TaskService', '$rootScope'];
    function HomeController(UserService, TaskService, $rootScope) {
        var tm = this;

        tm.user = null;
        tm.allUsers = [];
        tm.deleteUser = deleteUser;

	tm.allTasks = [];
	tm.deleteTask = deleteTask;

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();

	    loadAllTasks();
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    tm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    tm.allUsers = users;
                });
        }

        function loadAllTasks() {
            TaskService.GetAll()
                .then(function (tasks) {
                    tm.allTasks = tasks;
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
