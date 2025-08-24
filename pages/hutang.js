import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState } from "react";

export default function Step2() {
  const [hutangVal, setHutangVal] = useState("");
  const [makamVal, setMakamVal] = useState("");
  const { setData, data } = useData();
  const router = useRouter();

  const handleHutangChange = (e) => {
    const value = e.target.value.replace(/\./g, '');
    if (!isNaN(value)) {
      setHutangVal(value);
    }
  };

  const handleMakamChange = (e) => {
    const value = e.target.value.replace(/\./g, '');
    if (!isNaN(value)) {
      setMakamVal(value);
    }
  };

  const next = () => {
    const hutang = parseFloat(hutangVal) || 0;
    const biayaMakam = parseFloat(makamVal) || 0;
    if (hutang < 0) return alert("Hutang tidak boleh negatif");
    if (biayaMakam < 0) return alert("Biaya pemakaman tidak boleh negatif");
    setData({ ...data, hutang, biayaMakam });
    router.push("/wasiat");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Step 2: Hutang & Biaya Pengurusan Jenazah</h1>

      <h2 className="text-lg font-semibold mb-2">Total Hutang</h2>
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          Rp
        </span>
        <input
          type="text"
          value={hutangVal}
          onChange={handleHutangChange}
          className="border p-2 pl-10 w-full"
          placeholder="0"
        />
      </div>

      <h2 className="text-lg font-semibold mb-2">Biaya Pengurusan Jenazah</h2>
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          Rp
        </span>
        <input
          type="text"
          value={makamVal}
          onChange={handleMakamChange}
          className="border p-2 pl-10 w-full"
          placeholder="0"
        />
      </div>

      <div className="flex justify-between">
        <button onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded">⬅ Back</button>
        <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">Next ➡</button>
      </div>
    </div>
  );
}
