import { useRouter } from "next/router";
import { useData } from "../context/DataContext";

export default function Step5() {
  const { data } = useData();
  const router = useRouter();
  const ahli = data.ahliWaris;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Step 5: Informasi Hukum</h1>
      <ul className="list-disc ml-5">
        {ahli.anakL > 0 && ahli.anakP > 0 && <li>Anak laki-laki mendapat 2x bagian anak perempuan.</li>}
        {ahli.suami && <li>Suami berhak 1/2 jika tidak ada anak, 1/4 jika ada anak.</li>}
        {ahli.istri && <li>Istri berhak 1/4 jika tidak ada anak, 1/8 jika ada anak.</li>}
        {ahli.ayah && <li>Ayah minimal berhak 1/6 jika ada anak.</li>}
        {ahli.ibu && <li>Ibu mendapat 1/6 jika ada anak, 1/3 jika tidak ada.</li>}
      </ul>
      <button onClick={() => router.push("/hasil")} className="bg-green-600 text-white px-4 py-2 rounded mt-4">Lihat Hasil ➡</button>
    </div>
  );
          }
