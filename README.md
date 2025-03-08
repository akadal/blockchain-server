# Akadal Chain: Educational Blockchain Environment

This repository contains a simple educational blockchain environment with an Ethereum node, a network explorer, and a faucet for distributing test tokens to students.

[Türkçe Dokümantasyon için aşağı kaydırın](#akadal-chain-eğitim-amaçlı-blockchain-ortamı)

## System Components

1. **Ethereum Node (Geth)**: A full-featured EVM-compatible blockchain
2. **Ethereum Lite Explorer**: A simple explorer to view blockchain activity
3. **Blockscout Explorer**: An advanced explorer with smart contract interaction capabilities
4. **Custom Faucet**: A web UI to distribute test ETH to students

## Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system
- At least 2GB RAM, 2 vCPUs, and 40GB SSD storage
- Node.js (for infinite faucet funding)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/akadal/blockchain-server.git
   cd blockchain-server
   ```

2. Configure the environment:
   The system uses a `.env` file for configuration. A default file is provided with the repository.
   
   - For local development, you can use the default settings
   - For deployment to a server, edit the `.env` file and change the `HOST_IP` to your server's IP address:
     ```
     # Change this to your server's IP address when deploying
     HOST_IP=your-server-ip
     ```
   - You can also customize other settings like ports, network ID, and faucet configuration

3. Start the system:
   ```
   # On Windows
   simple-fund.bat
   
   # On Linux/Mac
   ./start.sh
   ```

4. (Optional) Enable infinite faucet funding:
   ```
   # On Windows
   infinite-fund.bat
   
   # On Linux/Mac
   ./infinite-fund.sh
   ```

### Access Points

Once the system is running, you can access the following services:

- **Faucet**: http://localhost:3000 (or http://your-server-ip:3000 if deployed)
- **Ethereum Lite Explorer**: http://localhost:8080 (or http://your-server-ip:8080 if deployed)
- **Blockscout Explorer**: http://localhost:4000 (or http://your-server-ip:4000 if deployed)
- **Ethereum RPC**: http://localhost:8545 (or http://your-server-ip:8545 if deployed)

## Configuration

### Environment Variables

The system is configured using environment variables in the `.env` file. Here's what each variable does:

```
# Network Configuration
HOST_IP=localhost                # Use 'localhost' for local development, or your server's IP for remote access

# Ports Configuration
ETHEREUM_RPC_PORT=8545           # Ethereum HTTP RPC port
ETHEREUM_WS_PORT=8546            # Ethereum WebSocket port
EXPLORER_PORT=8080               # Ethereum Lite Explorer port
BLOCKSCOUT_PORT=4000             # Blockscout Explorer port
FAUCET_PORT=3000                 # Faucet web interface port
POSTGRES_PORT=5432               # PostgreSQL database port (for Blockscout)

# Ethereum Node Configuration
NETWORK_ID=1337                  # Ethereum network ID

# Faucet Configuration
ETH_AMOUNT=100                   # Amount of ETH to send per faucet request
FUND_PRIVATE_KEY=...             # Private key for the faucet funding account
FUND_ADDRESS=...                 # Address of the faucet funding account
FAUCET_NAME=Akadal Chain Faucet  # Name displayed on the faucet UI
FAUCET_DESCRIPTION=...           # Description displayed on the faucet UI

# Blockscout Configuration
BLOCKSCOUT_NETWORK_NAME=...      # Network name displayed in Blockscout
BLOCKSCOUT_SUBNETWORK=...        # Subnetwork name displayed in Blockscout

# Creator Information
CREATOR_NAME=...                 # Creator name displayed on the faucet UI
CREATOR_URL=...                  # Creator URL displayed on the faucet UI
```

### Deployment Configuration

When deploying to a server:

1. Edit the `.env` file and change `HOST_IP` to your server's public IP address
2. Make sure all the required ports are open on your server's firewall
3. Start the system using the provided scripts

## Usage Instructions

### For Students

1. **Set up MetaMask with Akadal Chain**
   - Install MetaMask browser extension
   - Open MetaMask and select "Add Network"
   - Enter the network details:
     - Network Name: Akadal Chain
     - RPC URL: http://localhost:8545 (or http://your-server-ip:8545 if using a remote server)
     - Chain ID: 1337
     - Currency Symbol: ETH

2. **Request Test ETH**
   - Navigate to the faucet URL (http://localhost:3000 or http://your-server-ip:3000)
   - Enter your MetaMask wallet address
   - Click "Request Tokens"
   - Wait for confirmation

3. **Verify Receipt of Tokens**
   - Open MetaMask to see your test ETH balance
   - Check the explorer (http://localhost:8080 or http://your-server-ip:8080) to view network activity
   - Alternatively, use Blockscout Explorer (http://localhost:4000 or http://your-server-ip:4000)

4. **Interact with the Chain**
   - Deploy and test smart contracts
   - Execute transactions
   - Use tools like Remix IDE connected to your local node
   - Monitor blockchain activity in the explorers

### Using Remix with Akadal Chain

1. **Connect Remix to Akadal Chain**
   - Open Remix IDE: https://remix.ethereum.org/
   - Go to the "Deploy & Run Transactions" tab
   - In the "Environment" dropdown, select "Injected Provider - MetaMask"
   - Make sure your MetaMask is connected to Akadal Chain
   - Alternatively, you can select "Web3 Provider" and enter the RPC URL: http://localhost:8545 (or http://your-server-ip:8545)

2. **Deploy Smart Contracts**
   - Write or import your smart contract in Remix
   - Compile the contract
   - In the "Deploy & Run Transactions" tab, select your contract
   - Click "Deploy" to deploy the contract to Akadal Chain
   - Confirm the transaction in MetaMask

3. **Interact with Deployed Contracts**
   - After deployment, your contract will appear under "Deployed Contracts"
   - You can interact with your contract functions directly from Remix
   - All transactions will be processed on Akadal Chain

### Using Blockscout Explorer for Smart Contract Interaction

1. **Access Blockscout Explorer**
   - Navigate to http://localhost:4000 (or http://your-server-ip:4000)
   - You'll see a comprehensive blockchain explorer with advanced features

2. **Connect Your Wallet**
   - Click on "Connect Wallet" in the top right corner
   - Select MetaMask and approve the connection
   - Ensure your MetaMask is connected to Akadal Chain

3. **View and Interact with Smart Contracts**
   - Find your deployed contract by searching for its address
   - On the contract page, you'll see:
     - Contract code and verification status
     - Read and write functions that you can interact with
     - All transactions related to the contract
     - Token information (if it's a token contract)

4. **Execute Contract Functions**
   - For read functions: simply click on the function and view the results
   - For write functions: 
     - Fill in the required parameters
     - Click "Write"
     - Confirm the transaction in MetaMask
     - Wait for the transaction to be processed

5. **Verify Smart Contracts**
   - Click on "Verify & Publish" on your contract's page
   - Upload your contract source code or input it directly
   - Provide compilation details (compiler version, optimization, etc.)
   - Submit for verification
   - Once verified, all contract functions will be labeled and documented

### For Instructors

1. **Monitor System Status**
   - Check container status: `docker-compose ps`
   - View logs: `docker-compose logs -f [service]`
   - Monitor blockchain activity through the explorers (http://localhost:8080 and http://localhost:4000, or your server IP)

2. **Manage Faucet Funds**
   - The faucet is automatically funded during system startup
   - For unlimited funding, run the infinite funding service:
     ```
     # On Windows
     infinite-fund.bat
     
     # On Linux/Mac
     ./infinite-fund.sh
     ```
   - This service will monitor the faucet balance and automatically refill it when needed
   - For manual funding, run:
     ```
     # On Windows
     fund-faucet.bat
     
     # On Linux/Mac
     ./fund-faucet.sh
     ```

3. **System Maintenance**
   - Update system: `docker-compose pull && docker-compose up -d`
   - Restart services if necessary: `docker-compose restart [service]`
   - Stop all services: `docker-compose down`
   - Stop and remove volumes: `docker-compose down -v` (caution: this will delete all blockchain data)

## Troubleshooting

### Common Issues

1. **Services not starting**
   - Check logs: `docker-compose logs -f`
   - Ensure you have enough system resources
   - Verify that all required ports are available

2. **Explorer not showing data**
   - It may take a few minutes for the explorers to connect to the Ethereum node
   - Check explorer logs: `docker-compose logs -f explorer` or `docker-compose logs -f blockscout`
   - Restart the explorers: `docker-compose restart explorer` or `docker-compose restart blockscout`

3. **Faucet not sending ETH ("Faucet balance too low" error)**
   - Run the infinite funding service:
     ```
     # On Windows
     infinite-fund.bat
     
     # On Linux/Mac
     ./infinite-fund.sh
     ```
   - Check faucet logs: `docker-compose logs -f faucet`
   - Verify that the Ethereum node is accessible from the faucet container
   - Restart the faucet: `docker-compose restart faucet`

4. **Remix cannot connect to the blockchain**
   - Ensure MetaMask is properly connected to Akadal Chain
   - Try using "Web3 Provider" in Remix instead of "Injected Provider"
   - Check that the Ethereum node is running with proper CORS settings
   - Verify the RPC endpoint is accessible from your browser
   - Try restarting the Ethereum node: `docker-compose restart ethereum`

5. **Blockscout Explorer issues**
   - The initial indexing may take some time
   - If the explorer is not showing data, check the logs: `docker-compose logs -f blockscout`
   - Ensure the PostgreSQL database is running: `docker-compose logs -f postgres`
   - Restart Blockscout if needed: `docker-compose restart blockscout`

6. **Environment variables not being applied**
   - Make sure your `.env` file is in the root directory of the project
   - Restart the entire system after changing the `.env` file: `docker-compose down && docker-compose up -d`
   - Check if Docker Compose is reading the variables: `docker-compose config`

## Cross-Platform Compatibility

This system is designed to work on both Windows and Linux/Mac environments:

- **Windows**: Use the `.bat` files for starting and managing the system
- **Linux/Mac**: Use the `.sh` files for starting and managing the system

The core functionality is identical across platforms, with only the shell scripts differing to accommodate platform-specific requirements.

## Repository

The official repository for this project is available at: [https://github.com/akadal/blockchain-server](https://github.com/akadal/blockchain-server)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

Created by Assoc. Prof. Dr. Emre Akadal for educational purposes.

---

# Akadal Chain: Eğitim Amaçlı Blockchain Ortamı

Bu depo, öğrencilere test token'ları dağıtmak için bir Ethereum düğümü, ağ gezgini ve faucet içeren basit bir eğitim amaçlı blockchain ortamı içerir.

## Sistem Bileşenleri

1. **Ethereum Düğümü (Geth)**: Tam özellikli EVM uyumlu blockchain
2. **Ethereum Lite Explorer**: Blockchain aktivitesini görüntülemek için basit bir gezgin
3. **Blockscout Explorer**: Akıllı kontratlarla etkileşim kurma özelliklerine sahip gelişmiş bir gezgin
4. **Özel Faucet**: Öğrencilere test ETH dağıtmak için web arayüzü

## Hızlı Başlangıç

### Ön Koşullar

- Sisteminizde Docker ve Docker Compose kurulu olmalı
- En az 2GB RAM, 2 vCPU ve 40GB SSD depolama alanı
- Node.js (sonsuz faucet fonlaması için)

### Kurulum

1. Bu depoyu klonlayın:
   ```
   git clone https://github.com/akadal/blockchain-server.git
   cd blockchain-server
   ```

2. Ortamı yapılandırın:
   Sistem, yapılandırma için bir `.env` dosyası kullanır. Depo ile birlikte varsayılan bir dosya sağlanmıştır.
   
   - Yerel geliştirme için varsayılan ayarları kullanabilirsiniz
   - Bir sunucuya dağıtım yaparken, `.env` dosyasını düzenleyin ve `HOST_IP`'yi sunucunuzun IP adresine değiştirin:
     ```
     # Dağıtım yaparken bunu sunucunuzun IP adresine değiştirin
     HOST_IP=sunucu-ip-adresiniz
     ```
   - Ayrıca portlar, ağ kimliği ve faucet yapılandırması gibi diğer ayarları da özelleştirebilirsiniz

3. Sistemi başlatın:
   ```
   # Windows'ta
   simple-fund.bat
   
   # Linux/Mac'te
   ./start.sh
   ```

4. (İsteğe bağlı) Sonsuz faucet fonlamasını etkinleştirin:
   ```
   # Windows'ta
   infinite-fund.bat
   
   # Linux/Mac'te
   ./infinite-fund.sh
   ```

### Erişim Noktaları

Sistem çalışmaya başladıktan sonra, aşağıdaki hizmetlere erişebilirsiniz:

- **Faucet**: http://localhost:3000 (veya dağıtılmışsa http://sunucu-ip-adresiniz:3000)
- **Ethereum Lite Explorer**: http://localhost:8080 (veya dağıtılmışsa http://sunucu-ip-adresiniz:8080)
- **Blockscout Explorer**: http://localhost:4000 (veya dağıtılmışsa http://sunucu-ip-adresiniz:4000)
- **Ethereum RPC**: http://localhost:8545 (veya dağıtılmışsa http://sunucu-ip-adresiniz:8545)

## Yapılandırma

### Çevre Değişkenleri

Sistem, `.env` dosyasındaki çevre değişkenleri kullanılarak yapılandırılır. Her değişkenin işlevi şöyledir:

```
# Ağ Yapılandırması
HOST_IP=localhost                # Yerel geliştirme için 'localhost', uzaktan erişim için sunucu IP'nizi kullanın

# Port Yapılandırması
ETHEREUM_RPC_PORT=8545           # Ethereum HTTP RPC portu
ETHEREUM_WS_PORT=8546            # Ethereum WebSocket portu
EXPLORER_PORT=8080               # Ethereum Lite Explorer portu
BLOCKSCOUT_PORT=4000             # Blockscout Explorer portu
FAUCET_PORT=3000                 # Faucet web arayüzü portu
POSTGRES_PORT=5432               # PostgreSQL veritabanı portu (Blockscout için)

# Ethereum Düğümü Yapılandırması
NETWORK_ID=1337                  # Ethereum ağ kimliği

# Faucet Yapılandırması
ETH_AMOUNT=100                   # Her faucet isteği başına gönderilecek ETH miktarı
FUND_PRIVATE_KEY=...             # Faucet fonlama hesabının özel anahtarı
FUND_ADDRESS=...                 # Faucet fonlama hesabının adresi
FAUCET_NAME=Akadal Chain Faucet  # Faucet UI'da görüntülenen isim
FAUCET_DESCRIPTION=...           # Faucet UI'da görüntülenen açıklama

# Blockscout Yapılandırması
BLOCKSCOUT_NETWORK_NAME=...      # Blockscout'ta görüntülenen ağ adı
BLOCKSCOUT_SUBNETWORK=...        # Blockscout'ta görüntülenen alt ağ adı

# Oluşturucu Bilgileri
CREATOR_NAME=...                 # Faucet UI'da görüntülenen oluşturucu adı
CREATOR_URL=...                  # Faucet UI'da görüntülenen oluşturucu URL'si
```

### Dağıtım Yapılandırması

Bir sunucuya dağıtım yaparken:

1. `.env` dosyasını düzenleyin ve `HOST_IP`'yi sunucunuzun genel IP adresine değiştirin
2. Sunucunuzun güvenlik duvarında gerekli tüm portların açık olduğundan emin olun
3. Sistemi sağlanan betikler kullanarak başlatın

## Kullanım Talimatları

### Öğrenciler İçin

1. **MetaMask'ı Akadal Chain ile Ayarlayın**
   - MetaMask tarayıcı uzantısını yükleyin
   - MetaMask'ı açın ve "Ağ Ekle"yi seçin
   - Ağ detaylarını girin:
     - Ağ Adı: Akadal Chain
     - RPC URL: http://localhost:8545 (veya uzak sunucu kullanıyorsanız http://sunucu-ip-adresiniz:8545)
     - Zincir ID: 1337
     - Para Birimi Sembolü: ETH

2. **Test ETH İsteyin**
   - Faucet URL'sine gidin (http://localhost:3000 veya http://sunucu-ip-adresiniz:3000)
   - MetaMask cüzdan adresinizi girin
   - "Request Tokens" düğmesine tıklayın
   - Onay için bekleyin

3. **Token Alımını Doğrulayın**
   - Test ETH bakiyenizi görmek için MetaMask'ı açın
   - Ağ aktivitesini görüntülemek için gezgini kontrol edin (http://localhost:8080 veya http://sunucu-ip-adresiniz:8080)
   - Alternatif olarak, Blockscout Explorer'ı kullanın (http://localhost:4000 veya http://sunucu-ip-adresiniz:4000)

4. **Zincir ile Etkileşime Geçin**
   - Akıllı sözleşmeler dağıtın ve test edin
   - İşlemler gerçekleştirin
   - Yerel düğümünüze bağlı Remix IDE gibi araçları kullanın
   - Gezginlerde blockchain aktivitesini izleyin

### Remix'i Akadal Chain ile Kullanma

1. **Remix'i Akadal Chain'e Bağlama**
   - Remix IDE'yi açın: https://remix.ethereum.org/
   - "Deploy & Run Transactions" sekmesine gidin
   - "Environment" açılır menüsünden "Injected Provider - MetaMask"ı seçin
   - MetaMask'ınızın Akadal Chain'e bağlı olduğundan emin olun
   - Alternatif olarak, "Web3 Provider"ı seçebilir ve RPC URL'sini girebilirsiniz: http://localhost:8545 (veya http://sunucu-ip-adresiniz:8545)

2. **Akıllı Sözleşmeleri Dağıtma**
   - Akıllı sözleşmenizi Remix'te yazın veya içe aktarın
   - Sözleşmeyi derleyin
   - "Deploy & Run Transactions" sekmesinde sözleşmenizi seçin
   - Sözleşmeyi Akadal Chain'e dağıtmak için "Deploy"a tıklayın
   - İşlemi MetaMask'ta onaylayın

3. **Dağıtılmış Sözleşmelerle Etkileşim**
   - Dağıtımdan sonra, sözleşmeniz "Deployed Contracts" altında görünecektir
   - Sözleşme fonksiyonlarınızla doğrudan Remix'ten etkileşime geçebilirsiniz
   - Tüm işlemler Akadal Chain üzerinde işlenecektir

### Blockscout Explorer ile Akıllı Kontrat Etkileşimi

1. **Blockscout Explorer'a Erişim**
   - http://localhost:4000 adresine gidin (veya http://sunucu-ip-adresiniz:4000)
   - Gelişmiş özelliklere sahip kapsamlı bir blockchain gezgini göreceksiniz

2. **Cüzdanınızı Bağlayın**
   - Sağ üst köşedeki "Connect Wallet" düğmesine tıklayın
   - MetaMask'ı seçin ve bağlantıyı onaylayın
   - MetaMask'ınızın Akadal Chain'e bağlı olduğundan emin olun

3. **Akıllı Kontratları Görüntüleyin ve Etkileşime Geçin**
   - Dağıtılmış kontratınızı adresini arayarak bulun
   - Kontrat sayfasında şunları göreceksiniz:
     - Kontrat kodu ve doğrulama durumu
     - Etkileşime geçebileceğiniz okuma ve yazma fonksiyonları
     - Kontratla ilgili tüm işlemler
     - Token bilgileri (eğer bir token kontratıysa)

4. **Kontrat Fonksiyonlarını Çalıştırın**
   - Okuma fonksiyonları için: fonksiyona tıklayın ve sonuçları görüntüleyin
   - Yazma fonksiyonları için: 
     - Gerekli parametreleri doldurun
     - "Write" düğmesine tıklayın
     - İşlemi MetaMask'ta onaylayın
     - İşlemin işlenmesini bekleyin

5. **Akıllı Kontratları Doğrulayın**
   - Kontrat sayfanızda "Verify & Publish" düğmesine tıklayın
   - Kontrat kaynak kodunuzu yükleyin veya doğrudan girin
   - Derleme detaylarını sağlayın (derleyici sürümü, optimizasyon, vb.)
   - Doğrulama için gönderin
   - Doğrulandıktan sonra, tüm kontrat fonksiyonları etiketlenecek ve belgelenecektir

### Eğitmenler İçin

1. **Sistem Durumunu İzleyin**
   - Container durumunu kontrol edin: `docker-compose ps`
   - Logları görüntüleyin: `docker-compose logs -f [servis]`
   - Gezginler aracılığıyla blockchain aktivitesini izleyin (http://localhost:8080 ve http://localhost:4000, veya sunucu IP'niz)

2. **Faucet Fonlarını Yönetin**
   - Faucet, sistem başlangıcında otomatik olarak fonlanır
   - Sınırsız fonlama için, sonsuz fonlama servisini çalıştırın:
     ```
     # Windows'ta
     infinite-fund.bat
     
     # Linux/Mac'te
     ./infinite-fund.sh
     ```
   - Bu servis, faucet bakiyesini izleyecek ve gerektiğinde otomatik olarak yeniden dolduracaktır
   - Manuel fonlama için şunu çalıştırın:
     ```
     # Windows'ta
     fund-faucet.bat
     
     # Linux/Mac'te
     ./fund-faucet.sh
     ```

3. **Sistem Bakımı**
   - Sistemi güncelleyin: `docker-compose pull && docker-compose up -d`
   - Gerekirse servisleri yeniden başlatın: `docker-compose restart [servis]`
   - Tüm servisleri durdurun: `docker-compose down`
   - Servisleri durdurun ve hacimleri kaldırın: `docker-compose down -v` (dikkat: bu, tüm blockchain verilerini silecektir)

## Sorun Giderme

### Yaygın Sorunlar

1. **Servisler başlamıyor**
   - Logları kontrol edin: `docker-compose logs -f`
   - Yeterli sistem kaynağınız olduğundan emin olun
   - Gerekli portların kullanılabilir olduğunu doğrulayın

2. **Gezgin veri göstermiyor**
   - Gezginlerin Ethereum düğümüne bağlanması birkaç dakika sürebilir
   - Gezgin loglarını kontrol edin: `docker-compose logs -f explorer` veya `docker-compose logs -f blockscout`
   - Gezginleri yeniden başlatın: `docker-compose restart explorer` veya `docker-compose restart blockscout`

3. **Faucet ETH göndermiyor ("Faucet balance too low" hatası)**
   - Sonsuz fonlama servisini çalıştırın:
     ```
     # Windows'ta
     infinite-fund.bat
     
     # Linux/Mac'te
     ./infinite-fund.sh
     ```
   - Faucet loglarını kontrol edin: `docker-compose logs -f faucet`
   - Ethereum düğümünün faucet container'ından erişilebilir olduğunu doğrulayın
   - Faucet'i yeniden başlatın: `docker-compose restart faucet`

4. **Remix blockchain'e bağlanamıyor**
   - MetaMask'ın Akadal Chain'e düzgün şekilde bağlandığından emin olun
   - Remix'te "Injected Provider" yerine "Web3 Provider" kullanmayı deneyin
   - Ethereum düğümünün uygun CORS ayarlarıyla çalıştığını kontrol edin
   - RPC uç noktasının tarayıcınızdan erişilebilir olduğunu doğrulayın
   - Ethereum düğümünü yeniden başlatmayı deneyin: `docker-compose restart ethereum`

5. **Blockscout Explorer sorunları**
   - İlk indeksleme biraz zaman alabilir
   - Gezgin veri göstermiyorsa, logları kontrol edin: `docker-compose logs -f blockscout`
   - PostgreSQL veritabanının çalıştığından emin olun: `docker-compose logs -f postgres`
   - Gerekirse Blockscout'u yeniden başlatın: `docker-compose restart blockscout`

6. **Çevre değişkenleri uygulanmıyor**
   - `.env` dosyanızın projenin kök dizininde olduğundan emin olun
   - `.env` dosyasını değiştirdikten sonra tüm sistemi yeniden başlatın: `docker-compose down && docker-compose up -d`
   - Docker Compose'un değişkenleri okuduğunu kontrol edin: `docker-compose config`

## Çapraz Platform Uyumluluğu

Bu sistem hem Windows hem de Linux/Mac ortamlarında çalışacak şekilde tasarlanmıştır:

- **Windows**: Sistemi başlatmak ve yönetmek için `.bat` dosyalarını kullanın
- **Linux/Mac**: Sistemi başlatmak ve yönetmek için `.sh` dosyalarını kullanın

Temel işlevsellik tüm platformlarda aynıdır, yalnızca kabuk komut dosyaları platforma özgü gereksinimlere uyum sağlamak için farklılık gösterir.

## Depo

Bu projenin resmi deposu şu adreste mevcuttur: [https://github.com/akadal/blockchain-server](https://github.com/akadal/blockchain-server)

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için LICENSE dosyasına bakın.

## Teşekkürler

Doç. Dr. Emre Akadal tarafından eğitim amaçlı olarak oluşturulmuştur. 