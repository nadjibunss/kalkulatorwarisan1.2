import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState, useEffect } from "react";
import hitungFaraid from "../utils/faraid";

export default function AhliWarisPage() {
  const { setData, data } = useData();
  const router = useRouter();

  const [waris, setWaris] = useState(data.ahliWaris);

  const heirNames = {
    suami: 'Suami',
    istri: 'Istri',
    ayah: 'Ayah',
    ibu: 'Ibu',
    kakek: 'Kakek dari si yang meninggal',
    nenek: 'Nenek dari si yang meninggal',
    anakL: 'Anak Laki-laki',
    anakP: 'Anak Perempuan',
    cucuL: 'Cucu Laki-laki',
    cucuP: 'Cucu Perempuan',
    saudaraL: 'Saudara Laki-laki',
    saudaraP: 'Saudara Perempuan',
  };

  const getHeirName = (key) => heirNames[key] || key;

  useEffect(() => {
    // Sync with context on initial load or if context changes
    setWaris(data.ahliWaris);
  }, [data.ahliWaris]);

  const updateWaris = (key, value) => {
    setWaris(prevWaris => {
      const newWaris = { ...prevWaris, [key]: value };

      const ayahExists = newWaris.ayah;
      const ibuExists = newWaris.ibu;
      const anakLExists = newWaris.anakL > 0;

      if (ayahExists) {
        if (newWaris.kakek) newWaris.kakek = false;
        if (newWaris.saudaraL > 0) newWaris.saudaraL = 0;
        if (newWaris.saudaraP > 0) newWaris.saudaraP = 0;
      }
      if (ibuExists) {
        if (newWaris.nenek) newWaris.nenek = false;
      }
      if (anakLExists) {
        if (newWaris.cucuL > 0) newWaris.cucuL = 0;
        if (newWaris.cucuP > 0) newWaris.cucuP = 0;
        if (newWaris.saudaraL > 0) newWaris.saudaraL = 0;
        if (newWaris.saudaraP > 0) newWaris.saudaraP = 0;
      }

      return newWaris;
    });
  };

  const handleInputChange = (key, e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : parseInt(e.target.value, 10) || 0;
    updateWaris(key, value);
  };

  const next = () => {
    // 1. Calculate results to get explanations
    const tempHarta = 1000; // Use a dummy value for explanation purposes
    const hasilPenjelasan = hitungFaraid(tempHarta, waris);

    // 2. Build the explanation string
    let alertMessage = "--- Penjelasan Status Ahli Waris ---\n\n";
    const blockedHeirs = Object.entries(hasilPenjelasan).filter(([, value]) => value.status.includes("Terhalang"));
    const asabahHeirs = Object.entries(hasilPenjelasan).filter(([, value]) => value.deskripsi.includes("Aṣabah"));

    if (blockedHeirs.length > 0) {
      alertMessage += "Ahli Waris Terhalang (Hijab):\n";
      blockedHeirs.forEach(([key, value]) => {
        alertMessage += `- ${getHeirName(key)}: ${value.deskripsi}\n`;
      });
      alertMessage += "\n";
    }

    if (asabahHeirs.length > 0) {
      alertMessage += "Ahli Waris 'Aṣabah (Penerima Sisa):\n";
      asabahHeirs.forEach(([key, value]) => {
        alertMessage += `- ${getHeirName(key)}: ${value.deskripsi}\n`;
      });
      alertMessage += "\n";
    }

    if (blockedHeirs.length === 0 && asabahHeirs.length === 0) {
      alertMessage += "Semua ahli waris mendapat bagian tetap (Ashabul Furudh)."
    }

    // 3. Show the alert
    alert(alertMessage);

    // 4. Set data and navigate
    setData({ ...data, ahliWaris: waris });
    router.push("/hasil");
  };

  const handleBlockedClick = (message) => {
    alert(message);
  };

  // --- Derived states for disabling inputs ---
  const isKakekBlocked = waris.ayah;
  const isNenekBlocked = waris.ibu;
  const isCucuBlocked = waris.anakL > 0;
  const isSaudaraBlocked = waris.anakL > 0 || waris.ayah;

  // --- Styling constants ---
  const checkboxLabelStyle = "flex items-center space-x-3 text-lg";
  const checkboxInputStyle = "h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const numberInputContainerStyle = "flex items-center justify-between py-2";
  const numberInputLabelStyle = "text-lg text-gray-700";
  const numberInputStyle = "border border-gray-300 p-2 rounded-md w-24 text-center focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed";

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Step 4: Data Ahli Waris</h1>

      <div className="space-y-4">
        {data.gender === 'perempuan' && (
          <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.suami} className={checkboxInputStyle} onChange={(e) => handleInputChange("suami", e)} /> <span>Suami</span></label>
        )}
        {data.gender === 'laki' && (
          <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.istri} className={checkboxInputStyle} onChange={(e) => handleInputChange("istri", e)} /> <span>Istri</span></label>
        )}

        <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.ayah} className={checkboxInputStyle} onChange={(e) => handleInputChange("ayah", e)} /> <span>Ayah</span></label>
        <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.ibu} className={checkboxInputStyle} onChange={(e) => handleInputChange("ibu", e)} /> <span>Ibu</span></label>

        <div onClick={isKakekBlocked ? () => handleBlockedClick("Kakek terhalang (hijab) oleh Ayah.") : null}>
          <label className={`${checkboxLabelStyle} ${isKakekBlocked ? 'opacity-50' : ''}`}><input type="checkbox" disabled={isKakekBlocked} checked={waris.kakek} className={checkboxInputStyle} onChange={(e) => handleInputChange("kakek", e)} /> <span>Kakek dari si yang meninggal</span></label>
        </div>
        <div onClick={isNenekBlocked ? () => handleBlockedClick("Nenek terhalang (hijab) oleh Ibu.") : null}>
          <label className={`${checkboxLabelStyle} ${isNenekBlocked ? 'opacity-50' : ''}`}><input type="checkbox" disabled={isNenekBlocked} checked={waris.nenek} className={checkboxInputStyle} onChange={(e) => handleInputChange("nenek", e)} /> <span>Nenek dari si yang meninggal</span></label>
        </div>

        <div className={numberInputContainerStyle}>
          <label htmlFor="anakLaki" className={numberInputLabelStyle}>Anak Laki-laki:</label>
          <input id="anakLaki" type="number" min="0" value={waris.anakL} onChange={(e) => handleInputChange("anakL", e)} className={numberInputStyle} />
        </div>
        <div className={numberInputContainerStyle}>
          <label htmlFor="anakPerempuan" className={numberInputLabelStyle}>Anak Perempuan:</label>
          <input id="anakPerempuan" type="number" min="0" value={waris.anakP} onChange={(e) => handleInputChange("anakP", e)} className={numberInputStyle} />
        </div>
        <div onClick={isCucuBlocked ? () => handleBlockedClick("Cucu terhalang (hijab) oleh Anak Laki-laki.") : null} className={`${numberInputContainerStyle} ${isCucuBlocked ? 'opacity-50' : ''}`}>
          <label htmlFor="cucuLaki" className={numberInputLabelStyle}>Cucu Laki-laki:</label>
          <input id="cucuLaki" type="number" min="0" value={waris.cucuL} disabled={isCucuBlocked} onChange={(e) => handleInputChange("cucuL", e)} className={numberInputStyle} />
        </div>
        <div onClick={isCucuBlocked ? () => handleBlockedClick("Cucu terhalang (hijab) oleh Anak Laki-laki.") : null} className={`${numberInputContainerStyle} ${isCucuBlocked ? 'opacity-50' : ''}`}>
          <label htmlFor="cucuPerempuan" className={numberInputLabelStyle}>Cucu Perempuan:</label>
          <input id="cucuPerempuan" type="number" min="0" value={waris.cucuP} disabled={isCucuBlocked} onChange={(e) => handleInputChange("cucuP", e)} className={numberInputStyle} />
        </div>

        <div onClick={isSaudaraBlocked ? () => handleBlockedClick("Saudara terhalang (hijab) oleh Ayah atau Anak Laki-laki.") : null} className={`${numberInputContainerStyle} ${isSaudaraBlocked ? 'opacity-50' : ''}`}>
          <label htmlFor="saudaraLaki" className={numberInputLabelStyle}>Saudara Laki-laki:</label>
          <input id="saudaraLaki" type="number" min="0" value={waris.saudaraL} disabled={isSaudaraBlocked} onChange={(e) => handleInputChange("saudaraL", e)} className={numberInputStyle} />
        </div>
        <div onClick={isSaudaraBlocked ? () => handleBlockedClick("Saudara terhalang (hijab) oleh Ayah atau Anak Laki-laki.") : null} className={`${numberInputContainerStyle} ${isSaudaraBlocked ? 'opacity-50' : ''}`}>
          <label htmlFor="saudaraPerempuan" className={numberInputLabelStyle}>Saudara Perempuan:</label>
          <input id="saudaraPerempuan" type="number" min="0" value={waris.saudaraP} disabled={isSaudaraBlocked} onChange={(e) => handleInputChange("saudaraP", e)} className={numberInputStyle} />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">⬅ Back</button>
        <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Next ➡</button>
      </div>
    </div>
  );
}
