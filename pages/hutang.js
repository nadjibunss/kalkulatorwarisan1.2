import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState } from "react";

export default function Step2() {
  const [val, setVal] = useState("");
  const { setData, data } = useData();
  const router = useRouter();

  const next = () => {
    if (val < 0) return alert("Hutang tidak boleh negatif");
    setData({ ...data, hutang: parseFloat(val) });
    router.push("/wasiat");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Step 2: Total Hutang</h1>
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="border p-2 w-full mb-4"
        placeholder="Masukkan total hutang"
      />
      <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">Next ➡</button>
    </div>
  );
}
