import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState } from "react";

export default function HomePage() {
  const [val, setVal] = useState("");
  const [gender, setGender] = useState(null);
  const { setData, data } = useData();
  const router = useRouter();

  const handleValChange = (e) => {
    const value = e.target.value.replace(/\./g, '');
    if (!isNaN(value)) {
      setVal(value);
    }
  };

  const next = () => {
    // The button will be disabled, so direct validation alerts are less critical
    // but we keep them as a fallback.
    if (!gender) return alert("Pilih jenis kelamin yang meninggal");
    if (!val || parseFloat(val) <= 0) return alert("Masukkan harta kotor yang valid");
    setData({ ...data, gender: gender, hartaKotor: parseFloat(val) });
    router.push("/hutang");
  };

  const isNextDisabled = !gender || !val || parseFloat(val) <= 0;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Data Awal</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Pilih Jenis Kelamin yang Meninggal:</h2>
        <div className="flex items-center mb-2">
          <input type="radio" id="laki" name="gender" value="laki" onChange={(e) => setGender(e.target.value)} className="mr-2" />
          <label htmlFor="laki">Laki-laki</label>
        </div>
        <div className="flex items-center">
          <input type="radio" id="perempuan" name="gender" value="perempuan" onChange={(e) => setGender(e.target.value)} className="mr-2" />
          <label htmlFor="perempuan">Perempuan</label>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2">Step 1: Total Harta Kotor</h2>
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
      <button
        onClick={next}
        disabled={isNextDisabled}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Next ➡
      </button>
    </div>
  );
}
