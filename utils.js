import { check } from 'k6';

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


export function check_obj(res, obj)
{
    var arr = [];
    for (const [key, value] of Object.entries(obj)) { 
        var message = `${key} must be: ${value}`;
        var tmp = [message, value];
        arr.push(tmp);
    }
    check_all(res, arr);
}

export function MESSAGE(msg)
{
    console.warn(msg);
}