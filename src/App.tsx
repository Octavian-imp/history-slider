import HistorySlider from "./components/slider";
import mockStore from "./mock/store";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.main_wrapper}>
      <span className={styles.center_line__vertical}></span>
      <div className={styles.content}>
        <span className={styles.center_line__horizontal}></span>
        <h1 className={styles.content__title}>Исторические даты</h1>

        <HistorySlider dataset={mockStore} />
      </div>
    </div>
  );
}

export default App;
