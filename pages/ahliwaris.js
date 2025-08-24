import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState } from "react";

export default function AhliWarisPage() {
  const { setData, data } = useData();
  const router = useRouter();

  const [waris, setWaris] = useState({
    suami: false,
    istri: false,
    ayah: false,
    ibu: false,
    anakL: 0,
    anakP: 0
  });

  const update = (key, value) => setWaris({ ...waris, [key]: value });

  const next = () => {
    setData({ ...data, ahliWaris: waris });
    router.push("/hasil");
  };

  const checkboxLabelStyle = "flex items-center space-x-2 text-lg mb-2";
  const inputStyle = "border p-2 rounded-md w-20 text-center";

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold mb-4 text-center">Step 4: Data Ahli Waris</h1>

      <div className="space-y-3">
        {data.gender === 'perempuan' && (
          <label className={checkboxLabelStyle}><input type="checkbox" className="h-5 w-5" onChange={(e) => update("suami", e.target.checked)} /> <span>Suami</span></label>
        )}
        {data.gender === 'laki' && (
          <label className={checkboxLabelStyle}><input type="checkbox" className="h-5 w-5" onChange={(e) => update("istri", e.target.checked)} /> <span>Istri</span></label>
        )}

        <label className={checkboxLabelStyle}><input type="checkbox" className="h-5 w-5" onChange={(e) => update("ayah", e.target.checked)} /> <span>Ayah</span></label>
        <label className={checkboxLabelStyle}><input type="checkbox" className="h-5 w-5" onChange={(e) => update("ibu", e.target.checked)} /> <span>Ibu</span></label>

        <div className="flex items-center justify-between py-2">
          <label htmlFor="anakLaki" className="text-lg">Anak Laki-laki:</label>
          <input id="anakLaki" type="number" min="0" defaultValue="0" onChange={(e) => update("anakL", parseInt(e.target.value) || 0)} className={inputStyle} />
        </div>
        <div className="flex items-center justify-between py-2">
          <label htmlFor="anakPerempuan" className="text-lg">Anak Perempuan:</label>
          <input id="anakPerempuan" type="number" min="0" defaultValue="0" onChange={(e) => update("anakP", parseInt(e.target.value) || 0)} className={inputStyle} />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded">⬅ Back</button>
        <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">Next ➡</button>
      </div>
    </div>
  );
  }
