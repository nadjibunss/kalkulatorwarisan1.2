import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import hitungFaraid from "../utils/faraid";

export default function PenjelasanPage() {
  const { data } = useData();
  const router = useRouter();
  const { hartaKotor, hutang, wasiat, biayaMakam, ahliWaris } = data;

  // Redirect if data is not available
  if (!hartaKotor && typeof window !== 'undefined') {
    router.push('/home');
    return null;
  }

  const hartaBersih = (hartaKotor || 0) - (hutang || 0) - (biayaMakam || 0) - (wasiat || 0);
  const hasil = hitungFaraid(hartaBersih, ahliWaris || {});

  const blockedHeirs = Object.entries(hasil).filter(([key, value]) => value.status.includes("Terhalang"));
  const asabahHeirs = Object.entries(hasil).filter(([key, value]) => value.deskripsi.includes("Aṣabah"));

  const toTitleCase = (str) => str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">Penjelasan Status Ahli Waris</h1>

      {/* Hijab Section */}
      {blockedHeirs.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-red-800">Ahli Waris yang Terhalang (Hijab)</h2>
          <ul className="list-disc list-inside space-y-1 text-red-700">
            {blockedHeirs.map(([key, value]) => (
              <li key={key}>
                <strong>{toTitleCase(key)}:</strong> {value.deskripsi}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Asabah Section */}
      {asabahHeirs.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-800">Ahli Waris 'Aṣabah</h2>
          <p className="text-sm text-blue-700 mb-2">'Aṣabah adalah ahli waris yang menerima sisa harta setelah pembagian Ashabul Furudh (bagian tetap).</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            {asabahHeirs.map(([key, value]) => (
              <li key={key}>
                <strong>{toTitleCase(key)}:</strong> Menjadi <strong>{value.deskripsi}</strong>.
              </li>
            ))}
          </ul>
        </div>
      )}

      {blockedHeirs.length === 0 && asabahHeirs.length === 0 && (
          <p className="text-center text-gray-600">Semua ahli waris yang ada mendapatkan bagian tetap (Ashabul Furudh) dan tidak ada yang menjadi 'Aṣabah atau terhalang.</p>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">⬅ Kembali</button>
        <button onClick={() => router.push('/hasil')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">Lihat Hasil Perhitungan ➡</button>
      </div>
    </div>
  );
}
