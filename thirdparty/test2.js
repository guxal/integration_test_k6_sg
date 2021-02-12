/**
 * run this script with k6
 * cat script.js | docker run --rm -i loadimpact/k6 run -
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { payload } from './payload.js'


const data = JSON.parse(open(`./${__ENV.JSON}.json`));


export function no_type() {
    var url = data.url;
    var params = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjE1QWpwZGpCTHVyZjkwajhQWm9zUFVzU0l6WSIsImtpZCI6IjE1QWpwZGpCTHVyZjkwajhQWm9zUFVzU0l6WSJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwMC9yZXNvdXJjZXMiLCJleHAiOjE2MTE2NDg5MzEsIm5iZiI6MTYxMDkyODkzMSwiY2xpZW50X2lkIjoiU2lpZ29XZWIiLCJzY29wZSI6WyJvZmZsaW5lX2FjY2VzcyIsIldlYkFwaSJdLCJzdWIiOiIyNTAiLCJhdXRoX3RpbWUiOjE2MTA5Mjg5MzEsImlkcCI6Imlkc3J2IiwibmFtZSI6ImFwaUBqb21hcy5jb20iLCJtYWlsX3NpaWdvIjoiYXBpQGpvbWFzLmNvbSIsImNsb3VkX3RlbmFudF9jb21wYW55X2tleSI6ImpvbWFzIiwidXNlcnNfaWQiOiIzMCIsInRlbmFudF9pZCI6IjB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAyNTciLCJ1c2VyX2xpY2Vuc2VfdHlwZSI6IjUiLCJwbGFuX3R5cGUiOiI1IiwidGVuYW50X3N0YXRlIjoiMSIsImFtciI6WyJwYXNzd29yZCJdfQ.Y27G8fwelpdb-2wD2v-dyfPpNdybLuq_AKg7yCq-8Ztel_IV3xBusVbPTzkqOuCcLnaMf9VKEwSKiGIRQUFDgHC3JqfZM5-S5rZocCISEj7Z6NsyS_5tPfbCkyh_86eEVio6fxHv42LmOmhLPJqKesKs9GHwKTbkr5tR2T6WUwmvwDzlt8x-xop92__Ht6UvSoL5XGKrJgfPDnhbKZP7ipHzCEHsk07Rm1iy4jaxi-9I5zATYtke-TV7L4iF1__Ofp_OP8xxPi4mrmcX5lqm2z4oJYy5vXgNAWUI2vs1vqNmc20VI0Oo3DcxIiJeUprnCxlDwOeeTPs9rVF9i9EeJA'
      },
    };

    var obj = payload(data.body);
    // set null identification
    obj.type = "";
  
    let res =  http.post(url, JSON.stringify(obj), params);
    console.log(res.body);
    // console.log(JSON.stringify(res));

    // console.log(JSON.stringify(res, null, 2));
    // console.log(JSON.parse(res.body).Errors[0].Code);

    check(res, { 'status was 400 no type' : (r) => r.status == 400 });

    check(res, { 'error code was parameters_exclusive' : (r) => JSON.parse(r.body).Errors[0].Code == "parameters_exclusive"});
    // message
    check(res, { 'error message was identification is invalid' : (r) => JSON.parse(r.body).Errors[0].Message == "Invalid value for parameter: type" });
    // params
    check(res, { 'error params was type in index 0' : (r) => JSON.parse(r.body).Errors[0].Params[0] == "type" });
    // detail
    check(res, { 'error detail was url documentacion parameters_exclusive' : (r) => JSON.parse(r.body).Errors[0].Detail == "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/parameters_exclusive" });

}

export default function() {
    no_type();
}