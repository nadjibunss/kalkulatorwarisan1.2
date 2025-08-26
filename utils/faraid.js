/**
 * Mesin Kalkulator Faraid V3 - Refactored for Robustness
 *
 * Handles:
 * - Hijab (Blocking rules)
 * - Ashabul Furudh (Fixed shares)
 * - 'Asabah (Residuary heirs) with specific types
 * - 'Aul (Increase/Pro-rata reduction)
 * - Radd (Return/Pro-rata increase)
 * - Edge cases like non-positive estate values.
 */
export default function hitungFaraid(harta, ahliWaris) {
  if (harta <= 0) {
    return {};
  }

  let w = { ...ahliWaris };
  let hasil = {};
  let deskripsi = {};

  // Initialize all potential heirs
  const allHeirs = ['suami', 'istri', 'ayah', 'ibu', 'kakek', 'nenek', 'anakL', 'anakP', 'cucuL', 'cucuP', 'saudaraL', 'saudaraP'];
  allHeirs.forEach(ahli => {
    if (w[ahli]) {
      hasil[ahli] = 0;
      deskripsi[ahli] = { status: '', deskripsi: '' };
    }
  });

  // --- 1. Hijab (Blocking) ---
  const anakLExists = w.anakL > 0;
  const anakPExists = w.anakP > 0;
  const cucuLExists = w.cucuL > 0;
  const ayahExists = w.ayah;
  const ibuExists = w.ibu;
  const kakekExists = w.kakek;

  // Son blocks grandchildren and siblings
  if (anakLExists) {
    if (w.cucuL > 0) { deskripsi.cucuL = { status: 'Terhalang', deskripsi: 'oleh Anak Laki-laki' }; w.cucuL = 0; }
    if (w.cucuP > 0) { deskripsi.cucuP = { status: 'Terhalang', deskripsi: 'oleh Anak Laki-laki' }; w.cucuP = 0; }
    if (w.saudaraL > 0) { deskripsi.saudaraL = { status: 'Terhalang', deskripsi: 'oleh Anak Laki-laki' }; w.saudaraL = 0; }
    if (w.saudaraP > 0) { deskripsi.saudaraP = { status: 'Terhalang', deskripsi: 'oleh Anak Laki-laki' }; w.saudaraP = 0; }
  }
  // Father blocks grandfather and siblings
  if (ayahExists) {
    if (w.kakek) { deskripsi.kakek = { status: 'Terhalang', deskripsi: 'oleh Ayah' }; w.kakek = false; }
    if (w.saudaraL > 0) { deskripsi.saudaraL = { status: 'Terhalang', deskripsi: 'oleh Ayah' }; w.saudaraL = 0; }
    if (w.saudaraP > 0) { deskripsi.saudaraP = { status: 'Terhalang', deskripsi: 'oleh Ayah' }; w.saudaraP = 0; }
  }
  // Mother blocks grandmother
  if (ibuExists && w.nenek) {
    deskripsi.nenek = { status: 'Terhalang', deskripsi: 'oleh Ibu' };
    w.nenek = false;
  }
  // Children block grandchildren (full block by son, partial by daughter)
  if (anakPExists && w.cucuL > 0) { // Daughter does not block grandson
    // Grandson with granddaughter makes them asabah
  }

  // --- 2. Ashabul Furudh (Fixed Shares) ---
  let bagian = {};
  const adaKeturunan = w.anakL > 0 || w.anakP > 0 || w.cucuL > 0 || w.cucuP > 0;
  const adaKeturunanLaki = w.anakL > 0 || w.cucuL > 0;
  const jumlahSaudara = (w.saudaraL || 0) + (w.saudaraP || 0);

  if (w.suami) bagian.suami = adaKeturunan ? 1/4 : 1/2;
  if (w.istri) bagian.istri = adaKeturunan ? 1/8 : 1/4;
  if (w.ibu) {
      if (adaKeturunan || jumlahSaudara >= 2) {
          bagian.ibu = 1/6;
      } else if (w.ayah && (w.suami || w.istri)) {
          // Umariyyatain case handled after spouse
      } else {
          bagian.ibu = 1/3;
      }
  }
  if (w.ayah && adaKeturunanLaki) bagian.ayah = 1/6;
  if (w.kakek && adaKeturunanLaki && !w.ayah) bagian.kakek = 1/6;
  if (w.nenek && !w.ibu) bagian.nenek = 1/6;

  // Daughters, Granddaughters, Sisters (if no asabah with male counterpart)
  if (!w.anakL) {
    if (w.anakP === 1) bagian.anakP = 1/2;
    if (w.anakP >= 2) bagian.anakP = 2/3;
    if (!w.anakP && !w.cucuL) {
        if (w.cucuP === 1) bagian.cucuP = 1/2;
        if (w.cucuP >= 2) bagian.cucuP = 2/3;
    }
    if (w.anakP === 1 && w.cucuP > 0 && !w.cucuL) {
        bagian.cucuP = 1/6; // Takmilah
    }
  }
  if (!adaKeturunan && !w.ayah && !w.kakek && !w.saudaraL) {
      if (w.saudaraP === 1) bagian.saudaraP = 1/2;
      if (w.saudaraP >= 2) bagian.saudaraP = 2/3;
  }

  // --- 3. Calculate Fixed Shares & Sisa ---
  let sisa = harta;
  let totalFardh = 0;

  if (bagian.suami) { sisa -= harta * bagian.suami; totalFardh += bagian.suami; }
  if (bagian.istri) { sisa -= harta * bagian.istri; totalFardh += bagian.istri; }

  // Handle Umariyyatain for Mother
  if (w.ibu && w.ayah && !adaKeturunan && jumlahSaudara < 2 && (w.suami || w.istri)) {
      bagian.ibu = (1/3) * sisa / harta; // 1/3 of remainder, normalized to total
      deskripsi.ibu = { status: "1/3 Sisa", deskripsi: "Kasus Umariyyatain" };
  }

  for (const p in bagian) {
      if (!hasil[p]) { // Avoid double counting spouse
          hasil[p] = harta * bagian[p];
          sisa -= hasil[p];
          totalFardh += bagian[p];
          deskripsi[p] = { status: `Bagian ${p.includes('P') || p.includes('p') ? '' : ''}${Math.round(bagian[p]*24)}/24`, deskripsi: "Ashabul Furudh" };
      }
  }

  sisa = Math.max(0, sisa);

  // --- 4. 'Asabah (Residuary) ---
  let asabah = null;
  if (w.anakL > 0) asabah = { type: "'Aṣabah bil-Ghair", heirs: [{key: 'anakL', ratio: 2, count: w.anakL}, {key: 'anakP', ratio: 1, count: w.anakP}] };
  else if (w.cucuL > 0) asabah = { type: "'Aṣabah bil-Ghair", heirs: [{key: 'cucuL', ratio: 2, count: w.cucuL}, {key: 'cucuP', ratio: 1, count: w.cucuP}] };
  else if (w.ayah && !adaKeturunanLaki) asabah = { type: "'Aṣabah bin-Nafs", heirs: [{key: 'ayah', ratio: 1, count: 1}] };
  else if (w.kakek && !adaKeturunanLaki && !w.ayah) asabah = { type: "'Aṣabah bin-Nafs", heirs: [{key: 'kakek', ratio: 1, count: 1}] };
  else if (w.saudaraL > 0) asabah = { type: "'Aṣabah bil-Ghair", heirs: [{key: 'saudaraL', ratio: 2, count: w.saudaraL}, {key: 'saudaraP', ratio: 1, count: w.saudaraP}] };
  else if (w.saudaraP > 0 && (w.anakP > 0 || w.cucuP > 0)) asabah = { type: "'Aṣabah ma'al-Ghair", heirs: [{key: 'saudaraP', ratio: 1, count: w.saudaraP}] };

  if (sisa > 0 && asabah) {
      let totalRatio = asabah.heirs.reduce((sum, heir) => sum + (heir.count * heir.ratio), 0);
      if (totalRatio > 0) {
          asabah.heirs.forEach(heir => {
              if (heir.count > 0) {
                  const asabahShare = sisa * (heir.count * heir.ratio) / totalRatio;
                  hasil[heir.key] = (hasil[heir.key] || 0) + asabahShare;
                  if (deskripsi[heir.key] && deskripsi[heir.key].status) {
                      deskripsi[heir.key].status += " + Sisa";
                      deskripsi[heir.key].deskripsi = asabah.type;
                  } else {
                      deskripsi[heir.key] = { status: "'Aṣabah", deskripsi: asabah.type };
                  }
              }
          });
          sisa = 0;
      }
  }

  // --- 5. 'Aul & Radd ---
  let finalTotal = Object.values(hasil).reduce((sum, val) => sum + val, 0);
  if (finalTotal > harta) { // 'Aul Case
      const factor = harta / finalTotal;
      for (const key in hasil) {
          hasil[key] *= factor;
          if (deskripsi[key].status && !deskripsi[key].status.includes("'Aul")) {
              deskripsi[key].status += " ('Aul)";
          }
      }
  } else if (finalTotal < harta && !asabah) { // Radd Case
      let raddTotal = 0;
      let raddHeirs = {};
      for (const p in bagian) {
          if (p !== 'suami' && p !== 'istri' && hasil[p] > 0) {
              raddHeirs[p] = bagian[p];
              raddTotal += bagian[p];
          }
      }
      if (raddTotal > 0) {
          const sisaUntukRadd = harta - finalTotal;
          for (const key in raddHeirs) {
              const raddShare = sisaUntukRadd * (raddHeirs[key] / raddTotal);
              hasil[key] += raddShare;
              if (deskripsi[key].status && !deskripsi[key].status.includes("Radd")) {
                  deskripsi[key].status += " (Radd)";
              }
          }
      }
  }

  // --- 6. Finalize output ---
  const finalResult = {};
  for (const key of allHeirs) {
      if (ahliWarisInput[key] || ahliWarisInput[key] > 0) {
          finalResult[key] = {
              jumlah: hasil[key] || 0,
              status: (deskripsi[key] && deskripsi[key].status) || "Tidak Mendapat Bagian",
              deskripsi: (deskripsi[key] && deskripsi[key].deskripsi) || "Tidak ada bagian atau terhalang."
          };
      }
  }
  return finalResult;
}
