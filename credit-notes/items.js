/**
 * run this script with k6
 * cat script.js | docker run --rm -i loadimpact/k6 run -
 */

import http from 'k6/http';
import { auth } from './auth.js'
import { group, fail, check } from 'k6';


const data = JSON.parse(open(`./${__ENV.JSON}.json`));

function check_all(res, _params)
{
    // status
    check(res, { [_params[0][0]] : (r) => r.status == _params[0][1] });
    // code
    check(res, { [_params[1][0]] : (r) => JSON.parse(r.body).Errors[0].Code == _params[1][1]});
    // message
    check(res, { [_params[2][0]] : (r) => JSON.parse(r.body).Errors[0].Message == _params[2][1] });
    // params
    check(res, { [_params[3][0]] : (r) => JSON.parse(r.body).Errors[0].Params[0] == _params[3][1] });
    // detail
    check(res, { [_params[4][0]] : (r) => JSON.parse(r.body).Errors[0].Detail == _params[4][1] });
}


function check_obj(res, obj)
{
    var arr = [];
    for (const [key, value] of Object.entries(obj)) { 
        var message = `${key} must be: ${value}`;
        var tmp = [message, value];
        arr.push(tmp);
    }
    check_all(res, arr);
}

//** items[idx].quantity **//
export function items_invalid_quantity_value_eq_0() {
    var url = data.url;
    var obj = data.body;
    // set quantity 0
    obj.items[0].quantity = 0;
  
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
        /* status  */ ['status was 400 no type', 400 ],
        /* code    */ ['error code was invalid_value', "invalid_value"],
        /* message */ ['error message was quantity is invalid', "Invalid value: quantity"], 
        /* params  */ ['error params was quantity in index 0', "items[0].quantity"],
        /* detail  */ ['error detail was url documentacion invalid_value', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_value"] 
           ]; 
    check_all(res, err);
}

export function items_invalid_quantity_value_negative_number() {
    var url = data.url;
    var obj = data.body;

    // set quantity negative
    obj.items[0].quantity = -1;
  
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
 /* status  */ ['status was 400 no type', 400 ],
 /* code    */ ['error code was invalid_value', "invalid_value"],
 /* message */ ['error message was quantity is invalid', "Invalid value: quantity"], 
 /* params  */ ['error params was quantity in index 0', "items[0].quantity"],
 /* detail  */ ['error detail was url documentacion invalid_value', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_value"] 
    ];

    check_all(res, err);
}

export function items_invalid_quantity_value_max() {
    var url = data.url;
    var obj = data.body;

    // set quantity negative
    obj.items[0].quantity = 99,999,999.99;
  
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
 /* status  */ ['status was 400 no type', 400 ],
 /* code    */ ['error code was invalid_value', "invalid_value"],
 /* message */ ['error message was quantity is invalid', "Invalid value: quantity"], 
 /* params  */ ['error params was quantity in index 0', "items[0].quantity"],
 /* detail  */ ['error detail was url documentacion invalid_value', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_value"] 
    ];

    check_all(res, err);
}

export function items_invalid_quantity_only_two_decimals_point() {
    var url = data.url;
    var obj = data.body;

    // set quantity negative
    obj.items[0].quantity = 1.9999;
  
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
 /* status  */ ['status was 400 no type', 400 ],
 /* code    */ ['error code was invalid_value', "invalid_value"],
 /* message */ ['error message was quantity is invalid', "Invalid value: quantity"], 
 /* params  */ ['error params was quantity in index 0', "items[0].quantity"],
 /* detail  */ ['error detail was url documentacion invalid_value', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_value"] 
    ];

    check_all(res, err);
}

export function items_invalid_quantity_only_two_decimals_comma() {
    var url = data.url;
    var obj = data.body;

    // set quantity negative
    obj.items[0].quantity = 1,9999;
  
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
 /* status  */ ['status was 400 no type', 400 ],
 /* code    */ ['error code was invalid_value', "invalid_value"],
 /* message */ ['error message was quantity is invalid', "Invalid value: quantity"], 
 /* params  */ ['error params was quantity in index 0', "items[0].quantity"],
 /* detail  */ ['error detail was url documentacion invalid_value', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_value"] 
    ];

    check_all(res, err);
}

