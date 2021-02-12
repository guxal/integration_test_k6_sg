/**
 * run this script with k6
 * cat script.js | docker run --rm -i loadimpact/k6 run -
 */

import http from 'k6/http';
import { check, sleep } from 'k6';


// export let options = {
//   vus: 2,
//   iterations: 10,
// };

const data = JSON.parse(open(`./${__ENV.JSON}.json`));

// console.log(JSON.stringify(data));
export default function () {

  var url = data.url;

  function payload(d)
  {
    let identification = Math.floor(Math.random() * 1000000000);
    // let random = randomDate(new Date(2012, 0, 1), new Date());
    console.log(identification);
    // console.log(d)
    // d.identification = identification;
    console.log(JSON.stringify(d));
    return d;
  }
  console.log(url)
  var params = {
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjE1QWpwZGpCTHVyZjkwajhQWm9zUFVzU0l6WSIsImtpZCI6IjE1QWpwZGpCTHVyZjkwajhQWm9zUFVzU0l6WSJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwMC9yZXNvdXJjZXMiLCJleHAiOjE2MTE2NDg5MzEsIm5iZiI6MTYxMDkyODkzMSwiY2xpZW50X2lkIjoiU2lpZ29XZWIiLCJzY29wZSI6WyJvZmZsaW5lX2FjY2VzcyIsIldlYkFwaSJdLCJzdWIiOiIyNTAiLCJhdXRoX3RpbWUiOjE2MTA5Mjg5MzEsImlkcCI6Imlkc3J2IiwibmFtZSI6ImFwaUBqb21hcy5jb20iLCJtYWlsX3NpaWdvIjoiYXBpQGpvbWFzLmNvbSIsImNsb3VkX3RlbmFudF9jb21wYW55X2tleSI6ImpvbWFzIiwidXNlcnNfaWQiOiIzMCIsInRlbmFudF9pZCI6IjB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAyNTciLCJ1c2VyX2xpY2Vuc2VfdHlwZSI6IjUiLCJwbGFuX3R5cGUiOiI1IiwidGVuYW50X3N0YXRlIjoiMSIsImFtciI6WyJwYXNzd29yZCJdfQ.Y27G8fwelpdb-2wD2v-dyfPpNdybLuq_AKg7yCq-8Ztel_IV3xBusVbPTzkqOuCcLnaMf9VKEwSKiGIRQUFDgHC3JqfZM5-S5rZocCISEj7Z6NsyS_5tPfbCkyh_86eEVio6fxHv42LmOmhLPJqKesKs9GHwKTbkr5tR2T6WUwmvwDzlt8x-xop92__Ht6UvSoL5XGKrJgfPDnhbKZP7ipHzCEHsk07Rm1iy4jaxi-9I5zATYtke-TV7L4iF1__Ofp_OP8xxPi4mrmcX5lqm2z4oJYy5vXgNAWUI2vs1vqNmc20VI0Oo3DcxIiJeUprnCxlDwOeeTPs9rVF9i9EeJA'
    },
  };
  
  //let responses = http.batch([
  // 
  //]);

  let res =  http.post(url, null, params);

  // console.log(res.body);

  check(res, { 'status was 401 unautorize' : (r) => r.status == 401 });
  // check(res, { 'status was 200': (r) => r.status == 200 });


  // crear cli 

  // obtener parametros pasados 

  // obtener el json

  // enviar peticion basica 

  // tomar validaciones

}