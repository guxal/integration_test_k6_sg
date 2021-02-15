#!/bin/bash

array=(
    "items_invalid_quantity"
    "items_invalid_discount_max_and_min_range_config_invoice_discount_percentage"
    "items_invalid_discount_config_invoice_discount_value"
    "items_invalid_discount"
    "items_invalid_prices"
    "payments_invalid_value"
    "items_invalid_code_length_max"
    "items_invalid_description_length_max"
    "items_invalid_warehouse_not_active"
    "items_invalid_warehouse_active_product_no_handle_inventory"
    "items_invalid_warehouse"
    "items_invalid_taxes"
    "items_invalid_taxes_not_exist"
    "items_invalid_taxes_parameter_inactive"
    "items_invalid_seller_not_exist"
    "items_invalid_seller_salesbysalesman"
    "items_invalid_seller_not_active"
)

for u in "${array[@]}"
do
    k6 run -e JSON="create" -e TEST="$u" ./items.js
done