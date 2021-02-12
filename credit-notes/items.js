/**
 * run this script with k6
 * cat script.js | docker run --rm -i loadimpact/k6 run -
 */

import http from 'k6/http';
import { auth } from '../auth.js';
import { group, fail, check } from 'k6';
import { check_obj, MESSAGE } from '../utils.js';


const data = JSON.parse(open(`./${__ENV.JSON}.json`));


//** items[idx].quantity **//
export function items_invalid_quantity() {
    var url = data.url;
    var obj = data.body;
    // expected
    let err = {
        status  : 400,
        code    : "invalid_value",
        message : "Invalid value: quantity", 
        params  : "items[0].quantity",
        detail  : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_value"
    };

    // set quantity 0
    obj.items[0].quantity = 0;
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // set quantity negative
    obj.items[0].quantity = -1;
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res1.body);

    // max value + 1
    obj.items[0].quantity = 99,999,999.99 + 1;
    let res2 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res2.body);

    // set quantity max 2 decimal
    obj.items[0].quantity = 1.9999;
    let res3 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res3.body);

    // set quantity max 2 decimal with comma
    obj.items[0].quantity = 1,9999;
    let res4 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // checks
    check_obj(res, err);
    check_obj(res1, err);
    check_obj(res2, err);
    check_obj(res3, err);
    check_obj(res4, err);
}


//** items[idx].price || items[idx].discount || payments[idx].value **//
export function items_invalid_discount_max_and_min_range_config_invoice_discount_percentage() {
    var url = data.url;
    var obj = data.body;
    // expected
    let err = {
        status  : 400,
        code    : "invalid_range",
        message : "The field discount only allows a value between 0 and 100", 
        params  : "items[0].discount",
        detail  : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_range"
    };
    // get config discount by percentage in invoice send
    // ms AcentryQueries get invoice
    let invoice = http.get("http://host.docker.internal:9800/api/invoices/" + obj.invoice, auth());
    // get JSON data 
    invoice = JSON.parse(invoice.body);
    let config = JSON.parse(invoice.entry.jsonData);

    // check if invoice has discount by percentage 
    if (!check(config,{'discount by percentage in config invoice is true': (r) => r.EntryType.IsDiscountPercentaje == true }))
    {
        fail('invoice no handle discount by percentaje');
    }

    // set discount max range
    obj.items[0].discount = 200;
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // set discount min range
    obj.items[0].discount = -1;
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res1.body);

    // check
    check_obj(res, err);
    check_obj(res1, err);
}

// falta crear 
export function items_invalid_discount_config_invoice_discount_value() {
    var url = data.url;
    var obj = data.body;
    // expected
    let err = {
        status : 400,
        code   : "invalid_value",
        message: "Invalid value: quantity", 
        params : "items[0].quantity",
        detail : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_value"
    };

    // set quantity negative
    obj.items[0].quantity = 1,9999;
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // check
    check_obj(res, err);
}
// puede que se una con la de arriba
export function items_invalid_discount() {
    var url = data.url;
    var obj = data.body;

    // max value
    obj.items[0].discount = 999,999,999,999.99;

    // max 2 decimals
    obj.items[0].discount = 1.999;


    obj.items[0].discount = 1,99999999;

    // number negative

    obj.items[0].discount = -1;  
}


export function items_invalid_prices() {
    MESSAGE("RESPONSE: ITEMS INVALID PRICES");
    var url = data.url;
    var obj = data.body;
    let err = {
        status  : 400,
        code    : "invalid_amount",
        message : "The price amount is invalid", 
        params  : "items[0].price",
        detail  : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_amount"
    };

    // max value
    obj.items[0].price = 999,999,999,999.99;
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // max 6 decimals
    obj.items[0].price = 1.9999999999999999;
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res1.body);

    // number with comma
    obj.items[0].price = 1,9999999;
    let res2 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res2.body);

    // number negative
    obj.items[0].price = -1;
    let res3 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res3.body);

    // checks 
    check_obj(res, err);
    check_obj(res1, err);
    check_obj(res2, err);
    check_obj(res3, err);
}

