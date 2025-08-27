import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import hitungFaraid from "../utils/faraid";
import { useEffect, useState } from "react";

export default function HasilPage() {
  const { data, setData } = useData();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // This effect handles the case where the user navigates directly to this page
  useEffect(() => {
    if (isClient && (!data.gender || !data.hartaKotor)) {
        router.replace('/');
    }
  }, [isClient, data.gender, data.hartaKotor, router]);

  if (!isClient || !data.gender) {
    // Render a loading state on the server and on initial client render to avoid hydration mismatch
    return <div className="p-6 max-w-lg mx-auto text-center">Memuat...</div>;
  }

  const { hartaKotor, hutang, wasiat, biayaMakam, ahliWaris } = data;
  const hartaBersih = (hartaKotor || 0) - (hutang || 0) - (biayaMakam || 0) - (wasiat || 0);
  const hasil = hitungFaraid(hartaBersih, ahliWaris || {});

  const heirNames = {
    suami: 'Suami',
    istri: 'Istri',
    ayah: 'Ayah',
    ibu: 'Ibu',
    kakek: 'Kakek dari si yang meninggal',
    nenek: 'Nenek dari si yang meninggal',
    anakL: 'Anak Laki-laki',
    anakP: 'Anak Perempuan',
    cucuL: 'Cucu Laki-laki',
    cucuP: 'Cucu Perempuan',
    saudaraL: 'Saudara Laki-laki',
    saudaraP: 'Saudara Perempuan',
  };

  const asabahExplanations = {
    "'Aṣabah bin-Nafs": "Ashabah bin Nafsi: Mendapat sisa karena kedudukannya sendiri.",
    "'Aṣabah bil-Ghair": "Ashabah bil Ghair: Menjadi 'aṣabah karena ada ahli waris laki-laki setingkat.",
    "'Aṣabah ma'al-Ghair": "Ashabah ma'al Ghair: Menjadi 'aṣabah bersama ahli waris perempuan lain.",
  };

  const getHeirName = (key) => heirNames[key] || key;

  const getDeskripsiLengkap = (value) => {
    if (value.deskripsi && asabahExplanations[value.deskripsi]) {
      return asabahExplanations[value.deskripsi];
    }
    return value.deskripsi || value.status;
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const restart = () => {
    setData({
      gender: null,
      hartaKotor: 0,
      hutang: 0,
      biayaMakam: 0,
      wasiat: 0,
      ahliWaris: {
        suami: false, istri: false, ayah: false, ibu: false, kakek: false, nenek: false,
        anakL: 0, anakP: 0, cucuL: 0, cucuP: 0, saudaraL: 0, saudaraP: 0,
      }
    });
    router.push('/');
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center text-gray-800">💰 Hasil Pembagian Warisan</h1>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Rincian Harta</h2>
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between"><span>Harta Waris:</span> <span>{formatRupiah(hartaKotor)}</span></div>
          <div className="flex justify-between"><span>Hutang:</span> <span>- {formatRupiah(hutang)}</span></div>
          <div className="flex justify-between"><span>Biaya Pengurusan Jenazah:</span> <span>- {formatRupiah(biayaMakam)}</span></div>
          <div className="flex justify-between"><span>Wasiat:</span> <span>- {formatRupiah(wasiat)}</span></div>
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
          <span>Total Warisan:</span>
          <span>{formatRupiah(hartaBersih)}</span>
        </div>
      </div>

      {hartaBersih > 0 ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3 text-center">Pembagian untuk Ahli Waris</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ahli Waris</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status / Keterangan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Diterima</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.keys(hasil).length > 0 ? (
                  Object.entries(hasil).map(([key, value]) => (
                    <tr key={key} className={value.status.includes('Terhalang') ? 'bg-red-50 text-gray-500' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{getHeirName(key)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getDeskripsiLengkap(value)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right font-mono">{formatRupiah(value.jumlah)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Tidak ada ahli waris yang berhak menerima.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg text-center">
            <h2 className="text-lg font-semibold text-yellow-800">Harta Tidak Cukup</h2>
            <p className="text-yellow-700 mt-1">Total warisan adalah nol atau negatif, sehingga tidak ada harta yang dapat dibagikan.</p>
        </div>
      )}

      <div className="flex justify-center space-x-4 pt-4">
        <button onClick={() => router.back()} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
          ⬅ Kembali
        </button>
        <button onClick={restart} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Hitung Ulang
        </button>
      </div>
    </div>
  );
}
