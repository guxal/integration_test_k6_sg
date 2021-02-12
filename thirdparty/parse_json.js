const data = JSON.parse(open('./create_simple.json'));

export default function () {
  let user = data.type;
  console.log(user);
}
