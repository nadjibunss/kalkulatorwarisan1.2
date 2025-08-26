// A more detailed faraid calculation engine
export default function hitungFaraid(total, ahliWaris) {
  const _hasil = {};
  let sisa = total;

  // Create a mutable copy of heirs to handle hijab
  const waris = { ...ahliWaris };

  // Helper to add result with description
  const tambahHasil = (penerima, bagian, keterangan, perOrang = false) => {
    if (bagian > 0.001) { // Avoid adding negligible amounts
      const jumlahPenerima = typeof waris[penerima] === 'number' ? waris[penerima] : 1;
      _hasil[penerima] = {
        bagian: bagian,
        keterangan: keterangan,
        perOrang: perOrang && jumlahPenerima > 0 ? bagian / jumlahPenerima : bagian,
        jumlah: jumlahPenerima,
      };
      sisa -= bagian;
    }
  };

  const getNamaPenerima = (key) => {
      const namaMap = {
          suami: "Suami", istri: "Istri", ayah: "Ayah", ibu: "Ibu",
          anakL: "Anak Laki-laki", anakP: "Anak Perempuan", kakek: "Kakek", nenek: "Nenek",
          cucuL: "Cucu Laki-laki", cucuP: "Cucu Perempuan", saudaraL: "Saudara Laki-laki",
          saudaraP: "Saudara Perempuan"
      };
      return namaMap[key] || key;
  }


  // --- 1. Logika Hijab Hirman (Total Exclusion) ---
  if (waris.ayah) {
    if (waris.kakek) waris.kakek = false;
    if (waris.saudaraL > 0) waris.saudaraL = 0;
    if (waris.saudaraP > 0) waris.saudaraP = 0;
  }
  if (waris.ibu) {
    if (waris.nenek) waris.nenek = false;
  }
  if (waris.anakL > 0) {
    if (waris.cucuL > 0) waris.cucuL = 0;
    if (waris.cucuP > 0) waris.cucuP = 0;
    if (waris.saudaraL > 0) waris.saudaraL = 0;
    if (waris.saudaraP > 0) waris.saudaraP = 0;
  }
  if (waris.cucuL > 0) {
      if (waris.saudaraL > 0) waris.saudaraL = 0;
      if (waris.saudaraP > 0) waris.saudaraP = 0;
  }


  // --- 2. Perhitungan Ashabul Furudh (Fixed Shares) ---
  const adaAnak = waris.anakL > 0 || waris.anakP > 0;
  const adaCucu = waris.cucuL > 0 || waris.cucuP > 0;
  const adaAnakAtauCucu = adaAnak || adaCucu;

  if (waris.suami) {
    const bagian = adaAnakAtauCucu ? total * 0.25 : total * 0.5;
    const ket = adaAnakAtauCucu ? "1/4 (karena ada anak/cucu)" : "1/2 (karena tidak ada anak/cucu)";
    tambahHasil("suami", bagian, ket);
  }

  if (waris.istri) {
    const bagian = adaAnakAtauCucu ? total * 0.125 : total * 0.25;
    const ket = adaAnakAtauCucu ? "1/8 (karena ada anak/cucu)" : "1/4 (karena tidak ada anak/cucu)";
    tambahHasil("istri", bagian, ket);
  }

  if (waris.ibu) {
      const adaBanyakSaudara = (waris.saudaraL + waris.saudaraP) >= 2;
      let bagian;
      let ket;
      if (adaAnakAtauCucu || adaBanyakSaudara) {
          bagian = total * (1/6);
          ket = "1/6 (karena ada anak/cucu atau >1 saudara)";
      } else {
          bagian = total * (1/3);
          ket = "1/3 (karena tdk ada anak/cucu dan <2 saudara)";
      }
      tambahHasil("ibu", bagian, ket);
  }

  if (waris.nenek) {
      const bagian = total * (1/6);
      tambahHasil("nenek", bagian, "1/6");
  }

  if (waris.ayah && (waris.anakL > 0 || waris.cucuL > 0)) {
      const bagian = total * (1/6);
      tambahHasil("ayah", bagian, "1/6 (karena ada keturunan laki-laki)");
  } else if (waris.ayah && (waris.anakP > 0 || waris.cucuP > 0)) {
      const bagian = total * (1/6);
      tambahHasil("ayah", bagian, "1/6 + Sisa (karena ada keturunan perempuan)");
  }


  if (waris.kakek && (waris.anakL > 0 || waris.cucuL > 0)) {
      const bagian = total * (1/6);
      tambahHasil("kakek", bagian, "1/6 (karena ada keturunan laki-laki)");
  } else if (waris.kakek && (waris.anakP > 0 || waris.cucuP > 0)) {
      const bagian = total * (1/6);
      tambahHasil("kakek", bagian, "1/6 + Sisa (karena ada keturunan perempuan)");
  }

  if (waris.anakL === 0 && waris.anakP > 0) {
      let bagian;
      let ket;
      if (waris.anakP === 1) {
          bagian = total * 0.5;
          ket = "1/2 (karena 1 org & tdk ada anak laki-laki)";
      } else {
          bagian = total * (2/3);
          ket = "2/3 (karena >1 org & tdk ada anak laki-laki)";
      }
      tambahHasil("anakP", bagian, ket);
  }

  if (waris.anakL === 0 && waris.cucuL === 0 && waris.cucuP > 0) {
      if (waris.anakP === 0) {
          let bagian = waris.cucuP === 1 ? total * 0.5 : total * (2/3);
          let ket = waris.cucuP === 1 ? "1/2 (karena 1 org & tdk ada anak/cucu laki-laki)" : "2/3 (karena >1 org & tdk ada anak/cucu laki-laki)";
          tambahHasil("cucuP", bagian, ket);
      } else if (waris.anakP === 1) {
          const bagian = total * (1/6);
          tambahHasil("cucuP", bagian, "1/6 (penyempurna 2/3)");
      }
  }

  if (waris.saudaraL === 0 && waris.saudaraP > 0 && !adaAnakAtauCucu && !waris.ayah && !waris.kakek){
      if (waris.anakP > 0 || waris.cucuP > 0) {
          // Menjadi Ashabah ma'al Ghair, ditangani di bawah
      } else {
          let bagian = waris.saudaraP === 1 ? total * 0.5 : total * (2/3);
          let ket = waris.saudaraP === 1 ? "1/2 (karena 1 org & tdk ada furu' atau ushul laki-laki)" : "2/3 (karena >1 org & tdk ada furu' atau ushul laki-laki)";
          tambahHasil("saudaraP", bagian, ket);
      }
  }


  // --- 3. Perhitungan Ashabah (Sisa Harta) ---
  if (sisa > 0.001) {
      if (waris.anakL > 0) {
          const totalBagian = (waris.anakL * 2) + waris.anakP;
          const sisaUntukAnak = sisa + (_hasil.anakP ? _hasil.anakP.bagian : 0);
          if (_hasil.anakP) sisa += _hasil.anakP.bagian;
          delete _hasil.anakP;

          const bagianLk = sisaUntukAnak * (waris.anakL * 2) / totalBagian;
          tambahHasil("anakL", bagianLk, "Ashabah bil Ghair");
          if (waris.anakP > 0) {
            const bagianPr = sisaUntukAnak * waris.anakP / totalBagian;
            tambahHasil("anakP", bagianPr, "Ashabah bil Ghair");
          }
      } else if (waris.cucuL > 0) {
          const totalBagian = (waris.cucuL * 2) + waris.cucuP;
          const sisaUntukCucu = sisa + (_hasil.cucuP ? _hasil.cucuP.bagian : 0);
          if (_hasil.cucuP) sisa += _hasil.cucuP.bagian;
          delete _hasil.cucuP;

          const bagianLk = sisaUntukCucu * (waris.cucuL * 2) / totalBagian;
          tambahHasil("cucuL", bagianLk, "Ashabah bil Ghair");
          if (waris.cucuP > 0) {
            const bagianPr = sisaUntukCucu * waris.cucuP / totalBagian;
            tambahHasil("cucuP", bagianPr, "Ashabah bil Ghair");
          }
      } else if (waris.saudaraL > 0) {
          const totalBagian = (waris.saudaraL * 2) + waris.saudaraP;
          const sisaUntukSaudara = sisa + (_hasil.saudaraP ? _hasil.saudaraP.bagian : 0);
          if (_hasil.saudaraP) sisa += _hasil.saudaraP.bagian;
          delete _hasil.saudaraP;

          const bagianLk = sisaUntukSaudara * (waris.saudaraL * 2) / totalBagian;
          tambahHasil("saudaraL", bagianLk, "Ashabah bil Ghair");
          if (waris.saudaraP > 0) {
            const bagianPr = sisaUntukSaudara * waris.saudaraP / totalBagian;
            tambahHasil("saudaraP", bagianPr, "Ashabah bil Ghair");
          }
      }
      else if (waris.ayah) {
          tambahHasil("ayah", _hasil.ayah.bagian + sisa, _hasil.ayah.keterangan);
      } else if (waris.kakek) {
          tambahHasil("kakek", _hasil.kakek.bagian + sisa, _hasil.kakek.keterangan);
      } else if (waris.saudaraP > 0 && (waris.anakP > 0 || waris.cucuP > 0)) {
          tambahHasil("saudaraP", sisa, "Ashabah ma'al Ghair");
      }
  }

  // --- Final Formatting ---
  const hasilAkhir = {};
  for(const key in _hasil) {
      const nama = getNamaPenerima(key);
      hasilAkhir[nama] = _hasil[key];
  }

  return hasilAkhir;
}
