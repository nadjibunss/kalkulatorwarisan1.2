import { useRouter } from "next/router";
import { useData } from "../context/DataContext";
import { useState, useEffect } from "react";

export default function AhliWarisPage() {
  const { setData, data } = useData();
  const router = useRouter();

  const [waris, setWaris] = useState(data.ahliWaris || {
    suami: false, istri: false, ayah: false, ibu: false, kakek: false, nenek: false,
    anakL: 0, anakP: 0, cucuL: 0, cucuP: 0, saudaraL: 0, saudaraP: 0,
  });

  // Hijab (Blocking) Logic
  const ayahExists = waris.ayah;
  const ibuExists = waris.ibu;
  const anakLExists = waris.anakL > 0;

  const kakekBlocked = ayahExists;
  const nenekBlocked = ibuExists;
  const cucuBlocked = anakLExists;
  const saudaraBlocked = anakLExists || ayahExists;

  // Effect to automatically uncheck/reset blocked heirs
  useEffect(() => {
    const newWaris = { ...waris };
    let changed = false;

    if (kakekBlocked && newWaris.kakek) { newWaris.kakek = false; changed = true; }
    if (nenekBlocked && newWaris.nenek) { newWaris.nenek = false; changed = true; }
    if (cucuBlocked && (newWaris.cucuL > 0 || newWaris.cucuP > 0)) { newWaris.cucuL = 0; newWaris.cucuP = 0; changed = true; }
    if (saudaraBlocked && (newWaris.saudaraL > 0 || newWaris.saudaraP > 0)) { newWaris.saudaraL = 0; newWaris.saudaraP = 0; changed = true; }

    if (changed) {
      setWaris(newWaris);
    }
  }, [waris.ayah, waris.ibu, waris.anakL]); // Re-run effect when these change

  const updateWaris = (key, e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : (parseInt(e.target.value, 10) || 0);
    setWaris(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const next = () => {
    setData({ ...data, ahliWaris: waris });
    router.push("/penjelasan");
  };

  const handleBlockedClick = (message) => {
    alert(message);
  };

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
          <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.suami} className={checkboxInputStyle} onChange={(e) => updateWaris("suami", e)} /> <span>Suami</span></label>
        )}
        {data.gender === 'laki' && (
          <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.istri} className={checkboxInputStyle} onChange={(e) => updateWaris("istri", e)} /> <span>Istri</span></label>
        )}

        {/* Garis Lurus ke Atas */}
        <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.ayah} className={checkboxInputStyle} onChange={(e) => updateWaris("ayah", e)} /> <span>Ayah</span></label>
        <label className={checkboxLabelStyle}><input type="checkbox" checked={waris.ibu} className={checkboxInputStyle} onChange={(e) => updateWaris("ibu", e)} /> <span>Ibu</span></label>
        <div onClick={kakekBlocked ? () => handleBlockedClick("Kakek terhalang (hijab) oleh Ayah.") : undefined} className={kakekBlocked ? 'cursor-not-allowed' : ''}>
          <label className={`${checkboxLabelStyle} ${kakekBlocked ? 'opacity-50' : ''}`}><input type="checkbox" disabled={kakekBlocked} checked={waris.kakek} className={checkboxInputStyle} onChange={(e) => updateWaris("kakek", e)} /> <span>Kakek (dari Ayah)</span></label>
        </div>
        <div onClick={nenekBlocked ? () => handleBlockedClick("Nenek terhalang (hijab) oleh Ibu.") : undefined} className={nenekBlocked ? 'cursor-not-allowed' : ''}>
          <label className={`${checkboxLabelStyle} ${nenekBlocked ? 'opacity-50' : ''}`}><input type="checkbox" disabled={nenekBlocked} checked={waris.nenek} className={checkboxInputStyle} onChange={(e) => updateWaris("nenek", e)} /> <span>Nenek (dari Ibu/Ayah)</span></label>
        </div>

        {/* Garis Lurus ke Bawah */}
        <div className={numberInputContainerStyle}>
          <label htmlFor="anakLaki" className={numberInputLabelStyle}>Anak Laki-laki:</label>
          <input id="anakLaki" type="number" min="0" value={waris.anakL} onChange={(e) => updateWaris("anakL", e)} className={numberInputStyle} />
        </div>
        <div className={numberInputContainerStyle}>
          <label htmlFor="anakPerempuan" className={numberInputLabelStyle}>Anak Perempuan:</label>
          <input id="anakPerempuan" type="number" min="0" value={waris.anakP} onChange={(e) => updateWaris("anakP", e)} className={numberInputStyle} />
        </div>
        <div onClick={cucuBlocked ? () => handleBlockedClick("Cucu terhalang (hijab) oleh Anak Laki-laki.") : undefined} className={`${numberInputContainerStyle} ${cucuBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <label htmlFor="cucuLaki" className={numberInputLabelStyle}>Cucu Laki-laki:</label>
          <input id="cucuLaki" type="number" min="0" value={waris.cucuL} disabled={cucuBlocked} onChange={(e) => updateWaris("cucuL", e)} className={numberInputStyle} />
        </div>
        <div onClick={cucuBlocked ? () => handleBlockedClick("Cucu terhalang (hijab) oleh Anak Laki-laki.") : undefined} className={`${numberInputContainerStyle} ${cucuBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <label htmlFor="cucuPerempuan" className={numberInputLabelStyle}>Cucu Perempuan:</label>
          <input id="cucuPerempuan" type="number" min="0" value={waris.cucuP} disabled={cucuBlocked} onChange={(e) => updateWaris("cucuP", e)} className={numberInputStyle} />
        </div>

        {/* Garis Samping (Saudara) */}
        <div onClick={saudaraBlocked ? () => handleBlockedClick("Saudara terhalang (hijab) oleh Ayah atau Anak Laki-laki.") : undefined} className={`${numberInputContainerStyle} ${saudaraBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <label htmlFor="saudaraLaki" className={numberInputLabelStyle}>Saudara Laki-laki:</label>
          <input id="saudaraLaki" type="number" min="0" value={waris.saudaraL} disabled={saudaraBlocked} onChange={(e) => updateWaris("saudaraL", e)} className={numberInputStyle} />
        </div>
        <div onClick={saudaraBlocked ? () => handleBlockedClick("Saudara terhalang (hijab) oleh Ayah atau Anak Laki-laki.") : undefined} className={`${numberInputContainerStyle} ${saudaraBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <label htmlFor="saudaraPerempuan" className={numberInputLabelStyle}>Saudara Perempuan:</label>
          <input id="saudaraPerempuan" type="number" min="0" value={waris.saudaraP} disabled={saudaraBlocked} onChange={(e) => updateWaris("saudaraP", e)} className={numberInputStyle} />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">⬅ Back</button>
        <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Next ➡</button>
      </div>
    </div>
  );
}
