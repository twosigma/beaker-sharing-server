/*
 *  Copyright 2014 TWO SIGMA INVESTMENTS, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
(function () {
    // this module take a cellmodel(of code cell) plus some additional view info
    // and display it without a server (hence static).

    var bkStaticOutputDisplay = angular.module('M_bkCodeCellOutput_static', [
        'M_bkChart_static',
        'M_bkImage_static',
        'M_bkTable_static',
        'M_latexDisplay_static'
    ]);

    bkStaticOutputDisplay.directive('bkOutputDisplay', function () {
        return {
            restrict: 'E',
            scope: {
                type: "=", // optional
                model: "=",
                showSeparator: "@"
            },
            template: '<hr ng-if="showSeparator" /><div ng-include="getType()"></div>',
            controller: function ($scope, outputDisplayFactory) {
                var getDefaultType = function (model) {
                    var display = outputDisplayFactory.getApplicableDisplays(model)[0];
                    if (display === "BeakerDisplay") {
                        if (model) {
                            return "bko" + model.innertype + ".html";
                        } else {
                            return "bkoHidden.html";
                        }
                    } else {
                        return "bko" + display + ".html";
                    }
                };
                $scope.getType = function () {
                    if ($scope.type) {
                        return "bko" + $scope.type + ".html";
                    } else {
                        return getDefaultType($scope.model);
                    }
                };
            }
        };
    });

    bkStaticOutputDisplay.directive('bkCodeCellOutput', function () {
        return {
            restrict: "E",
            template: '<bk-output-display model="getOutputDisplayModel()" type="getOutputDisplayType()" show-separator="false"></bk-output-display>',
            controller: function ($scope, outputDisplayFactory) {
                $scope.getOutputDisplayType = function () {
                    var display = $scope.viewmodel.display;
                    if (!display) {
                        display = outputDisplayFactory.getApplicableDisplays($scope.cellmodel.output.result)[0];
                    }
                    if (display === "BeakerDisplay") {
                        return $scope.cellmodel.output.result.innertype;
                    } else {
                        return display;
                    }
                };
                $scope.getOutputDisplayModel = function () {
                    var display = $scope.viewmodel.display;
                    if (!display) {
                        display = outputDisplayFactory.getApplicableDisplays($scope.cellmodel.output.result)[0];
                    }
                    if (display === "BeakerDisplay") {
                        return $scope.cellmodel.output.result.object;
                    } else {
                        return $scope.cellmodel.output.result;
                    }
                };
            }
        };
    });

    bkStaticOutputDisplay.factory('outputDisplayFactory', function () {
        var resultType2DisplayTypesMap = {
            // The first in the array will be used as default
            "text": ["Text", "Html", "Latex"],
            "TableDisplay": ["Table", "DataTables", "Text"],
            "html": ["Html"],
            "ImageIcon": ["Image", "Text"],
            "BeakerDisplay": ["BeakerDisplay", "Text"],
            "Plot": ["Chart", "Text"],
            "TimePlot": ["Chart", "Text"],
            "HiddenOutputCell": ["Hidden"],
            "Warning": ["Warning"],
            "BeakerOutputContainerDisplay": ["OutputContainer", "Text"],
            "OutputContainerCell": ["OutputContainer", "Text"]
        };

        var isJSON = function (value) {
            var ret = true;
            try {
                JSON.parse(value);
            } catch (err) {
                ret = false;
            }
            return ret;
        };

        var isHTML = function (value) {
            return /<[a-z][\s\S]*>/i.test(value);
        };

        // TODO: think how to dynamically add more display types
        return {
            getApplicableDisplays: function (result) {
                if (!result) {
                    return ["Text"];
                }
                if (!result.type) {
                    var ret = ["Text", "Html", "Latex"];
                    if (isJSON(result)) {
                        //ret.splice(0, 0, "JSON", "Vega");
                        ret.push("JSON", "Vega");
                    }
                    if (isHTML(result)) {
                        ret = ["Html", "Text", "Latex"];
                    }
                    if (_.isArray(result)) {
                        if (_.isObject(result[0])) {
                            ret.push("Table");
                        }
                    }
                    return ret;
                }
                if (resultType2DisplayTypesMap.hasOwnProperty(result.type)) {
                    return resultType2DisplayTypesMap[result.type];
                } else {
                    return ["Text"];
                }
            }
        };
    });

    bkStaticOutputDisplay.directive('bkoText', function () {
        return {
            restrict: "E",
            template: "<pre>{{getText()}}</pre>",
            controller: function ($scope) {
                $scope.getText = function () {
                    if ($scope.model && $scope.model.text) {
                        return $scope.model.text;
                    } else {
                        return $scope.model;
                    }
                };
            }
        };
    });
    bkStaticOutputDisplay.directive('bkoWarning', function () {
        return {
            restrict: "E",
            template: "<pre class='out_warning'>{{model.message}}</pre>"
        };
    });
    bkStaticOutputDisplay.directive('bkoError', function () {
        return {
            restrict: "E",
            template: "<pre class='out_error' ng-hide='expanded'>" +
                "<img ng-src='/static/common/img/plus2.png' ng-click='expanded=!expanded' ng-show='model[1]'></img>" +
                "<span></span>" + // first span
                "</pre>" +
                "<pre class='out_error' ng-show='expanded'>" +
                "<img ng-src='/static/common/img/minus2.png' ng-click='expanded=!expanded'></img>" +
                "<span></span>" + // last span
                "</pre>",
            controller: function ($scope, $element) {
                $scope.expanded = false;
                $scope.$watch('model', function () {
                    if (_.isArray($scope.model)) {
                        $element.find('span').first().html($scope.model[0]);
                        $element.find('span').last().html($scope.model[1]);
                    } else {
                        $element.find('span').first().html($scope.model);
                        $element.find('span').last().html("");
                    }
                });
            }
        };
    });
    bkStaticOutputDisplay.directive('bkoHtml', function () {
        return {
            restrict: "E",
            template: "<div></div>",
            link: function (scope, element, attrs) {
                var div = element.find("div").first();
                div.html(scope.model);
            }
        };
    });
    bkStaticOutputDisplay.directive('bkoOutputContainer', function () {
        return {
            restrict: 'E',
            template: '<bk-output-display ng-repeat="m in model.items" model="m" show-separator="{{ $index != 0}}"></bk-output-display>'
        };
    });
})();
