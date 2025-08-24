import { useData } from "../context/DataContext";
import hitungFaraid from "../utils/faraid";

export default function Step6() {
  const { data } = useData();
  const hartaBersih = data.hartaKotor - data.hutang - data.wasiat;
  const hasil = hitungFaraid(hartaBersih, data.ahliWaris);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">💰 Hasil Pembagian Warisan</h1>
      <p>Harta Bersih: Rp {hartaBersih.toLocaleString("id-ID")}</p>
      <div className="mt-4">
        {Object.entries(hasil).map(([key, value]) => (
          <p key={key}>{key}: Rp {value.toLocaleString("id-ID")}</p>
        ))}
      </div>
    </div>
  );
}