//** items[idx].price || items[idx].discount || payments[idx].value **//
export function items_invalid_discount_max_and_min_range_config_invoice_discount_percentage() {
    var url = data.url;
    var obj = data.body;

    let invoice = http.get("http://host.docker.internal:9800/api/invoices/" + obj.invoice, auth());
    // console.log(invoice.body);
    invoice = JSON.parse(invoice.body);
    // console.log(invoice);
    // console.log(invoice.entry.jsonData)
    let config = JSON.parse(invoice.entry.jsonData);

    // check(config,{'discount': (r) => r.EntryType.IsDiscountPercentaje == true });
    if (!check(config,{'discount by percentage in config invoice is true': (r) => r.EntryType.IsDiscountPercentaje == true }))
    {
        fail('invoice no handle discount by percentaje');
    }
    // console.log(config);
    // set discount max range
    obj.items[0].discount = 200;
    let res =  http.post(url, JSON.stringify(obj), auth());
    
    // set discount min range
    obj.items[0].discount = -1;
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log("RESPONSE");
    console.log(res.body);
    console.log(res1.body);
 
    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
 /* status  */ ['status was 400 no type', 400 ],
 /* code    */ ['error code was invalid_range', "invalid_range"],
 /* message */ ['error message was discount is invalid_range', "The field discount only allows a value between 0 and 100"], 
 /* params  */ ['error params was discount in index 0', "items[0].discount"],
 /* detail  */ ['error detail was url documentacion invalid_range', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_range"] 
    ]; 

    check_all(res, err);
    check_all(res1, err);
}


export function items_invalid_discount_config_invoice_discount_value() {
    var url = data.url;
    var obj = data.body;

    // set quantity negative
    obj.items[0].quantity = 1,9999;
  
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
 /* status  */ ['status was 400 no type', 400 ],
 /* code    */ ['error code was invalid_value', "invalid_value"],
 /* message */ ['error message was quantity is invalid', "Invalid value: quantity"], 
 /* params  */ ['error params was quantity in index 0', "items[0].quantity"],
 /* detail  */ ['error detail was url documentacion invalid_value', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_value"] 
    ];

    check_all(res, err);
}

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
    var url = data.url;
    var obj = data.body;
    console.log("RESPONSE: ITEMS INVALID PRICES");

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


    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
    /* status  */ ['status was 400 no type', 400 ],
    /* code    */ ['error code was invalid_amount', "invalid_amount"],
    /* message */ ['error message was price is invalid_amount', "The price amount is invalid"], 
    /* params  */ ['error params was price in index 0', "items[0].price"],
    /* detail  */ ['error detail was url documentacion invalid_amount', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_amount"] 
    ];
       
    check_all(res, err);
    check_all(res1, err);
    check_all(res2, err);
    check_all(res3, err);
}

//** PAYMENTS **//
export function payments_invalid_value() {
    var url = data.url;
    var obj = data.body;
    console.log("RESPONSE: PAYMENTS INVALID VALUE");
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

    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
    /* status  */ ['status was 400 no type', 400 ],
    /* code    */ ['error code was invalid_amount', "invalid_amount"],
    /* message */ ['error message was payments is invalid_amount', "The payments amount is invalid"], 
    /* params  */ ['error params was payments in index 0', "payments[0].value"],
    /* detail  */ ['error detail was url documentacion invalid_amount', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_amount"] 
    ];
       
    check_all(res, err);
    check_all(res1, err);
    check_all(res2, err);
    check_all(res3, err);
}


//** ITEMS LENGTH MAX CODE AND DESCRIPTION **//

export function items_invalid_code_length_max() {
    var url = data.url;
    var obj = data.body;
    console.log("RESPONSE: ITEMS INVALID CODE LENGTH MAX");
    // max value 30 characteres
    obj.items[0].code = "x".repeat(31);
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    
    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
    /* status  */ ['status was 400 no type', 400 ],
    /* code    */ ['error code was invalid length', "length_max"],
    /* message */ ['error message was items code is invalid length', "The field code only allows a maximum length of 30 characters"], 
    /* params  */ ['error params was items code in index 0', "items[0].code"],
    /* detail  */ ['error detail was url documentacion invalid_amount', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/length_max"] 
    ];

    check_all(res, err);

}

