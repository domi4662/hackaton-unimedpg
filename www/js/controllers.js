angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $http.get('sample_users.json').success(function(data) {
      $scope.users = data;
  });

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };  
})

.controller('RelatorioCtrl', function($scope) {
  $scope.calcularNPS = function(){
    var num_aval = $scope.users.length;
    var promotores = $scope.users.filter(function(user) { return user.nota >= 9; } );
    var detratores = $scope.users.filter(function(user) { return user.nota <= 6; } );

    var p_promotor = (promotores.length/num_aval)*100;
    var p_detrator = (detratores.length/num_aval)*100;

    var nps = parseInt(p_promotor - p_detrator);
    $scope.nota_nps = nps;
  }  
})

.controller('AvaliacaoCtrl', function($scope, $stateParams, $http, $timeout) {
  console.log("Avaliacao controller");
  $scope.userData = {};

  $scope.ruler_1 = [
    {label: 0, color: "#cccccc"},
    {label: 1, color: "#fa5562"},
    {label: 2, color: "#fb6672"},
    {label: 3, color: "#fa834f"},
    {label: 4, color: "#fb9062"},
    {label: 5, color: "#fbcf3f"}
  ];

  $scope.ruler_2 = [        
    {label: 6, color: "#fcd558"},
    {label: 7, color: "#9fd77a"},
    {label: 8, color: "#8bcf5e"},
    {label: 9, color: "#6bca6c"},
    {label: 10, color: "#52c153"},
  ];  

  $scope.enviarAvaliacao = function(){
    $scope.userData.mes = 11; 
    $scope.users.push($scope.userData);
    
    $timeout(function() {
      $scope.userData = {};
      $scope.userData.submitted = false;
    }, 2000);    
  }
})

.controller('AuthCtrl', function($scope, $stateParams, $state, $timeout, $location) {
  console.log("Auth controller");
  $scope.loginData = {};
  $scope.loginData.error = false;

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {    

    if($scope.users.some(function (user) { return user.username === $scope.loginData.username; } )) {
      if($scope.users.some(function (user) { return user.password === $scope.loginData.password; } )) {
        $scope.loginData = {};
        $location.path("app/nova-aval");
      } else {
        console.log("login invalido");
        $scope.loginData.error = true;
      }
    } else {
      console.log("login invalido");
      $scope.loginData.error = true;
    }    
  };

})

.controller('AnalyticsCtrl', function($scope) {
  console.log("Analytics Controlller");  
  var nps = false;

  $scope.config = {
    title: 'Avaliaçoes por mês',
    tooltips: true,
    labels: false,
    mouseover: function() {},
    mouseout: function() {},
    click: function() { nps = !nps; $scope.data.series.length ? $scope.setDataChart(nps, []) : $scope.setDataChart(nps, ['0-6', '7-8', '9-10']); },
    legend: {
      display: true,
      //could be 'left, right'
      position: 'right'
    }
  };

  function calcularNPS(notas){
    var num_aval = notas.length;
    var promotores = notas.filter(function(nota) { return nota >= 9; } );
    var detratores = notas.filter(function(nota) { return nota <= 6; } );

    var p_promotor = (promotores.length/num_aval)*100;
    var p_detrator = (detratores.length/num_aval)*100;

    var nps = parseInt(p_promotor - p_detrator);
    $scope.nota_nps = nps;

    return nps;
  } 

  function getNotasByMonth(mes, nps){
    var dados = [];
    var notas = $scope.users.filter(
      function(data) { 
        return data.mes == mes; 
    }).map(
      function(data) {
        return data.nota;
    });

    if(!nps){
      $scope.config.title = 'Avaliaçoes por mês';
      dados[0] = notas.filter(function(nota) { return nota >= 9; } ).length;
      dados[1] = notas.filter(function(nota) { return nota == 7 || nota == 8; } ).length;
      dados[2] = notas.filter(function(nota) { return nota <= 6; } ).length;
    } else {
      $scope.config.title = 'NPS por mês';
      dados[0] = calcularNPS(notas);
    }   
    
    return dados;    
  }  

  $scope.setDataChart = function (nps, series) {

    $scope.data = {
     colours: [{ // default
        "fillColor": "rgba(224, 108, 112, 1)",
        "strokeColor": "rgba(207,100,103,1)",
        "pointColor": "rgba(220,220,220,1)",
        "pointStrokeColor": "#fff",
        "pointHighlightFill": "#fff",
        "pointHighlightStroke": "rgba(151,187,205,0.8)"
      }],
      series: series,   
      data: [{
        x: "Jan",
        y: getNotasByMonth(1,nps)      
      }, {
        x: "Fev",
        y: getNotasByMonth(2,nps)
      }, {
        x: "Mar",
        y: getNotasByMonth(3,nps)
      }, {
        x: "Abr",
        y: getNotasByMonth(4,nps)
      },
      {
        x: "Mai",
        y: getNotasByMonth(5,nps)
      },
      {
        x: "Jun",
        y: getNotasByMonth(6,nps)
      },
      {
        x: "Jul",
        y: getNotasByMonth(7,nps)
      },
      {
        x: "Ago",
        y: getNotasByMonth(8,nps)
      },
      {
        x: "Set",
        y: getNotasByMonth(9,nps)
      },
      {
        x: "Out",
        y: getNotasByMonth(10,nps)
      },
      {
        x: "Nov",
        y: getNotasByMonth(11,nps)
      },
      {
        x: "Dez",
        y: getNotasByMonth(12,nps)
      }]
    };  
  }

});
