import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState } from "react";

export default function Step1() {
  const [val, setVal] = useState("");
  const { setData, data } = useData();
  const router = useRouter();

  const next = () => {
    if (!val || val <= 0) return alert("Masukkan harta kotor yang valid");
    setData({ ...data, hartaKotor: parseFloat(val) });
    router.push("/hutang");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Step 1: Total Harta Kotor</h1>
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="border p-2 w-full mb-4"
        placeholder="Masukkan jumlah harta kotor"
      />
      <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">Next ➡</button>
    </div>
  );
}
