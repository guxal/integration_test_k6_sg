

export function payload(d)
{
  let identification = Math.floor(Math.random() * 1000000000);
  // let random = randomDate(new Date(2012, 0, 1), new Date());
  //console.log(identification);
  // console.log(d)
  d.identification = identification;
  //console.log(JSON.stringify(d));
  return d;
}

