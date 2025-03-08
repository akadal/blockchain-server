@echo off
echo Akadal Chain icin SSL sertifikalari olusturuluyor...

REM Sertifika dizini oluştur
set CERT_DIR=.\certs
if not exist %CERT_DIR% mkdir %CERT_DIR%

REM .env dosyasından HOST_IP değerini al
for /f "tokens=2 delims==" %%a in ('findstr /C:"HOST_IP" .env') do set HOST_IP=%%a
if "%HOST_IP%"=="" set HOST_IP=localhost

echo Sertifikalar %HOST_IP% icin olusturuluyor...

REM OpenSSL'in PATH'de olduğunu kontrol et
where openssl >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo OpenSSL bulunamadi. Lutfen OpenSSL'i yukleyin ve PATH'e ekleyin.
    exit /b 1
)

REM Root CA oluştur
openssl genrsa -out %CERT_DIR%\rootCA.key 4096
openssl req -x509 -new -nodes -key %CERT_DIR%\rootCA.key -sha256 -days 1024 -out %CERT_DIR%\rootCA.crt -subj "/C=TR/ST=Istanbul/L=Istanbul/O=Akadal Chain/OU=Education/CN=Akadal Root CA"

REM Sertifika için config dosyası oluştur
echo [req] > %CERT_DIR%\openssl.cnf
echo default_bits = 2048 >> %CERT_DIR%\openssl.cnf
echo prompt = no >> %CERT_DIR%\openssl.cnf
echo default_md = sha256 >> %CERT_DIR%\openssl.cnf
echo distinguished_name = dn >> %CERT_DIR%\openssl.cnf
echo req_extensions = req_ext >> %CERT_DIR%\openssl.cnf
echo. >> %CERT_DIR%\openssl.cnf
echo [dn] >> %CERT_DIR%\openssl.cnf
echo C=TR >> %CERT_DIR%\openssl.cnf
echo ST=Istanbul >> %CERT_DIR%\openssl.cnf
echo L=Istanbul >> %CERT_DIR%\openssl.cnf
echo O=Akadal Chain >> %CERT_DIR%\openssl.cnf
echo OU=Education >> %CERT_DIR%\openssl.cnf
echo CN=%HOST_IP% >> %CERT_DIR%\openssl.cnf
echo. >> %CERT_DIR%\openssl.cnf
echo [req_ext] >> %CERT_DIR%\openssl.cnf
echo subjectAltName = @alt_names >> %CERT_DIR%\openssl.cnf
echo. >> %CERT_DIR%\openssl.cnf
echo [alt_names] >> %CERT_DIR%\openssl.cnf
echo DNS.1 = %HOST_IP% >> %CERT_DIR%\openssl.cnf
echo DNS.2 = localhost >> %CERT_DIR%\openssl.cnf
echo IP.1 = 127.0.0.1 >> %CERT_DIR%\openssl.cnf

if not "%HOST_IP%"=="localhost" (
    echo IP.2 = %HOST_IP% >> %CERT_DIR%\openssl.cnf
)

REM Sertifika oluştur
openssl genrsa -out %CERT_DIR%\server.key 2048
openssl req -new -key %CERT_DIR%\server.key -out %CERT_DIR%\server.csr -config %CERT_DIR%\openssl.cnf
openssl x509 -req -in %CERT_DIR%\server.csr -CA %CERT_DIR%\rootCA.crt -CAkey %CERT_DIR%\rootCA.key -CAcreateserial -out %CERT_DIR%\server.crt -days 500 -sha256 -extfile %CERT_DIR%\openssl.cnf -extensions req_ext

REM Nginx için dhparam oluştur
openssl dhparam -out %CERT_DIR%\dhparam.pem 2048

REM Sertifika bilgilerini göster
echo Sertifikalar basariyla olusturuldu:
echo Sertifika Dizini: %CERT_DIR%
echo Sertifika Dosyalari:
dir %CERT_DIR%

echo Sertifikalar %HOST_IP% icin olusturuldu.
echo Not: Bu self-signed sertifikalar tarayicilarda guvenlik uyarisi gosterebilir.
echo Gercek bir uretim ortami icin Let's Encrypt gibi gercek bir CA'dan sertifika almaniz onerilir. 