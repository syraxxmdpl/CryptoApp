<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Crypto App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="crypto-content">
      <div class="app-screen">
        <div class="button-area">
          <ion-button
            class="refresh-button"
            @click="ambilData"
            :disabled="loading"
          >
            <ion-spinner
              v-if="loading"
              name="crescent"
            />
            <span v-else>Refresh</span>
          </ion-button>
        </div>

        <div v-if="errorMessage" class="error-box">
          {{ errorMessage }}
        </div>

        <div class="crypto-list">
          <div
            v-for="coin in coins"
            :key="coin.id"
            class="crypto-row"
          >
            <div class="rank-column">
              <div class="small-label">Rank</div>
              <div class="rank-value">{{ coin.rank }}</div>
            </div>

            <div class="coin-column">
              <div class="coin-name">{{ coin.name }}</div>
              <div class="coin-symbol">{{ coin.symbol }}</div>
            </div>

            <div class="price-column">
              <div class="small-label">USD</div>
              <div class="coin-price">
                {{ formatPrice(coin.price_usd) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import EndPointAccess from '../services/EndPointAccess';

interface CryptoCoin {
  id: string;
  rank: string;
  name: string;
  symbol: string;
  price_usd: string;
}

interface CoinLoreResponse {
  data: CryptoCoin[];
  info: {
    coins_num: number;
    time: number;
  };
}

export default defineComponent({
  name: 'HomePage',
  components: {
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonSpinner,
    IonTitle,
    IonToolbar,
  },
  data() {
    return {
      coins: [] as CryptoCoin[],
      loading: false,
      errorMessage: '',
      apiUrl: 'https://api.coinlore.net/api/tickers/',
    };
  },
  mounted() {
    this.ambilData();
  },
  methods: {
    async ambilData() {
      this.loading = true;
      this.errorMessage = '';

      try {
        const endpoint = new EndPointAccess(this.apiUrl);
        const response = await endpoint.getRes<CoinLoreResponse>();

        this.coins = response.data.data.map((coin) => ({
          id: coin.id,
          rank: coin.rank,
          name: coin.name,
          symbol: coin.symbol,
          price_usd: coin.price_usd,
        }));
      } catch (error) {
        this.errorMessage =
          'Gagal mengambil data cryptocurrency. Periksa koneksi internet atau endpoint API.';
      } finally {
        this.loading = false;
      }
    },

    formatPrice(price: string) {
      const numberPrice = Number(price);

      if (Number.isNaN(numberPrice)) {
        return price;
      }

      return numberPrice.toLocaleString('en-US', {
        useGrouping: false,
        minimumFractionDigits: numberPrice >= 1 ? 2 : 2,
        maximumFractionDigits: 6,
      });
    },
  },
});
</script>

<style scoped>
.crypto-content {
  --background: var(--crypto-app-background);
}

.app-screen {
  max-width: 430px;
  min-height: 100%;
  margin: 0 auto;
  background: var(--crypto-app-background);
  padding-top: 28px;
}

.button-area {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0 24px;
}

.refresh-button {
  width: 150px;
  height: 58px;
  font-size: 18px;
  font-weight: 600;
  text-transform: none;

  --background: var(--crypto-button-background);
  --background-hover: var(--crypto-button-hover);
  --color: var(--crypto-button-text);
  --border-radius: 8px;
  --box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);
}

.error-box {
  margin: 0 12px 16px;
  padding: 12px;
  border-radius: 8px;
  background: #ffe2e2;
  color: #b00020;
  font-size: 14px;
  text-align: center;
}

.crypto-list {
  width: 100%;
  border-top: 2px solid var(--crypto-list-border);
}

.crypto-row {
  display: grid;
  grid-template-columns: 22% 29% 49%;
  align-items: center;
  min-height: 92px;
  padding: 10px 14px;
  background: var(--crypto-list-background);
  border-bottom: 2px solid var(--crypto-list-border);
  box-shadow: inset 0 -1px 0 var(--crypto-list-shadow);
}

.rank-column,
.coin-column,
.price-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.small-label {
  font-size: 18px;
  font-weight: 700;
  color: var(--crypto-text-secondary);
  margin-bottom: 6px;
}

.rank-value {
  font-size: 42px;
  font-weight: 500;
  color: var(--crypto-text-primary);
  line-height: 1;
}

.coin-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--crypto-text-secondary);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coin-symbol {
  font-size: 42px;
  font-weight: 500;
  color: var(--crypto-text-primary);
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coin-price {
  font-size: 38px;
  font-weight: 500;
  color: var(--crypto-text-primary);
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 380px) {
  .crypto-row {
    grid-template-columns: 22% 31% 47%;
    padding: 10px 10px;
  }

  .rank-value,
  .coin-symbol {
    font-size: 36px;
  }

  .coin-price {
    font-size: 32px;
  }

  .small-label,
  .coin-name {
    font-size: 15px;
  }
}
</style>