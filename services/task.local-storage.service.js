(function () {
    'use strict';

    angular
        .module('app')
        .factory('TaskService', TaskService);

    TaskService.$inject = ['$timeout', '$filter', '$q'];
    function TaskService($timeout, $filter, $q) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByTitle = GetByTitle;
	service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getTasks());
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getTasks(), { id: id });
            var task = filtered.length ? filtered[0] : null;
            deferred.resolve(task);
            return deferred.promise;
        }

        function GetByUsername(username) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getTasks(), { username: username });
            var tasks = filtered.length ? filtered : null;
            deferred.resolve(tasks);
            return deferred.promise;
        }


        function GetByTitle(title) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getTasks(), { title: title });
            var task = filtered.length ? filtered[0] : null;
            deferred.resolve(task);
            return deferred.promise;
        }

        function Create(task) {
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {

		//task.username = parseInt(task.username.slice(7));

                GetByTitle(task.title)
                    .then(function (duplicateTask) {
                        if (duplicateTask !== null) {
                            deferred.resolve({ success: false, message: 'Task with title "' + task.title + '" is already exists' });
                        } else {
                            var tasks = getTasks();

                            // assign id
                            var lastTask = tasks[tasks.length - 1] || { id: 0 };
                            task.id = lastTask.id + 1;

                            // save to local storage
                            tasks.push(task);
                            setTasks(tasks);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function Update(task) {
            var deferred = $q.defer();

            var tasks = getTasks();
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].id === task.id) {
                    tasks[i] = task;
                    break;
                }
            }
            setTasks(tasks);
            deferred.resolve({ success: true});

            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var tasks = getTasks();
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                if (task.id === id) {
                    tasks.splice(i, 1);
                    break;
                }
            }
            setTasks(tasks);
            deferred.resolve({ success: true });

            return deferred.promise;
        }

        // private functions

        function getTasks() {
            if(!localStorage.tasks){
                localStorage.tasks = JSON.stringify([]);
            }

            return JSON.parse(localStorage.tasks);
        }

        function setTasks(tasks) {
            localStorage.tasks = JSON.stringify(tasks);
        }
    }
})();
