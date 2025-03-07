# Akadal Chain: Educational Blockchain Environment

This repository contains a simple educational blockchain environment with an Ethereum node, a network explorer, and a faucet for distributing test tokens to students.

[Türkçe Dokümantasyon için aşağı kaydırın](#akadal-chain-eğitim-amaçlı-blockchain-ortamı)

## System Components

1. **Ethereum Node (Geth)**: A full-featured EVM-compatible blockchain
2. **Ethereum Explorer**: A simple explorer to view blockchain activity
3. **Custom Faucet**: A web UI to distribute test ETH to students

## Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system
- At least 2GB RAM, 2 vCPUs, and 40GB SSD storage
- Node.js (for infinite faucet funding)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/akadal-chain.git
   cd akadal-chain
   ```

2. Start the system:
   ```
   # On Windows
   simple-fund.bat
   
   # On Linux/Mac
   ./start.sh
   ```

3. (Optional) Enable infinite faucet funding:
   ```
   # On Windows
   infinite-fund.bat
   
   # On Linux/Mac
   ./infinite-fund.sh
   ```

### Access Points

Once the system is running, you can access the following services:

- **Faucet**: http://localhost:3000
- **Network Explorer**: http://localhost:8080
- **Ethereum RPC**: http://localhost:8545

## Usage Instructions

### For Students

1. **Set up MetaMask with Akadal Chain**
   - Install MetaMask browser extension
   - Open MetaMask and select "Add Network"
   - Enter the network details:
     - Network Name: Akadal Chain
     - RPC URL: http://localhost:8545
     - Chain ID: 1337
     - Currency Symbol: ETH

2. **Request Test ETH**
   - Navigate to the faucet URL (http://localhost:3000)
   - Enter your MetaMask wallet address
   - Click "Request Tokens"
   - Wait for confirmation

3. **Verify Receipt of Tokens**
   - Open MetaMask to see your test ETH balance
   - Check the explorer (http://localhost:8080) to view network activity

4. **Interact with the Chain**
   - Deploy and test smart contracts
   - Execute transactions
   - Use tools like Remix IDE connected to your local node
   - Monitor blockchain activity in the explorer

### For Instructors

1. **Monitor System Status**
   - Check container status: `docker-compose ps`
   - View logs: `docker-compose logs -f [service]`
   - Monitor blockchain activity through the explorer (http://localhost:8080)

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
   - It may take a few minutes for the explorer to connect to the Ethereum node
   - Check explorer logs: `docker-compose logs -f explorer`
   - Restart the explorer: `docker-compose restart explorer`

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

## Cross-Platform Compatibility

This system is designed to work on both Windows and Linux/Mac environments:

- **Windows**: Use the `.bat` files for starting and managing the system
- **Linux/Mac**: Use the `.sh` files for starting and managing the system

The core functionality is identical across platforms, with only the shell scripts differing to accommodate platform-specific requirements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

Created by Assoc. Prof. Dr. Emre Akadal for educational purposes.

---

# Akadal Chain: Eğitim Amaçlı Blockchain Ortamı

Bu depo, öğrencilere test token'ları dağıtmak için bir Ethereum düğümü, ağ gezgini ve faucet içeren basit bir eğitim amaçlı blockchain ortamı içerir.

## Sistem Bileşenleri

1. **Ethereum Düğümü (Geth)**: Tam özellikli EVM uyumlu blockchain
2. **Ethereum Gezgini**: Blockchain aktivitesini görüntülemek için basit bir gezgin
3. **Özel Faucet**: Öğrencilere test ETH dağıtmak için web arayüzü

## Hızlı Başlangıç

### Ön Koşullar

- Sisteminizde Docker ve Docker Compose kurulu olmalı
- En az 2GB RAM, 2 vCPU ve 40GB SSD depolama alanı
- Node.js (sonsuz faucet fonlaması için)

### Kurulum

1. Bu depoyu klonlayın:
   ```
   git clone https://github.com/yourusername/akadal-chain.git
   cd akadal-chain
   ```

2. Sistemi başlatın:
   ```
   # Windows'ta
   simple-fund.bat
   
   # Linux/Mac'te
   ./start.sh
   ```

3. (İsteğe bağlı) Sonsuz faucet fonlamasını etkinleştirin:
   ```
   # Windows'ta
   infinite-fund.bat
   
   # Linux/Mac'te
   ./infinite-fund.sh
   ```

### Erişim Noktaları

Sistem çalışmaya başladıktan sonra, aşağıdaki hizmetlere erişebilirsiniz:

- **Faucet**: http://localhost:3000
- **Ağ Gezgini**: http://localhost:8080
- **Ethereum RPC**: http://localhost:8545

## Kullanım Talimatları

### Öğrenciler İçin

1. **MetaMask'ı Akadal Chain ile Ayarlayın**
   - MetaMask tarayıcı uzantısını yükleyin
   - MetaMask'ı açın ve "Ağ Ekle"yi seçin
   - Ağ detaylarını girin:
     - Ağ Adı: Akadal Chain
     - RPC URL: http://localhost:8545
     - Zincir ID: 1337
     - Para Birimi Sembolü: ETH

2. **Test ETH İsteyin**
   - Faucet URL'sine gidin (http://localhost:3000)
   - MetaMask cüzdan adresinizi girin
   - "Request Tokens" düğmesine tıklayın
   - Onay için bekleyin

3. **Token Alımını Doğrulayın**
   - Test ETH bakiyenizi görmek için MetaMask'ı açın
   - Ağ aktivitesini görüntülemek için gezgini kontrol edin (http://localhost:8080)

4. **Zincir ile Etkileşime Geçin**
   - Akıllı sözleşmeler dağıtın ve test edin
   - İşlemler gerçekleştirin
   - Yerel düğümünüze bağlı Remix IDE gibi araçları kullanın
   - Gezginde blockchain aktivitesini izleyin

### Eğitmenler İçin

1. **Sistem Durumunu İzleyin**
   - Container durumunu kontrol edin: `docker-compose ps`
   - Logları görüntüleyin: `docker-compose logs -f [servis]`
   - Gezgin aracılığıyla blockchain aktivitesini izleyin (http://localhost:8080)

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
   - Gezginin Ethereum düğümüne bağlanması birkaç dakika sürebilir
   - Gezgin loglarını kontrol edin: `docker-compose logs -f explorer`
   - Gezgini yeniden başlatın: `docker-compose restart explorer`

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

## Çapraz Platform Uyumluluğu

Bu sistem hem Windows hem de Linux/Mac ortamlarında çalışacak şekilde tasarlanmıştır:

- **Windows**: Sistemi başlatmak ve yönetmek için `.bat` dosyalarını kullanın
- **Linux/Mac**: Sistemi başlatmak ve yönetmek için `.sh` dosyalarını kullanın

Temel işlevsellik tüm platformlarda aynıdır, yalnızca kabuk komut dosyaları platforma özgü gereksinimlere uyum sağlamak için farklılık gösterir.

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için LICENSE dosyasına bakın.

## Teşekkürler

Doç. Dr. Emre Akadal tarafından eğitim amaçlı olarak oluşturulmuştur. 