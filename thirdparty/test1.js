/**
 * run this script with k6
 * cat script.js | docker run --rm -i loadimpact/k6 run -
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { payload } from './payload.js'
import { auth } from './auth.js'
import { group } from 'k6';

const data = JSON.parse(open(`./${__ENV.JSON}.json`));

export function no_autorize() {
  var url = data.url;
  var params = {
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjE1QWpwZGpCTHVyZjkwajhQWm9zUFVzU0l6WSIsImtpZCI6IjE1QWpwZGpCTHVyZjkwajhQWm9zUFVzU0l6WSJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwMC9yZXNvdXJjZXMiLCJleHAiOjE2MTE2NDg5MzEsIm5iZiI6MTYxMDkyODkzMSwiY2xpZW50X2lkIjoiU2lpZ29XZWIiLCJzY29wZSI6WyJvZmZsaW5lX2FjY2VzcyIsIldlYkFwaSJdLCJzdWIiOiIyNTAiLCJhdXRoX3RpbWUiOjE2MTA5Mjg5MzEsImlkcCI6Imlkc3J2IiwibmFtZSI6ImFwaUBqb21hcy5jb20iLCJtYWlsX3NpaWdvIjoiYXBpQGpvbWFzLmNvbSIsImNsb3VkX3RlbmFudF9jb21wYW55X2tleSI6ImpvbWFzIiwidXNlcnNfaWQiOiIzMCIsInRlbmFudF9pZCI6IjB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAyNTciLCJ1c2VyX2xpY2Vuc2VfdHlwZSI6IjUiLCJwbGFuX3R5cGUiOiI1IiwidGVuYW50X3N0YXRlIjoiMSIsImFtciI6WyJwYXNzd29yZCJdfQ.Y27G8fwelpdb-2wD2v-dyfPpNdybLuq_AKg7yCq-8Ztel_IV3xBusVbPTzkqOuCcLnaMf9VKEwSKiGIRQUFDgHC3JqfZM5-S5rZocCISEj7Z6NsyS_5tPfbCkyh_86eEVio6fxHv42LmOmhLPJqKesKs9GHwKTbkr5tR2T6WUwmvwDzlt8x-xop92__Ht6UvSoL5XGKrJgfPDnhbKZP7ipHzCEHsk07Rm1iy4jaxi-9I5zATYtke-TV7L4iF1__Ofp_OP8xxPi4mrmcX5lqm2z4oJYy5vXgNAWUI2vs1vqNmc20VI0Oo3DcxIiJeUprnCxlDwOeeTPs9rVF9i9EeJA'
    },
  };
  let res =  http.post(url, null, params);

  check(res, { 'status was 401 unautorize' : (r) => r.status == 401 });
}

export function no_identification() {
    var url = data.url;
    var obj = payload(data.body);
    // set null identification
    obj.identification = "";
  
    let res =  http.post(url, JSON.stringify(obj), auth());
    // console.log(res.body);
    // console.log(JSON.stringify(res));
    // console.log(JSON.stringify(res, null, 2));
    // console.log(JSON.parse(res.body).Errors[0].Code);

    check(res, { 'status was 400 no identification' : (r) => r.status == 400 });

    check(res, { 'error code was parameter_required' : 
    (r) => JSON.parse(r.body).Errors[0].Code == "parameter_required"});
    // message
    check(res, { 'error message was identification is required' : 
    (r) => JSON.parse(r.body).Errors[0].Message == 
    "The field identification is required" });
    // params
    check(res, { 'error params was identification in index 0' : 
    (r) => JSON.parse(r.body).Errors[0].Params[0] == "identification" });
    // detail
    check(res, { 'error detail was url documentacion parameter_required' : 
    (r) => JSON.parse(r.body).Errors[0].Detail == 
    "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/parameter_required" });
}


export function null_identification() {
  var url = data.url;
  var obj = payload(data.body);
  // set null identification
  obj.identification = null;

  let res =  http.post(url, JSON.stringify(obj), auth());
  // console.log(res.body);
  // console.log(JSON.stringify(res));
  // console.log(JSON.stringify(res, null, 2));
  // console.log(JSON.parse(res.body).Errors[0].Code);

  check(res, { 'status was 400 no identification' : (r) => r.status == 400 });

  check(res, { 'error code was parameter_required' : 
  (r) => JSON.parse(r.body).Errors[0].Code == "parameter_required"});
  // message
  check(res, { 'error message was identification is required' : 
  (r) => JSON.parse(r.body).Errors[0].Message == 
  "The field identification is required" });
  // params
  check(res, { 'error params was identification in index 0' : 
  (r) => JSON.parse(r.body).Errors[0].Params[0] == "identification" });
  // detail
  check(res, { 'error detail was url documentacion parameter_required' : 
  (r) => JSON.parse(r.body).Errors[0].Detail == 
  "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/parameter_required" });
}

export function no_field_identification() {
  var url = data.url;
  var obj = payload(data.body);
  // set null identification
  delete obj.identification;

  let res =  http.post(url, JSON.stringify(obj), auth());
  // console.log(res.body);
  // console.log(JSON.stringify(res));
  // console.log(JSON.stringify(res, null, 2));
  // console.log(JSON.parse(res.body).Errors[0].Code);

  check(res, { 'status was 400 no identification' : (r) => r.status == 400 });

  check(res, { 'error code was parameter_required' : 
  (r) => JSON.parse(r.body).Errors[0].Code == "parameter_required"});
  // message
  check(res, { 'error message was identification is required' : 
  (r) => JSON.parse(r.body).Errors[0].Message == 
  "The field identification is required" });
  // params
  check(res, { 'error params was identification in index 0' : 
  (r) => JSON.parse(r.body).Errors[0].Params[0] == "identification" });
  // detail
  check(res, { 'error detail was url documentacion parameter_required' : 
  (r) => JSON.parse(r.body).Errors[0].Detail == 
  "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/parameter_required" });
}

export function invalid_identification() {
  var url = data.url;
  var obj = payload(data.body);
  // set null identification
  obj.identification = "%%%%%%%%%";

  let res =  http.post(url, JSON.stringify(obj), auth());
  console.log(res.body);
  // console.log(JSON.stringify(res));
  // console.log(JSON.stringify(res, null, 2));
  // console.log(JSON.parse(res.body).Errors[0].Code);

  check(res, { 'status was 400 no identification' : (r) => r.status == 400 });

  check(res, { 'error code was invalid_identification' : 
  (r) => JSON.parse(r.body).Errors[0].Code == "invalid_identification"});
  // message
  check(res, { 'error message was identification is invalid' : 
  (r) => JSON.parse(r.body).Errors[0].Message == 
  "Invalid identification: %%%%%%%%%" });
  // params
  check(res, { 'error params was identification in index 0' : 
  (r) => JSON.parse(r.body).Errors[0].Params[0] == "identification" });
  // detail
  check(res, { 'error detail was url documentacion invalid_identification' : 
  (r) => JSON.parse(r.body).Errors[0].Detail == 
  "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_identification" });
}

export function max_length_identification() {
  var url = data.url;
  var obj = payload(data.body);
  // set null identification
  obj.identification = "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";

  let res =  http.post(url, JSON.stringify(obj), auth());
  console.log(res.body);
  // console.log(JSON.stringify(res));
  // console.log(JSON.stringify(res, null, 2));
  // console.log(JSON.parse(res.body).Errors[0].Code);

  check(res, { 'status was 400 no identification' : (r) => r.status == 400 });

  check(res, { 'error code was length_max' : 
  (r) => JSON.parse(r.body).Errors[0].Code == "length_max"});
  // message
  check(res, { 'error message was identification is maximum length' : 
  (r) => JSON.parse(r.body).Errors[0].Message == 
  "The field identification only allows a maximum length of 50 characters" });
  // params
  check(res, { 'error params was identification in index 0' : 
  (r) => JSON.parse(r.body).Errors[0].Params[0] == "identification" });
  // detail
  check(res, { 'error detail was url documentacion length_max' : 
  (r) => JSON.parse(r.body).Errors[0].Detail == 
  "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/length_max" });
}

export default function() {
  group('unautorize', function () {
    no_autorize();
  });

  group('identification', function () {

    group('no identification', function () {
      no_identification();
    });

    group('null identification', function() {
      null_identification();
    });

    group('no field identification', function() {
      no_field_identification();
    });

    group('invalid identification', function() {
      invalid_identification();
    });

    group('max length identification', function() {
      max_length_identification();
    });

  }); 
}