//** PAYMENTS **//
export function payments_invalid_value() {
    MESSAGE("RESPONSE: PAYMENTS INVALID VALUE");
    var url = data.url;
    var obj = data.body;
    // expected
    let err = {
        status  : 400,
        code    : "invalid_amount",
        message : "The payments amount is invalid", 
        params  : "payments[0].value",
        detail  : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_amount"
    };

    // max value
    obj.payments[0].value = 999,999,999,999.99;
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // max 2 decimals
    obj.payments[0].value = 1.999;
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res1.body);

    // number with comma
    obj.payments[0].value = 1,9999999;
    let res2 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res2.body);

    // number negative
    obj.payments[0].value = -1;
    let res3 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res3.body);

    // checks       
    check_obj(res, err);
    check_obj(res1, err);
    check_obj(res2, err);
    check_obj(res3, err);
}


//** ITEMS LENGTH MAX CODE AND DESCRIPTION **//

export function items_invalid_code_length_max() {
    MESSAGE("RESPONSE: ITEMS INVALID CODE LENGTH MAX");
    var url = data.url;
    var obj = data.body;
    // expected
    let err = {
        status  : 400,
        code    : "length_max",
        message : "The field code only allows a maximum length of 30 characters", 
        params  : "items[0].code",
        detail  : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/length_max"
    };
    // max value 30 characteres
    obj.items[0].code = "x".repeat(31);
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // checks
    check_obj(res, err);
}

export function items_invalid_description_length_max() {
    MESSAGE("RESPONSE: ITEMS INVALID DESCRIPTION LENGTH MAX");
    var url = data.url;
    var obj = data.body;
    // expected
    let err = {
        status  : 400,
        code    : "length_max",
        message : "The field code only allows a maximum length of 30 characters", 
        params  : "items[0].code",
        detail  : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/length_max"
    };

    // max value 4000 characteres
    obj.items[0].description = "x".repeat(4002);
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // checks
    check_obj(res, err);
}

//** ITEMS WAREHOUSE **//

// En este caso puede que sea mas util usar xUnit ya que me permitiria mockear la respuesta de allowedWarehouse
// http://localhost:8671/ACGeneral/api/v1/Company/GetUseWarehouse?namespace=v1
// http://localhost:8671/ACGeneral/api/v1/ProductWarehouse/GetAll?namespace=v1
export function items_invalid_warehouse_not_active() {
    MESSAGE("RESPONSE: ITEMS INVALID WAREHOUSE NOT ACTIVE");
    var url = data.url;
    var obj = data.body;
    let allowedWarehouse = http.get("http://host.docker.internal:8671/ACGeneral/api/v1/Company/GetUseWarehouse?namespace=v1", auth());
    console.log(allowedWarehouse.body);
    //allowedWarehouse = JSON.parse(invoice.body);
    // console.log(invoice);

    // max value 30 characteres
    obj.items[0].warehouse = 12;
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);
}

export function items_invalid_warehouse() {
    MESSAGE("RESPONSE: ITEMS INVALID WAREHOUSE");
    var url = data.url;
    var obj = data.body;
    // expected
    let err = {
        status  : 400,
        code    : "length_max",
        message : "The field code only allows a maximum length of 30 characters", 
        params  : "items[0].code",
        detail  : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/length_max"
    };
    // let allowedWarehouse = http.get("http://host.docker.internal:8671/ACGeneral/api/v1/Company/GetUseWarehouse?namespace=v1", auth());
    // console.log(allowedWarehouse.body);
    // allowedWarehouse = JSON.parse(invoice.body);
    // console.log(invoice);

    // warehouse eq zero
    obj.items[0].warehouse = 0;
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // warehouse negative
    obj.items[0].warehouse = -1;
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res1.body);

    // warehouse max value
    obj.items[0].warehouse = Number.MAX_SAFE_INTEGER + 1;
    let res2 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res2.body);

    // checks
    check_obj(res, err);
    check_obj(res1, err);
    check_obj(res2, err);
}

//** ITEMS TAXES **//

// /v1/taxes

export function items_invalid_taxes() {
    MESSAGE("RESPONSE: ITEMS INVALID TAXES");
    var url = data.url;
    var obj = data.body;
    // expected
    let err = {
        status : 400,
        code   : "invalid_taxes",
        message: "The array taxes has invalid values", 
        params : "items[0].taxes",
        detail : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_taxes"
    };
    // max taxes array length 3
    obj.items[0].taxes = [
        {
            "id": 273
        },
        {
            "id": 274
        },
        {
            "id": 288
        },
        {
            "id": 289
        }
    ];
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // taxes repeat
    obj.items[0].taxes = [
        {
            "id": 288
        },
        {
            "id": 288
        }
    ];
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res1.body);

    // checks
    check_obj(res, err);
    check_obj(res1, err);
}

