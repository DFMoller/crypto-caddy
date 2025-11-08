import CoinCard from './CoinCard';
import type { FunctionComponent } from 'react';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  marketCap: number;
  currentPrice: number;
}

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
      />
    ))
  );
};

export default CoinList;
