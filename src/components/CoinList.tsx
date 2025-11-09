import CoinCard from './CoinCard';
import type { FunctionComponent } from 'react';
import type { Coin } from '../store/apiSlice';

interface CoinListProps {
  coins: Coin[];
}

const CoinList: FunctionComponent<CoinListProps> = ({ coins }: CoinListProps) => {
  return (
    // Coin Cards.
    coins.map((coin) => (
      <CoinCard
        key={coin.id}
        id={coin.id}
        name={coin.name}
        symbol={coin.symbol}
        image={coin.image}
        marketCap={coin.marketCap}
        currentPrice={coin.currentPrice}
        priceChangePercentage24h={coin.priceChangePercentage24h}
        priceChangePercentage7d={coin.priceChangePercentage7d}
        sparklineData={coin.sparklineData}
      />
    ))
  );
};

export default CoinList;