export function items_invalid_description_length_max() {
    var url = data.url;
    var obj = data.body;
    console.log("RESPONSE: ITEMS INVALID DESCRIPTION LENGTH MAX");
    // max value 30 characteres
    obj.items[0].description = "x".repeat(4002);
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    
    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
    /* status  */ ['status was 400 no type', 400 ],
    /* code    */ ['error code was invalid length', "length_max"],
    /* message */ ['error message was items code is invalid length', "The field code only allows a maximum length of 30 characters"], 
    /* params  */ ['error params was items code in index 0', "items[0].code"],
    /* detail  */ ['error detail was url documentacion invalid_amount', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/length_max"] 
    ];

    check_all(res, err);

}

//** ITEMS WAREHOUSE **//

// En este caso puede que sea mas util usar xUnit ya que me permitiria mockear la respuesta de allowedWarehouse
// http://localhost:8671/ACGeneral/api/v1/Company/GetUseWarehouse?namespace=v1
// http://localhost:8671/ACGeneral/api/v1/ProductWarehouse/GetAll?namespace=v1
export function items_invalid_warehouse_not_active() {
    var url = data.url;
    var obj = data.body;
    console.log("RESPONSE: ITEMS INVALID WAREHOUSE NOT ACTIVE");
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
    var url = data.url;
    var obj = data.body;
    console.log("RESPONSE: ITEMS INVALID WAREHOUSE");
    // let allowedWarehouse = http.get("http://host.docker.internal:8671/ACGeneral/api/v1/Company/GetUseWarehouse?namespace=v1", auth());
    // console.log(allowedWarehouse.body);
    //allowedWarehouse = JSON.parse(invoice.body);
    // console.log(invoice);

    // max value 30 characteres
    obj.items[0].warehouse = 0;
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // max value 30 characteres
    obj.items[0].warehouse = -1;
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res1.body);

    obj.items[0].warehouse = Number.MAX_SAFE_INTEGER + 1;
    let res2 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res2.body);

    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
    /* status  */ ['status was 400 no type', 400 ],
    /* code    */ ['error code was invalid length', "length_max"],
    /* message */ ['error message was items code is invalid length', "The field code only allows a maximum length of 30 characters"], 
    /* params  */ ['error params was items code in index 0', "items[0].code"],
    /* detail  */ ['error detail was url documentacion invalid_amount', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/length_max"] 
    ];

    check_all(res, err);
    check_all(res1, err);
    check_all(res2, err);
}



//** ITEMS TAXES **//

// /v1/taxes

export function items_invalid_taxes() {
    var url = data.url;
    var obj = data.body;
    console.log("RESPONSE: ITEMS INVALID TAXES");
    // max value 30 characteres
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


    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
    /* status  */ ['status was 400 no type', 400 ],
    /* code    */ ['error code was invalid taxes', "invalid_taxes"],
    /* message */ ['error message was items taxes is invalid length', "The array taxes has invalid values"], 
    /* params  */ ['error params was items taxes in index 0', "items[0].taxes"],
    /* detail  */ ['error detail was url documentacion invalid_taxes', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_taxes"] 
    ];
    
    check_all(res, err);
    check_all(res1, err);
}


export function items_invalid_taxes_not_exist() {
    var url = data.url;
    var obj = data.body;
    console.log("RESPONSE: ITEMS INVALID TAXES NOT EXIST");

    let err = {
        status : 400,
        code   : "invalid_reference",
        message: "The tax doesn't exist: 1212121",
        params : "items[0].taxes[0].id",
        detail : "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_reference"
    }

    // max value 30 characteres
    obj.items[0].taxes = [
        {
            "id": 1212121
        }
    ];
     

    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
    // /* status  */ ['status was 400 no type', 400 ],
    // /* code    */ ['error code was invalid reference', "invalid_reference"],
    // /* message */ ['error message was items taxes not exist', "The tax doesn't exist: 1212121"], 
    // /* params  */ ['error params was items taxes id in index 0', "items[0].taxes[0].id"],
    // /* detail  */ ['error detail was url documentacion invalid_reference', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_reference"] 
    // ];
    
    check_obj(res, err);
}

