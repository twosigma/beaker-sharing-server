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
    var M_bkCodeCell = angular.module('M_bkCodeCell_static', [
        'M_bkCodeCellOutput_static'
    ]);

    M_bkCodeCell.directive('codeCell', function () {
        return {
            restrict: 'E',
            template: '<div>' +
                '<div class="bkcell" ng-show="isShowInput()">' +
                '<textarea ng-model="cellmodel.input.body"></textarea>' +
                '</div>' +
                '<div class="bkcell" ng-show="isShowOutput()">' +
                '<bk-code-cell-output></bk-code-cell-output>' +
                '</div>' +
                '</div>',
            scope: {cellmodel: "=", viewmodel: "=", evviewmodel: "=", notebookmodel: "="},
            controller: function ($scope) {
                $scope.isShowInput = function () {
                    if ($scope.cellmodel.input.hidden === true
                        || ($scope.notebookmodel && $scope.notebookmodel.locked)) {
                        return false;
                    }
                    return true;
                };
                $scope.isShowOutput = function () {
                    if ($scope.cellmodel.output.hidden === true) {
                        return false;
                    }
                    var result = $scope.cellmodel.output.result;
                    if (result && result.hidden === true) {
                        return false;
                    }
                    return !(result === undefined || result === null);
                };
                if (!$scope.viewmodel && $scope.evviewmodel) {
                    $scope.viewmodel = $scope.evviewmodel[$scope.cellmodel.evaluator];
                }
                if (!$scope.viewmodel) {
                    $scope.viewmodel = {
                        cm: {
                            "background": "#E0FFE0",
                            "mode": "groovy"
                        }
                    };
                }
            },
            link: function (scope, element, attrs) {
                var cm = CodeMirror.fromTextArea(element.find("textarea")[0], {
                    mode: scope.viewmodel.cm.mode,
                    lineNumbers: true,
                    matchBrackets: true,
                    onKeyEvent: function (cm, e) {
                    },
                    extraKeys: {},
                    readOnly: true
                });
                $(cm.getWrapperElement()).css("background", scope.viewmodel.cm.background);
                cm.setValue(scope.cellmodel.input.body);
            }
        }
    });
})();
