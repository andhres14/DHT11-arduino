const app = angular.module('simpleSocketApp', [ 'btford.socket-io', 'chart.js' ]);

app.service('SocketService', [ 'socketFactory', function SocketService(socketFactory) {
    return socketFactory({
        ioSocket: io.connect('http://localhost:3000')
    });
} ]);

app.controller('homeController', function ($scope, SocketService, $timeout) {

    $scope.humidity = 0;
    $scope.temperature = 0;

    SocketService.emit('room', { roomId: "temp" });

    SocketService.on('fromNode', function (msg) {
        let data = JSON.parse(msg);
        $scope.humidity = data.humidity;
        $scope.temperature = data.temperature;

        let date = moment().format('hh:mm:ss A');
        $scope.labels.push(date);
        $scope.data[0].push(data.humidity);

        $scope.data[1].push(data.temperature);

    });

    // info grafica
    $scope.labels = [];
    $scope.series = [ 'Humedad reportada', 'Temperatura' ];
    $scope.data = [ [], [] ];
    $scope.colors = ["#4793ff", "#ff6e6e"];
    $scope.options = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 100
                },
            }],
        },
    };
});