export function items_invalid_taxes_parameter_inactive() {
    var url = data.url;
    var obj = data.body;
    console.log("RESPONSE: ITEMS INVALID TAXES PARAMETER INACTIVE");
    // max value long + 1
    obj.items[0].taxes = [
        {
            "id": Number.MAX_SAFE_INTEGER + 1
        }
    ];
    let res =  http.post(url, JSON.stringify(obj), auth());
    console.log(res.body);

    // id equal to zero
    obj.items[0].taxes = [
        {
            "id": 0
        }
    ];
    let res1 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res1.body);

    // id negative
    obj.items[0].taxes = [
        {
            "id": -1
        }
    ];
    let res2 =  http.post(url, JSON.stringify(obj), auth());
    console.log(res2.body);


    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
    /* status  */ ['status was 400 no type', 400 ],
    /* code    */ ['error code was invalid reference', "parameter_inactive"],
    /* message */ ['error message was items taxes not exist', "The tax doesn't exist: 1212121"], 
    /* params  */ ['error params was items taxes id in index 0', "items[0].taxes[0].id"],
    /* detail  */ ['error detail was url documentacion invalid_reference', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/parameter_inactive"] 
    ];

    err[2][1] = `The tax doesn't exist: ${Number.MAX_SAFE_INTEGER + 1}`;
    check_all(res, err);
    err[2][1] = "The tax doesn't exist: 0";
    check_all(res1, err);
    err[2][1] = "The tax doesn't exist: -1";
    check_all(res2, err);
}


//** ITEMS SELLER **//

// /v1/users
export function items_invalid_seller_not_exist() {
    var url = data.url;
    var obj = data.body;
    console.log("RESPONSE: ITEMS INVALID SELLER NOT EXIST");
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


    let err = [ // DISPLAY MESSAGE | VALIDATE ERROR
    /* status  */ ['status was 400 no type', 400 ],
    /* code    */ ['error code was invalid reference', "invalid_reference"],
    /* message */ ['error message was items seller not exist', "The tax doesn't exist: 121212"], 
    /* params  */ ['error params was items seller in index 0', "items[0].seller"],
    /* detail  */ ['error detail was url documentacion invalid_reference', "Check the API documentation: https://siigoapi.docs.apiary.io/#introduction/codigos-de-error/invalid_reference"] 
    ];
    
    err[2][1] = `The tax doesn't exist: 121212`;
    check_all(res, err);
    err[2][1] = "The tax doesn't exist: 0";
    check_all(res1, err);
    err[2][1] = "The tax doesn't exist: -1";
    check_all(res2, err);
    err[2][1] = `The tax doesn't exist: ${Number.MAX_SAFE_INTEGER + 1}`;
    check_all(res3, err);
}



export default function() {

    group('items', function () {

        // group('invalid discount max and min range config invoice discount percentage', function () {
        //     items_invalid_discount_max_and_min_range_config_invoice_discount_percentage();
        // });

        // group('invalid value eq to 0 in quantity', function () {
        //     items_invalid_quantity_value_eq_0();
        // });
    
        // group('invalid value negative number in quantity', function() {
        //     items_invalid_quantity_value_negative_number();
        // });

        // group('invalid value max number in quantity', function() {
        //     items_invalid_quantity_value_max();
        // });

        // group('only two decimals point in quantity', function() {
        //     items_invalid_quantity_only_two_decimals_point();
        // });

        // group('only two decimals comma in quantity', function() {
        //     items_invalid_quantity_only_two_decimals_comma();
        // });
    
        // group('invalid prices', function() {
        //     items_invalid_prices();
        // });

        // group('invalid code length max', function() {
        //     items_invalid_code_length_max();
        // });

        // group('invalid description length max', function() {
        //     items_invalid_description_length_max();
        // });

        // group('invalid warehouse not active', function(){
        //     items_invalid_warehouse_not_active();
        // });

        // group('invalid warehouse', function(){
        //     items_invalid_warehouse();
        // });

        // group('invalid taxes', function(){
        //     items_invalid_taxes();
        // });

        group('invalid taxes not exist', function(){
            items_invalid_taxes_not_exist();
        });

        // group('invalid taxes parameter inactive', function(){
        //     items_invalid_taxes_parameter_inactive();
        // });

        // group('invalid seller not exist', function(){
        //     items_invalid_seller_not_exist();
        // });

    }); 

    // group('payments', function() {

    //     group('invalid value', function() {
    //         payments_invalid_value();
    //     });
    
    // });


}