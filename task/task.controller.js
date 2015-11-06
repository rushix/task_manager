(function () {
    'use strict';

    angular
        .module('app')
        .controller('TaskController', TaskController);

    TaskController.$inject = ['TaskService', 'UserService', '$location', '$rootScope', '$routeParams', 'FlashService'];
    function TaskController(TaskService, UserService, $location, $rootScope, $routeParams, FlashService) {
        var tm = this;

        tm.addTask = addTask;
	tm.updateTask = updateTask;

	tm.task = null;
	tm.allUsers = [];

	initController();

	function initController() {
	    	loadAllUsers();


		if ($location.path() != "/add-task") {
			loadCurrentTask();
		}	    	    
	}

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    tm.allUsers = users;
                });
        }


        function loadCurrentTask() {
            TaskService.GetById($routeParams.taskId)
                .then(function (task) {
		    task.date = new Date(task.date);
                    tm.task = task;
			console.log($routeParams.taskId);
			console.log(tm.task.title);
                });
        }


        function updateTask() {
            tm.dataLoading = true;
            TaskService.Update(tm.task)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Task updated successfuly', true);
                        $location.path('/');
                    } else {
                        FlashService.Error(response.message);
                        tm.dataLoading = false;
                    }
                });
        }


        function addTask() {
            tm.dataLoading = true;
            TaskService.Create(tm.task)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Task created successfuly', true);
                        $location.path('/');
                    } else {
                        FlashService.Error(response.message);
                        tm.dataLoading = false;
                    }
                });
        }

	tm.priorities = [
    	    { code: "low", name: "low" },
            { code: "high", name: "high" }
        ];

	tm.periods = [
    	    { code: "1 day", name: "1 day" },
            { code: "2 days", name: "2 days" },
            { code: "3 days", name: "3 days" },
            { code: "4 days", name: "4 days" },
            { code: "5 days", name: "5 days" }
        ];

	tm.statuses = [
	    { code: "open", name: "open"},
	    { code: "in progress", name: "in progress"},
	    { code: "closed", name: "closed"}
	];

    }

})();
