import styles from './Store.module.css';

const products = [
  { id: 1, name: 'Космический меч', price: 150, emoji: '⚔️' },
  { id: 2, name: 'Плащ невидимости', price: 300, emoji: '🧥' },
  { id: 3, name: 'Зелье маны', price: 50, emoji: '🧪' },
];

export default function Store() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Магазин</h1>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.emoji}>{product.emoji}</div>
            <h3>{product.name}</h3>
            <p>{product.price} ⚡</p>
            <button className={styles.buyButton}>Купить</button>
          </div>
        ))}
      </div>
    </div>
  );
}