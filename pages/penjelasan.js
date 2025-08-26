import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import hitungFaraid from "../utils/faraid";
import { useEffect, useState } from "react";

export default function PenjelasanPage() {
  const { data } = useData();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !data.gender) {
    // Render a loading state or null on the server and on the initial client render.
    // This prevents a hydration mismatch.
    // Also, redirect if essential data is missing (e.g., page refresh).
    if (isClient) {
        router.replace('/home');
    }
    return <div className="p-6 max-w-lg mx-auto text-center">Memuat...</div>;
  }

  const { hartaKotor, hutang, wasiat, biayaMakam, ahliWaris } = data;
  const hartaBersih = (hartaKotor || 0) - (hutang || 0) - (biayaMakam || 0) - (wasiat || 0);
  const hasil = hitungFaraid(hartaBersih, ahliWaris || {});

  const blockedHeirs = Object.entries(hasil).filter(([, value]) => value.status.includes("Terhalang"));
  const asabahHeirs = Object.entries(hasil).filter(([, value]) => value.deskripsi.includes("Aṣabah"));

  const toTitleCase = (str) => {
    if (!str) return '';
    const spaced = str.replace(/([A-Z])/g, ' $1').replace('L', ' Laki-laki').replace('P', ' Perempuan');
    return spaced.replace(/^./, (s) => s.toUpperCase()).trim();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center text-gray-800">Penjelasan Status Ahli Waris</h1>

      {hartaBersih <= 0 ? (
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold text-yellow-800">Harta Tidak Cukup</h2>
          <p className="text-yellow-700 mt-1">Total harta tidak mencukupi untuk dibagikan setelah dikurangi hutang, biaya, dan wasiat.</p>
        </div>
      ) : (
        <>
          {/* Hijab Section */}
          {blockedHeirs.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg mt-4">
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
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
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

          {Object.keys(hasil).length > 0 && blockedHeirs.length === 0 && asabahHeirs.length === 0 && (
              <p className="text-center text-gray-600 mt-4">Semua ahli waris yang ada mendapatkan bagian tetap (Ashabul Furudh) dan tidak ada yang menjadi 'Aṣabah atau terhalang.</p>
          )}

          {Object.keys(hasil).length === 0 && hartaBersih > 0 &&(
             <p className="text-center text-gray-600 mt-4">Tidak ada ahli waris yang berhak menerima warisan.</p>
          )}
        </>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">⬅ Kembali</button>
        <button onClick={() => router.push('/hasil')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">Lihat Hasil Perhitungan ➡</button>
      </div>
    </div>
  );
}
