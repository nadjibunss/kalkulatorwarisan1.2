import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState } from "react";

export default function Step4() {
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
    router.push("/infohukum");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Step 4: Data Ahli Waris</h1>
      <label className="block"><input type="checkbox" onChange={(e) => update("suami", e.target.checked)} /> Suami</label>
      <label className="block"><input type="checkbox" onChange={(e) => update("istri", e.target.checked)} /> Istri</label>
      <label className="block"><input type="checkbox" onChange={(e) => update("ayah", e.target.checked)} /> Ayah</label>
      <label className="block"><input type="checkbox" onChange={(e) => update("ibu", e.target.checked)} /> Ibu</label>
      <label>Anak Laki-laki: <input type="number" onChange={(e) => update("anakL", parseInt(e.target.value) || 0)} /></label>
      <label>Anak Perempuan: <input type="number" onChange={(e) => update("anakP", parseInt(e.target.value) || 0)} /></label>
      <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Next ➡</button>
    </div>
  );
  }
