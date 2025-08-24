import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import hitungFaraid from "../utils/faraid";

export default function HasilPage() {
  const { data, setData } = useData();
  const router = useRouter();
  const { hartaKotor, hutang, wasiat, biayaMakam, ahliWaris } = data;

  // Ensure data is available before rendering
  if (!hartaKotor) {
    // Or show a loading state
    if (typeof window !== 'undefined') {
      router.push('/home');
    }
    return null;
  }

  const hartaBersih = hartaKotor - (hutang || 0) - (biayaMakam || 0) - (wasiat || 0);
  const hasil = hitungFaraid(hartaBersih, ahliWaris || {});

  const restart = () => {
    setData({
      gender: null,
      hartaKotor: 0,
      hutang: 0,
      biayaMakam: 0,
      wasiat: 0,
      ahliWaris: {}
    });
    router.push('/home');
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center text-gray-800">💰 Hasil Pembagian Warisan</h1>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Rincian Harta</h2>
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between"><span>Harta Kotor:</span> <span>Rp {hartaKotor.toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between"><span>Hutang:</span> <span>- Rp {hutang.toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between"><span>Biaya Pengurusan Jenazah:</span> <span>- Rp {biayaMakam.toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between"><span>Wasiat:</span> <span>- Rp {wasiat.toLocaleString("id-ID")}</span></div>
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
          <span>Total Warisan:</span>
          <span>Rp {hartaBersih.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3 text-center">Pembagian untuk Ahli Waris</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ahli Waris</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bagian Diterima</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.keys(hasil).length > 0 ? (
                Object.entries(hasil).map(([key, value]) => (
                  <tr key={key}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">Rp {value.toLocaleString("id-ID")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-gray-500">Tidak ada ahli waris yang berhak menerima.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center mt-6">
        <button onClick={restart} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Hitung Ulang
        </button>
      </div>
    </div>
  );
}
