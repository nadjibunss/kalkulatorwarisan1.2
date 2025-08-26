import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState, useEffect } from "react";

export default function Step4() {
  const { setData, data } = useData();
  const router = useRouter();

  const [waris, setWaris] = useState({
    suami: false,
    istri: false,
    ayah: false,
    ibu: false,
    anakL: 0,
    anakP: 0,
    kakek: false,
    nenek: false,
    cucuL: 0,
    cucuP: 0,
    saudaraL: 0,
    saudaraP: 0,
  });

  const [disabledWaris, setDisabledWaris] = useState({});
  const [popup, setPopup] = useState({ show: false, message: "" });

  useEffect(() => {
    const newDisabled = {
      kakek: waris.ayah,
      nenek: waris.ibu,
      cucuL: waris.anakL > 0,
      cucuP: waris.anakL > 0,
      saudaraL: waris.anakL > 0 || waris.cucuL > 0 || waris.ayah,
      saudaraP: waris.anakL > 0 || waris.cucuL > 0 || waris.ayah,
    };

    const newWaris = { ...waris };
    let changed = false;
    for (const key in newDisabled) {
      if (newDisabled[key]) {
        if (typeof waris[key] === "boolean" && waris[key]) {
          newWaris[key] = false;
          changed = true;
        } else if (typeof waris[key] === "number" && waris[key] > 0) {
          newWaris[key] = 0;
          changed = true;
        }
      }
    }
    if (changed) {
      setWaris(newWaris);
    }

    setDisabledWaris(newDisabled);
  }, [waris]);

  const update = (key, value) => {
    setWaris({ ...waris, [key]: value });
  };

  const handleLabelClick = (ahliWaris, message) => {
    if (disabledWaris[ahliWaris]) {
      setPopup({ show: true, message });
    }
  };

  const next = () => {
    setData({ ...data, ahliWaris: waris });
    router.push("/hasil");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      {popup.show && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-lg font-bold mb-2">Ahli Waris Terhalang (Hijab)</h3>
            <p className="mb-4">{popup.message}</p>
            <button
              onClick={() => setPopup({ show: false, message: "" })}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      <h1 className="text-xl font-bold mb-4">Langkah 4: Data Ahli Waris</h1>

      <div className="space-y-2">
        <label className="flex items-center"><input type="checkbox" checked={waris.suami} onChange={(e) => update("suami", e.target.checked)} className="mr-2"/> Suami</label>
        <label className="flex items-center"><input type="checkbox" checked={waris.istri} onChange={(e) => update("istri", e.target.checked)} className="mr-2"/> Istri</label>
        <label className="flex items-center"><input type="checkbox" checked={waris.ayah} onChange={(e) => update("ayah", e.target.checked)} className="mr-2"/> Ayah</label>
        <label className="flex items-center"><input type="checkbox" checked={waris.ibu} onChange={(e) => update("ibu", e.target.checked)} className="mr-2"/> Ibu</label>
        <label className="flex items-center">Anak Laki-laki: <input type="number" value={waris.anakL} min="0" onChange={(e) => update("anakL", parseInt(e.target.value) || 0)} className="ml-2 w-20 p-1 border rounded" /></label>
        <label className="flex items-center">Anak Perempuan: <input type="number" value={waris.anakP} min="0" onChange={(e) => update("anakP", parseInt(e.target.value) || 0)} className="ml-2 w-20 p-1 border rounded" /></label>
      </div>

      <hr className="my-4" />
      <h2 className="text-lg font-semibold mb-2">Kerabat Lainnya</h2>

      <div className="space-y-2">
        <div onClick={() => handleLabelClick('kakek', 'Kakek terhalang (hijab) oleh Ayah.')}>
          <label className={`flex items-center ${disabledWaris.kakek ? 'text-gray-400 cursor-not-allowed' : ''}`}><input type="checkbox" checked={waris.kakek} disabled={disabledWaris.kakek} onChange={(e) => update("kakek", e.target.checked)} className="mr-2"/> Kakek</label>
        </div>
        <div onClick={() => handleLabelClick('nenek', 'Nenek terhalang (hijab) oleh Ibu.')}>
          <label className={`flex items-center ${disabledWaris.nenek ? 'text-gray-400 cursor-not-allowed' : ''}`}><input type="checkbox" checked={waris.nenek} disabled={disabledWaris.nenek} onChange={(e) => update("nenek", e.target.checked)} className="mr-2"/> Nenek</label>
        </div>
        <div onClick={() => handleLabelClick('cucuL', 'Cucu Laki-laki terhalang (hijab) oleh Anak Laki-laki.')}>
          <label className={`flex items-center ${disabledWaris.cucuL ? 'text-gray-400 cursor-not-allowed' : ''}`}>Cucu Laki-laki: <input type="number" value={waris.cucuL} min="0" disabled={disabledWaris.cucuL} onChange={(e) => update("cucuL", parseInt(e.target.value) || 0)} className="ml-2 w-20 p-1 border rounded" /></label>
        </div>
        <div onClick={() => handleLabelClick('cucuP', 'Cucu Perempuan terhalang (hijab) oleh Anak Laki-laki.')}>
          <label className={`flex items-center ${disabledWaris.cucuP ? 'text-gray-400 cursor-not-allowed' : ''}`}>Cucu Perempuan: <input type="number" value={waris.cucuP} min="0" disabled={disabledWaris.cucuP} onChange={(e) => update("cucuP", parseInt(e.target.value) || 0)} className="ml-2 w-20 p-1 border rounded" /></label>
        </div>
        <div onClick={() => handleLabelClick('saudaraL', 'Saudara Laki-laki terhalang (hijab) oleh Ayah, Anak Laki-laki, atau Cucu Laki-laki.')}>
          <label className={`flex items-center ${disabledWaris.saudaraL ? 'text-gray-400 cursor-not-allowed' : ''}`}>Saudara Laki-laki: <input type="number" value={waris.saudaraL} min="0" disabled={disabledWaris.saudaraL} onChange={(e) => update("saudaraL", parseInt(e.target.value) || 0)} className="ml-2 w-20 p-1 border rounded" /></label>
        </div>
        <div onClick={() => handleLabelClick('saudaraP', 'Saudara Perempuan terhalang (hijab) oleh Ayah, Anak Laki-laki, atau Cucu Laki-laki.')}>
          <label className={`flex items-center ${disabledWaris.saudaraP ? 'text-gray-400 cursor-not-allowed' : ''}`}>Saudara Perempuan: <input type="number" value={waris.saudaraP} min="0" disabled={disabledWaris.saudaraP} onChange={(e) => update("saudaraP", parseInt(e.target.value) || 0)} className="ml-2 w-20 p-1 border rounded" /></label>
        </div>
      </div>

      <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded mt-6 w-full font-bold hover:bg-blue-700">Lanjut ke Hasil ➡</button>
    </div>
  );
}
