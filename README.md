# integration_test_k6_sg


## Docker Compose

execute with 

```bash
docker-compose run k6
```

## K6

test run with

```bash
k6 run <testfile>.js -e JSON="<jsonfilename>" -e TEST="testname"

# example
k6 run items.js -e JSON="create" -e TEST="items_invalid_seller_salesbysalesman"
```


# RUN ALL

## INSTALL BASH 

```sh
apk update

apk add bash
```

## AND RUN FILE 

```
./autotest.sh
```