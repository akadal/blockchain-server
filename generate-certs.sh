#!/bin/bash

# Sertifika oluşturma betiği
# Bu betik, HTTPS için gerekli self-signed sertifikaları oluşturur

# Renk tanımlamaları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Akadal Chain için SSL sertifikaları oluşturuluyor...${NC}"

# Sertifika dizini oluştur
CERT_DIR="./certs"
mkdir -p $CERT_DIR

# .env dosyasından HOST_IP değerini al
source .env
HOST_IP=${HOST_IP:-localhost}

echo -e "${YELLOW}Sertifikalar $HOST_IP için oluşturuluyor...${NC}"

# Root CA oluştur
openssl genrsa -out $CERT_DIR/rootCA.key 4096
openssl req -x509 -new -nodes -key $CERT_DIR/rootCA.key -sha256 -days 1024 -out $CERT_DIR/rootCA.crt -subj "/C=TR/ST=Istanbul/L=Istanbul/O=Akadal Chain/OU=Education/CN=Akadal Root CA"

# Sertifika için config dosyası oluştur
cat > $CERT_DIR/openssl.cnf << EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = req_ext

[dn]
C=TR
ST=Istanbul
L=Istanbul
O=Akadal Chain
OU=Education
CN=$HOST_IP

[req_ext]
subjectAltName = @alt_names

[alt_names]
DNS.1 = $HOST_IP
DNS.2 = localhost
IP.1 = 127.0.0.1
EOF

if [[ "$HOST_IP" != "localhost" ]]; then
    echo "IP.2 = $HOST_IP" >> $CERT_DIR/openssl.cnf
fi

# Sertifika oluştur
openssl genrsa -out $CERT_DIR/server.key 2048
openssl req -new -key $CERT_DIR/server.key -out $CERT_DIR/server.csr -config $CERT_DIR/openssl.cnf
openssl x509 -req -in $CERT_DIR/server.csr -CA $CERT_DIR/rootCA.crt -CAkey $CERT_DIR/rootCA.key -CAcreateserial -out $CERT_DIR/server.crt -days 500 -sha256 -extfile $CERT_DIR/openssl.cnf -extensions req_ext

# Nginx için dhparam oluştur
openssl dhparam -out $CERT_DIR/dhparam.pem 2048

# Sertifika bilgilerini göster
echo -e "${GREEN}Sertifikalar başarıyla oluşturuldu:${NC}"
echo -e "${YELLOW}Sertifika Dizini: $CERT_DIR${NC}"
echo -e "${YELLOW}Sertifika Dosyaları:${NC}"
ls -la $CERT_DIR

echo -e "${GREEN}Sertifikalar $HOST_IP için oluşturuldu.${NC}"
echo -e "${YELLOW}Not: Bu self-signed sertifikalar tarayıcılarda güvenlik uyarısı gösterebilir.${NC}"
echo -e "${YELLOW}Gerçek bir üretim ortamı için Let's Encrypt gibi gerçek bir CA'dan sertifika almanız önerilir.${NC}" 