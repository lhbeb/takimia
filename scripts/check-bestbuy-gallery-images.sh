#!/usr/bin/env bash
set -u
for sku in 6291169 6203022 6582908 6513689 6681517 6513285 6588878 6588879 6615146 6573737 6302559 6680064 12779813 6471084 6570530 6605884 6357659 6513002; do
  prefix="https://pisces.bbystatic.com/image2/BestBuy_US/images/products/${sku:0:4}/${sku}"
  printf '%s ' "$sku"
  for suffix in _sd.jpg _1.jpg _2.jpg _3.jpg _4.jpg; do
    code=$(curl -L -s -o /dev/null -w '%{http_code}' --max-time 10 "${prefix}${suffix};maxHeight=1080;maxWidth=900?format=webp")
    [ "$code" = 200 ] && printf '%s ' "$suffix"
  done
  printf '\n'
done
