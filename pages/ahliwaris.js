import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState, useEffect } from "react";

export default function AhliWarisPage() {
  const { setData, data } = useData();
  const router = useRouter();

  // Initialize state from context, providing a full default object
  const [waris, setWaris] = useState(data.ahliWaris || {
    suami: false, istri: false, ayah: false, ibu: false, kakek: false, nenek: false,
    anakL: 0, anakP: 0, cucuL: 0, cucuP: 0, saudaraL: 0, saudaraP: 0,
  });

  // This effect syncs the local state if the context changes (e.g., user navigates back and forth)
  useEffect(() => {
    setWaris(data.ahliWaris);
  }, [data.ahliWaris]);

  const updateWaris = (key, value) => {
    setWaris(prevWaris => {
      const newWaris = { ...prevWaris, [key]: value };

      // --- Hijab (Blocking) Logic ---
      // Apply blocking rules directly within the state update
      const ayahExists = newWaris.ayah;
      const ibuExists = newWaris.ibu;
      const anakLExists = newWaris.anakL > 0;

      // If Ayah is present, he blocks kakek and all siblings.
      if (ayahExists) {
        newWaris.kakek = false;
        newWaris.saudaraL = 0;
        newWaris.saudaraP = 0;
      }
      // If Ibu is present, she blocks nenek.
      if (ibuExists) {
        newWaris.nenek = false;
      }
      // If a son exists, he blocks all grandchildren and all siblings.
      if (anakLExists) {
        newWaris.cucuL = 0;
        newWaris.cucuP = 0;
        newWaris.saudaraL = 0;
        newWaris.saudaraP = 0;
      }

      return newWaris;
    });
  };

  const next = () => {
    setData({ ...data, ahliWaris: waris });
    router.push("/penjelasan");
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
        {/* Pasangan */}
        {data.gender === 'perempuan' && (
          <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.suami} className={checkboxInputStyle} onChange={(e) => updateWaris("suami", e.target.checked)} /> <span>Suami</span></label>
        )}
        {data.gender === 'laki' && (
          <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.istri} className={checkboxInputStyle} onChange={(e) => updateWaris("istri", e.target.checked)} /> <span>Istri</span></label>
        )}

        {/* Garis Lurus ke Atas */}
        <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.ayah} className={checkboxInputStyle} onChange={(e) => updateWaris("ayah", e.target.checked)} /> <span>Ayah</span></label>
        <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.ibu} className={checkboxInputStyle} onChange={(e) => updateWaris("ibu", e.target.checked)} /> <span>Ibu</span></label>

        <div onClick={isKakekBlocked ? () => handleBlockedClick("Kakek terhalang (hijab) oleh Ayah.") : undefined} className={isKakekBlocked ? 'cursor-not-allowed' : ''}>
          <label className={`${checkboxLabelStyle} ${isKakekBlocked ? 'opacity-50' : ''}`}><input type="checkbox" disabled={isKakekBlocked} checked={waris.kakek} className={checkboxInputStyle} onChange={(e) => updateWaris("kakek", e.target.checked)} /> <span>Kakek (dari Ayah)</span></label>
        </div>
        <div onClick={isNenekBlocked ? () => handleBlockedClick("Nenek terhalang (hijab) oleh Ibu.") : undefined} className={isNenekBlocked ? 'cursor-not-allowed' : ''}>
          <label className={`${checkboxLabelStyle} ${isNenekBlocked ? 'opacity-50' : ''}`}><input type="checkbox" disabled={isNenekBlocked} checked={waris.nenek} className={checkboxInputStyle} onChange={(e) => updateWaris("nenek", e.target.checked)} /> <span>Nenek (dari Ibu/Ayah)</span></label>
        </div>

        {/* Garis Lurus ke Bawah */}
        <div className={numberInputContainerStyle}>
          <label htmlFor="anakLaki" className={numberInputLabelStyle}>Anak Laki-laki:</label>
          <input id="anakLaki" type="number" min="0" value={waris.anakL} onChange={(e) => updateWaris("anakL", parseInt(e.target.value) || 0)} className={numberInputStyle} />
        </div>
        <div className={numberInputContainerStyle}>
          <label htmlFor="anakPerempuan" className={numberInputLabelStyle}>Anak Perempuan:</label>
          <input id="anakPerempuan" type="number" min="0" value={waris.anakP} onChange={(e) => updateWaris("anakP", parseInt(e.target.value) || 0)} className={numberInputStyle} />
        </div>
        <div onClick={isCucuBlocked ? () => handleBlockedClick("Cucu terhalang (hijab) oleh Anak Laki-laki.") : undefined} className={`${numberInputContainerStyle} ${isCucuBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <label htmlFor="cucuLaki" className={numberInputLabelStyle}>Cucu Laki-laki:</label>
          <input id="cucuLaki" type="number" min="0" value={waris.cucuL} disabled={isCucuBlocked} onChange={(e) => updateWaris("cucuL", parseInt(e.target.value) || 0)} className={numberInputStyle} />
        </div>
        <div onClick={isCucuBlocked ? () => handleBlockedClick("Cucu terhalang (hijab) oleh Anak Laki-laki.") : undefined} className={`${numberInputContainerStyle} ${isCucuBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <label htmlFor="cucuPerempuan" className={numberInputLabelStyle}>Cucu Perempuan:</label>
          <input id="cucuPerempuan" type="number" min="0" value={waris.cucuP} disabled={isCucuBlocked} onChange={(e) => updateWaris("cucuP", parseInt(e.target.value) || 0)} className={numberInputStyle} />
        </div>

        {/* Garis Samping (Saudara) */}
        <div onClick={isSaudaraBlocked ? () => handleBlockedClick("Saudara terhalang (hijab) oleh Ayah atau Anak Laki-laki.") : undefined} className={`${numberInputContainerStyle} ${isSaudaraBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <label htmlFor="saudaraLaki" className={numberInputLabelStyle}>Saudara Laki-laki:</label>
          <input id="saudaraLaki" type="number" min="0" value={waris.saudaraL} disabled={isSaudaraBlocked} onChange={(e) => updateWaris("saudaraL", parseInt(e.target.value) || 0)} className={numberInputStyle} />
        </div>
        <div onClick={isSaudaraBlocked ? () => handleBlockedClick("Saudara terhalang (hijab) oleh Ayah atau Anak Laki-laki.") : undefined} className={`${numberInputContainerStyle} ${isSaudaraBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <label htmlFor="saudaraPerempuan" className={numberInputLabelStyle}>Saudara Perempuan:</label>
          <input id="saudaraPerempuan" type="number" min="0" value={waris.saudaraP} disabled={isSaudaraBlocked} onChange={(e) => updateWaris("saudaraP", parseInt(e.target.value) || 0)} className={numberInputStyle} />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">⬅ Back</button>
        <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Next ➡</button>
      </div>
    </div>
  );
}