export function items_invalid_taxes_not_exist() {
    MESSAGE("RESPONSE: ITEMS INVALID TAXES NOT EXIST")
    var url = data.url;
    var obj = data.body;
    let err = {
        status  : 400,
        code    : "invalid_reference",
        message : "The tax doesn't exist: 1212121",
        params  : "items[0].taxes[0].id",
        detail  : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_reference"
    }

    // id tax don't exists
    obj.items[0].taxes = [{ "id": 1212121 }];
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);  

    // checks  
    check_obj(res, err);
}

export function items_invalid_taxes_parameter_inactive() {
    MESSAGE("RESPONSE: ITEMS INVALID TAXES PARAMETER INACTIVE");
    var url = data.url;
    var obj = data.body;
    // expected
    let err = { 
        status  :  400,
        code    : "parameter_inactive",
        message : "The tax doesn't exist: 1212121", 
        params  : "items[0].taxes[0].id",
        detail  : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/parameter_inactive"
    };

    // max value long + 1
    obj.items[0].taxes = [{ "id": Number.MAX_SAFE_INTEGER + 1 }];
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // id equal to zero
    obj.items[0].taxes = [{ "id": 0 }];
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res1.body);

    // id negative
    obj.items[0].taxes = [{ "id": -1 }];
    let res2 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res2.body);

    // checks
    err.message = `The tax doesn't exist: ${Number.MAX_SAFE_INTEGER + 1}`;
    check_obj(res, err);
    err.message = "The tax doesn't exist: 0";
    check_obj(res1, err);
    err.message = "The tax doesn't exist: -1";
    check_obj(res2, err);
}

//** ITEMS SELLER **//

// /v1/users
export function items_invalid_seller_not_exist() {
    MESSAGE("RESPONSE: ITEMS INVALID SELLER NOT EXIST");
    var url = data.url;
    var obj = data.body;
    // expected
    let err = {
        status  : 400,
        code    : "invalid_reference",
        message : "The tax doesn't exist: 121212", 
        params  : "items[0].seller",
        detail  : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_reference"
    };
    // don't exists
    obj.items[0].seller = 121212
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // is zero
    obj.items[0].seller = 0
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res1.body);

    // negative
    obj.items[0].seller = -1
    let res2 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res2.body);

    // max long
    obj.items[0].seller = Number.MAX_SAFE_INTEGER + 1
    let res3 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res3.body);

    // checks
    err.message = `The tax doesn't exist: 121212`;
    check_obj(res, err);
    err.message = "The tax doesn't exist: 0";
    check_obj(res1, err);
    err.message = "The tax doesn't exist: -1";
    check_obj(res2, err);
    err.message = `The tax doesn't exist: ${Number.MAX_SAFE_INTEGER + 1}`;
    check_obj(res3, err);
}

export default function() {

    group('items', function () {

        group('invalid discount max and min range config invoice discount percentage', function () {
            items_invalid_discount_max_and_min_range_config_invoice_discount_percentage();
        });

        group('invalid quantity', function () {
            items_invalid_quantity();
        });
    
        group('invalid prices', function() {
            items_invalid_prices();
        });

        group('invalid code length max', function() {
            items_invalid_code_length_max();
        });

        group('invalid description length max', function() {
            items_invalid_description_length_max();
        });

        group('invalid warehouse not active', function(){
            items_invalid_warehouse_not_active();
        });

        group('invalid warehouse', function(){
            items_invalid_warehouse();
        });

        group('invalid taxes', function(){
            items_invalid_taxes();
        });

        group('invalid taxes not exist', function(){
            items_invalid_taxes_not_exist();
        });

        group('invalid taxes parameter inactive', function(){
            items_invalid_taxes_parameter_inactive();
        });

        group('invalid seller not exist', function(){
            items_invalid_seller_not_exist();
        });

    }); 

    group('payments', function() {

        group('invalid value', function() {
            payments_invalid_value();
        });
    
    });


}
