'use strict';

angular.module('admin').controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'roles', 'len', '$timeout', function($scope, $modalInstance, roles, len, $timeout) {
  $scope.NoOfUser = len;
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
  $scope.disableSaveButton = function(isAdmin, checkStatus) {
    $timeout(function() {
      console.log(isAdmin, checkStatus);
      if (checkStatus !== 'indeterminate') {
        $scope.disable = (isAdmin && checkStatus);
      }
    }, 100);
  };

  if(len === 1) {
    for(var i=0; i < roles.length;i++) {
      for(var j=0; j< $scope.roles.length; j++) {
        if(roles[i].roleType === $scope.roles[j].roleType) {
          if(roles[i].isAdmin === true) {
            $scope.roles[j].isAdmin = roles[i].isAdmin;
          }
          $scope.roles[j].count = roles[i].count;
          $scope.roles[j].checked = true;
        }
      }
    }
  } else {
    for(var x=0; x < roles.length;x++) {
      for(var y=0; y< $scope.roles.length; y++) {
        if(roles[x].roleType === $scope.roles[y].roleType) {
          if(roles[x].isAdmin === true) {
            $scope.roles[y].isAdmin = roles[x].isAdmin;
          }
          $scope.roles[y].count = roles[x].count;
          if($scope.roles[y].count < len) {
            $scope.roles[y].checked = 'indeterminate';
          } else {
            $scope.roles[y].checked = true;
          }
        }
      }
    }
  }
  $scope.ok = function () {
    $modalInstance.close($scope.roles);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);