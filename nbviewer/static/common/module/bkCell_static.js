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
    var M_bkCell = angular.module('M_bkCell_static', [
        'M_commonUI',
        'M_bkCodeCell_static',
        'M_bkNotebookCellModelManager'
    ]);
    M_bkCell.directive('bkCell', function () {
        return {
            restrict: 'E',
            template: '<div class="bkcell">' +
                '<div ng-include="getTypeCellUrl()"></div>' +
                '</div>',
            scope: {
                cellmodel: "=",
                viewmodel: "=",
                notebookmodel: "=",
                evviewmodel: "="
            },
            controller: function ($scope) {
                $scope.getNestedLevel = function () {
                    // bkCell is using isolated scope, $scope is the isolated scope
                    // $scope.$parent is the scope resulted from ng-repeat (ng-repeat creates a prototypal scope for each ng-repeated item)
                    // $Scope.$parent.$parent is the container cell(which initiates ng-repeat) scope
                    return ($scope.$parent.$parent && $scope.$parent.$parent.getNestedLevel) ? $scope.$parent.$parent.getNestedLevel() + 1 : 1;
                };
                $scope.getParentID = function () {
                    return $scope.$parent.$parent.cellmodel ? $scope.$parent.$parent.cellmodel.id : 'root';
                };
                $scope.getTypeCellUrl = function () {
                    var type = $scope.cellmodel.type;
                    return type + "Cell.html";
                };
            }
        };
    });

    M_bkCell.directive('sectionCell', function (bkNotebookCellModelManager) {
        return {
            restrict: 'E',
            template: "<div ng-hide='cellmodel.hideTitle'>" +
                "<img ng-src='/static/common/img/plus.png'  ng-click='toggleShowChildren()' ng-hide='isShowChildren()'>" +
                "<img ng-src='/static/common/img/minus.png' ng-click='toggleShowChildren()' ng-show='isShowChildren()'>" +
                "<span class='section{{cellmodel.level}} bk-section-title'>{{cellmodel.title}}</span>" +
                "</div>" +
                "<div bk-show='isShowChildren()'>" +
                "<bk-cell ng-repeat='cell in getChildren()' cellmodel='cell' viewmodel='viewmodel' notebookmodel='notebookmodel' evviewmodel='evviewmodel' ng-animate=\"{enter: 'wave-enter', leave: 'wave-leave'}\"></bk-cell>" +
                "</div>",
            //scope: { cell: "=" },
            controller: function ($scope) {
                $scope.cellview = {};
                $scope.cellview.showChildren = true;
                $scope.toggleShowChildren = function () {
                    $scope.cellmodel.collapsed = !$scope.cellmodel.collapsed;
                };
                $scope.isShowChildren = function () {
                    return !$scope.cellmodel.collapsed;
                };
                $scope.getChildren = function () {
                    return bkNotebookCellModelManager.getChildren($scope.cellmodel.id);
                };
            }
        };
    });

    M_bkCell.directive('textCell', function () {
        return {
            restrict: 'E',
            template: "<div></div>",
            link: function (scope, element, attrs) {
                var titleElement = $(element.find("div").first());
                element.find('div').html(scope.cellmodel.body);
            }
        };
    });

    M_bkCell.directive('markdownCell', function () {
        return {
            restrict: 'E',
            template: "<div></div>",
            controller: function ($scope) {
            },
            link: function (scope, element, attrs) {
                var div = element.find("div").first().get()[0];
                var options = {
                    basePath: '/static/vendor/epiceditor',
                    container: div,
                    file: {
                        defaultContent: scope.cellmodel.body
                    },
                    clientSideStorage: false,
                    autogrow: {
                        minHeight: 50,
                        maxHeight: false,
                        scroll: true
                    }
                };
                var editor = new EpicEditor(options).load();
                if (scope.cellmodel.mode === "preview") {
                    setTimeout(function () {
                        editor.preview();
                    }, 1000);
                }
            }
        };
    });
})();
