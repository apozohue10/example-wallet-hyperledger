######### VON NETWORK ############

./manage start --logs

######### KEYROCK ############

curl -X POST "http://localhost:9000/register" \
-d '{"seed": "Keyrock0000000000000000000000001", "role": "TRUST_ANCHOR", "alias": "Keyrock"}'

{
  "did": "PLEVLDPJQMJvPLyX3LgB6S",
  "seed": "keyrock0000000000000000000000001",
  "verkey": "DAwrZwgMwkTVHUQ8ZYAmuvzwprDmX8vFNXzFioxrWpCA"
}


docker run --net=host bcgovimages/aries-cloudagent:py36-1.16-0_0.6.0 start \
--label Keyrock \
-it http 0.0.0.0 8000 \
-ot http \
--admin 0.0.0.0 11000 \
--admin-insecure-mode \
--genesis-url http://localhost:9000/genesis \
--seed Keyrock0000000000000000000000001 \
--endpoint http://localhost:8000/ \
--debug-connections \
--auto-provision \
--wallet-type indy \
--wallet-name Keyrock1 \
--wallet-key secret \
--webhook-url http://localhost:10000/webhooks

######### BOB ############

docker run --net=host bcgovimages/aries-cloudagent:py36-1.16-0_0.6.0 start \
--label Bob \
-it http 0.0.0.0 8001 \
-ot http \
--admin 0.0.0.0 11001 \
--admin-insecure-mode \
--endpoint http://localhost:8001/ \
--genesis-url http://localhost:9000/genesis \
--debug-connections \
--auto-provision \
--wallet-local-did \
--wallet-type indy \
--wallet-name Bob1 \
--wallet-key secret
