import { useData } from "../context/DataContext";
import hitungFaraid from "../utils/faraid";
import { useRouter } from "next/router";

export default function Hasil() {
  const { data } = useData();
  const router = useRouter();

  if (!data || !data.ahliWaris) {
      if (typeof window !== "undefined") {
          router.push('/');
      }
      return null;
  }

  const hartaBersih = (data.hartaKotor || 0) - (data.hutang || 0) - (data.wasiat || 0);
  const hasil = hitungFaraid(hartaBersih, data.ahliWaris || {});

  const totalTerbagi = Object.values(hasil).reduce((sum, { bagian }) => sum + bagian, 0);
  const sisaHarta = hartaBersih - totalTerbagi;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">💰 Hasil Pembagian Warisan</h1>
        <p className="text-lg text-center text-gray-600 mb-6">Berdasarkan data yang Anda masukkan</p>

        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mb-6">
          <p className="font-bold">Harta Bersih Siap Dibagi:</p>
          <p className="text-2xl">Rp {hartaBersih.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-700">Rincian Bagian Ahli Waris:</h2>

        <div className="space-y-4">
          {Object.keys(hasil).length > 0 ? (
            Object.entries(hasil).map(([nama, rincian]) => (
              <div key={nama} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-indigo-700">
                    {nama} {rincian.jumlah > 1 ? `(${rincian.jumlah} orang)` : ''}
                  </h3>
                  <span className="font-semibold text-lg text-gray-800">
                    Rp {rincian.bagian.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{rincian.keterangan}</p>
                {rincian.jumlah > 1 && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    (Bagian per orang: Rp {rincian.perOrang.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Tidak ada ahli waris yang berhak menerima warisan dari data yang dimasukkan.</p>
          )}
        </div>

        {sisaHarta > 0.01 && (
            <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
                <p className="font-bold">Sisa Harta:</p>
                <p>Terdapat sisa harta sebesar Rp {sisaHarta.toLocaleString("id-ID")} yang tidak terbagi (mungkin memerlukan proses Radd atau dikembalikan ke Baitul Mal, tergantung mazhab).</p>
            </div>
        )}
      </div>
       <div className="mt-6 text-center">
            <button onClick={() => router.push('/')} className="bg-gray-600 text-white px-6 py-2 rounded font-bold hover:bg-gray-700">
                Hitung Ulang
            </button>
        </div>
    </div>
  );
}
