(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddTaskController', AddTaskController);

    AddTaskController.$inject = ['TaskService', '$location', '$rootScope', 'FlashService'];
    function AddTaskController(TaskService, $location, $rootScope, FlashService) {
        var tm = this;

        tm.addTask = addTask;

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
    }

})();
