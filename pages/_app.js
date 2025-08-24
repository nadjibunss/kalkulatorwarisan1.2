import '../styles/globals.css';
import { DataProvider } from '../context/DataContext';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </DataProvider>
  );
}

export default MyApp;
