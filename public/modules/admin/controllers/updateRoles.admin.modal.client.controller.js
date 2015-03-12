'use strict';

angular.module('admin').controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'roles', 'len', function($scope, $modalInstance, roles, len) {
  $scope.userroles = roles;
  $scope.NoOfUser = len;
  console.log(len);
  $scope.roles = [
    {
      'roleType': 'admin',
      'checked': false,
      'isAdmin': false
    },
    {
      'roleType': 'banker',
      'checked': false,
      'isAdmin': false
    },
    {
      'roleType': 'distributor',
      'checked': false,
      'isAdmin': false
    }
  ];

  if(len === 1) {
    for(var i=0; i < $scope.userroles.length;i++) {
      for(var j=0; j< $scope.roles.length; j++) {
        if($scope.userroles[i].roleType === $scope.roles[j].roleType) {
          if($scope.userroles[i].isAdmin === true) {
            $scope.roles[j].isAdmin = $scope.userroles[i].isAdmin;
          }
          $scope.roles[j].count = $scope.userroles[i].count;
          $scope.roles[j].checked = true;
        }
      }
    }
  } else {
    for(var x=0; x < $scope.userroles.length;x++) {
      for(var y=0; y< $scope.roles.length; y++) {
        if($scope.userroles[x].roleType === $scope.roles[y].roleType) {
          if($scope.userroles[x].isAdmin === true) {
            $scope.roles[y].isAdmin = $scope.userroles[x].isAdmin;
          }
          $scope.roles[y].count = $scope.userroles[x].count;
          if($scope.roles[y].count < $scope.userroles.length) {
            $scope.roles[y].checked = false;
          } else {
            $scope.roles[y].checked = true;
          }
        }
      }
    }
  }
console.log($scope.roles);
  $scope.ok = function () {
    $modalInstance.close($scope.roles);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);