# integration_test_k6_sg


## Docker Compose

execute with 

```bash
docker-compose run k6
```

## K6

test run with

```bash
k6 run <testfile>.js -e JSON="<jsonfilename>"

# example
k6 run items.js -e JSON="create"
```
