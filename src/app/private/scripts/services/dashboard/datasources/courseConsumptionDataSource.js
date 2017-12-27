/**
 * @author Nilesh More <nilesh_m@tekditechnologies.com>
 */

'use strict'

angular.module('playerApp')
  .service('courseConsumptionService', ['$q', '$rootScope', 'config', 'httpAdapter', 'toasterService',
    'dashboardService', function ($q,
      $rootScope, config, httpAdapter, toasterService, dashboardService) {
    /**
     * @method getData
     * @desc get course consumption dashboard data
     * @memberOf Services.courseConsumptionService
     * @param {Object}  req - Request object
     * @param {string}  datasetType - Data set type
     * @param {object} headers headers
     * @returns promise
     * @instance
     */
      this.getData = function (req, url, headers) {
        var URL = config.URL.BASE_PREFIX + config.URL.LEARNER_PREFIX + url + '/' +
      req.courseId + '?period=' + req.timePeriod
        var deferred = $q.defer()
        var response = httpAdapter.httpCall(URL, '', 'GET', headers)
        response.then(function (res) {
          if (res && res.responseCode === 'OK') {
            var numericData = []
            angular.forEach(res.result.snapshot, function (numericData, key) {
              if (key !== 'course.consumption.users_completed') {
                dashboardService.secondsToMin(numericData)
              }
              numericData.push(numericData)
            })
            var returnData = {apiResponse: res.result, numericData: numericData}
            deferred.resolve(returnData)
          } else {
            toasterService.error($rootScope.messages.fmsg.m0075)
            deferred.reject(res)
          }
        }, function (err) {
          toasterService.error($rootScope.messages.emsg.m0005)
          deferred.reject(err)
        })
        return deferred.promise
      }
    }])
