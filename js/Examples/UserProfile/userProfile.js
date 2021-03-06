var userProfileExample = {
    controllerAs: 'vm',
    controller: function (authService) {
        var vm = this;

        vm.profile = {
            email: ''
        };

        vm.authService = authService;

        authService.getProfileDeferred().then(function (profile) {
            console.log(angular.fromJson(profile));
            console.log(angular.isString(profile.email));
            vm.profile = angular.fromJson(profile);
        });
    },
    template: require("raw-loader!./userProfileTemplate.html")

};


angular.module('examples').controller('userProfileExample', userProfileExample);
