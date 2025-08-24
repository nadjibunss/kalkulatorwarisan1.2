import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState } from "react";

export default function Step3() {
  const [val, setVal] = useState("");
  const { setData, data } = useData();
  const router = useRouter();

  const hartaBersihSementara = data.hartaKotor - data.hutang;
  const maxWasiat = hartaBersihSementara / 3;

  const next = () => {
    if (val < 0) return alert("Wasiat tidak boleh negatif");
    if (parseFloat(val) > maxWasiat) {
      return alert(`Wasiat maksimal adalah Rp ${maxWasiat.toLocaleString("id-ID")}`);
    }
    setData({ ...data, wasiat: parseFloat(val) });
    router.push("/ahliwaris");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Step 3: Wasiat</h1>
      <p className="mb-2 text-gray-600">Maksimal 1/3 dari sisa harta setelah hutang.</p>
      <p className="mb-4">Batas maksimal: Rp {maxWasiat.toLocaleString("id-ID")}</p>
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="border p-2 w-full mb-4"
        placeholder="Masukkan total wasiat"
      />
      <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">Next ➡</button>
    </div>
  );
          }
