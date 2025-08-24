import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState } from "react";

export default function Step2() {
  const [val, setVal] = useState("");
  const { setData, data } = useData();
  const router = useRouter();

  const handleValChange = (e) => {
    const value = e.target.value.replace(/\./g, '');
    if (!isNaN(value)) {
      setVal(value);
    }
  };

  const next = () => {
    if (val < 0) return alert("Hutang tidak boleh negatif");
    setData({ ...data, hutang: parseFloat(val) });
    router.push("/wasiat");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Step 2: Total Hutang</h1>
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          Rp
        </span>
        <input
          type="text"
          value={val}
          onChange={handleValChange}
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
