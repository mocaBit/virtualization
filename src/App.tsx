import VirtualTimeline from './components/VirtualTimeline';
import Header from './components/Header';
import Footer from './components/Footer';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <Header />
        <main>
          <VirtualTimeline />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
