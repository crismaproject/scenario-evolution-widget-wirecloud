angular.module(
    'de.cismet.crisma.widgets.scenarioEvolutionWidgetWirecloud',
    [
        'de.cismet.crisma.widgets.scenarioEvolutionWidget',
        'de.cismet.crisma.ICMM.Worldstates'
    ]
).controller(
    'de.cismet.crisma.widgets.scenarioEvolutionWidgetWirecloud.wire',
    [
        '$scope',
        'de.cismet.crisma.ICMM.Worldstates',
        'DEBUG',
        function (
            $scope,
            Worldstates,
            DEBUG
        ) {
            'use strict';

            var mashupPlatform, setActiveWSWirecloud;

            if (typeof MashupPlatform === 'undefined') {
                if (DEBUG) {
                    console.log('mashup platform not available');
                }
            } else {
                // enable minification
                mashupPlatform = MashupPlatform;

                $scope.activeWS = {};
                $scope.changeWS = {};

                $scope.$watch('changeWS', function (n, o) {
                    var doSet;

                    doSet = function (n, o) {
                        var id;

                        if (n && o && n.id && o.id && n.id === o.id) {
                            // not rethrowing in case of same object set twice
                            return;
                        }

                        if (DEBUG) {
                            console.log('BEGIN: pushing active worldstate event: ' + n);
                        }

                        id = -1;

                        if (n && n.id) {
                            id = n.id;
                        }

                        $scope.activeWS = n;

                        if (DEBUG) {
                            console.log('DO: pushing active worldstate event: ' + id);
                        }

                        mashupPlatform.wiring.pushEvent('getActiveWorldstate', id.toString());

                        if (DEBUG) {
                            console.log('DONE: pushing active worldstate event: ' + id);
                        }
                    };

                    if (n) {
                        if (n.$resolved) {
                            doSet(n, o);
                        } else if (n.$promise) {
                            n.$promise.then(function () {doSet(n, o); });
                        } else {
                            doSet(n, 0);
                        }
                    }
                });

                setActiveWSWirecloud = function (newActiveWs) {
                    var setWs;

                    if (DEBUG) {
                        console.log('BEGIN: receiving active worldstate event: ' + newActiveWs);
                    }

                    setWs = function (ws) {
                        if (DEBUG) {
                            console.log('DO: receiving active worldstate event: ' + ws);
                        }

                        $scope.activeWS = ws;

                        if (DEBUG) {
                            console.log('DONE: receiving active worldstate event: ' + ws);
                        }
                    };

                    if (newActiveWs) {
                        try {
                            Worldstates.get({wsId: newActiveWs}).$promise.then(function (ws) {
                                setWs(ws);
                            });
                        } catch (e) {
                            if (DEBUG) {
                                console.log(e);
                            }
                            setWs({});
                        }
                    } else {
                        setWs({});
                    }
                };

                mashupPlatform.wiring.registerCallback('setActiveWorldstate', setActiveWSWirecloud);
            }
        }
    ]
).config(
    [
        '$provide',
        function ($provide) {
            'use strict';

            var mashupPlatform;

            if (typeof MashupPlatform === 'undefined') {
                console.log('mashup platform not available');
            } else {
                // enable minification
                mashupPlatform = MashupPlatform;
                $provide.constant('DEBUG', mashupPlatform.prefs.get('DEBUG'));
                $provide.constant('CRISMA_DOMAIN', mashupPlatform.prefs.get('CRISMA_DOMAIN'));
                $provide.constant('CRISMA_ICMM_API', mashupPlatform.prefs.get('CRISMA_ICMM_API'));
            }
        }
    ]
);
