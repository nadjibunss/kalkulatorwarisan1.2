/**
 * Mesin Kalkulator Faraid V7 - Highly Detailed & Formal Descriptions
 *
 * This version generates highly specific, formal, and dynamic descriptions for all heirs.
 * 1. Returns a single, comprehensive 'deskripsi' string for each heir.
 * 2. Uses formal Faraid terminology for all statuses (e.g., 'Aṣabah bil-Ghair (bersama Anak Laki-laki)').
 * 3. Prepends "Ashabul Furudh:" to fixed-share heirs for clarity.
 * 4. Calculation logic for 'Aul, Radd, and Umariyyatain is robust and clear.
 */
export default function hitungFaraid(harta, ahliWarisInput) {
    const heirNames = {
        suami: 'Suami', istri: 'Istri', ayah: 'Ayah', ibu: 'Ibu', kakek: 'Kakek', nenek: 'Nenek',
        anakL: 'Anak Laki-laki', anakP: 'Anak Perempuan', cucuL: 'Cucu Laki-laki', cucuP: 'Cucu Perempuan',
        saudaraL: 'Saudara Laki-laki', saudaraP: 'Saudara Perempuan',
    };

    if (harta <= 0) {
        const result = {};
        for (const key in ahliWarisInput) {
            if ((typeof ahliWarisInput[key] === 'boolean' && ahliWarisInput[key]) || (ahliWarisInput[key] > 0)) {
                result[key] = { jumlah: 0, deskripsi: 'Harta tidak mencukupi.' };
            }
        }
        return result;
    }

    let w = { ...ahliWarisInput };
    let fardh = {};
    let deskripsi = {};

    // --- 1. HIJAB (Blocking) ---
    const adaAnakL = w.anakL > 0;
    const adaAyah = w.ayah;
    const adaIbu = w.ibu;

    if (adaAyah && w.kakek) { deskripsi.kakek = `Terhalang oleh ${heirNames.ayah}`; w.kakek = false; }
    if (adaIbu && w.nenek) { deskripsi.nenek = `Terhalang oleh ${heirNames.ibu}`; w.nenek = false; }
    if (adaAnakL) {
        if (w.cucuL > 0) { deskripsi.cucuL = `Terhalang oleh ${heirNames.anakL}`; w.cucuL = 0; }
        if (w.cucuP > 0) { deskripsi.cucuP = `Terhalang oleh ${heirNames.anakL}`; w.cucuP = 0; }
    }
    if (adaAnakL || adaAyah) {
        const blocker = adaAnakL ? heirNames.anakL : heirNames.ayah;
        if (w.saudaraL > 0) { deskripsi.saudaraL = `Terhalang oleh ${blocker}`; w.saudaraL = 0; }
        if (w.saudaraP > 0) { deskripsi.saudaraP = `Terhalang oleh ${blocker}`; w.saudaraP = 0; }
    }

    // --- 2. ASHABUL FURUDH (Fixed Shares) ---
    const adaAnak = w.anakL > 0 || w.anakP > 0;
    const adaCucu = w.cucuL > 0 || w.cucuP > 0;
    const adaKeturunan = adaAnak || adaCucu;
    const jumlahSaudara = (w.saudaraL || 0) + (w.saudaraP || 0);

    if (w.suami) {
        fardh.suami = adaKeturunan ? 1/4 : 1/2;
        deskripsi.suami = `Ashabul Furudh: Bagian ${adaKeturunan ? '1/4' : '1/2'} (karena ${adaKeturunan ? 'ada' : 'tidak ada'} keturunan)`;
    }
    if (w.istri) {
        fardh.istri = adaKeturunan ? 1/8 : 1/4;
        deskripsi.istri = `Ashabul Furudh: Bagian ${adaKeturunan ? '1/8' : '1/4'} (karena ${adaKeturunan ? 'ada' : 'tidak ada'} keturunan)`;
    }
    if (w.ibu) {
        if (adaKeturunan || jumlahSaudara >= 2) {
            fardh.ibu = 1/6;
            deskripsi.ibu = "Ashabul Furudh: Bagian 1/6 (ada keturunan/lebih dari 1 saudara)";
        } else if (w.ayah && (w.suami || w.istri)) {
            fardh.ibu = "1/3 Sisa";
            deskripsi.ibu = "Ashabul Furudh: Bagian 1/3 Sisa (Kasus Umariyyatain)";
        } else {
            fardh.ibu = 1/3;
            deskripsi.ibu = "Ashabul Furudh: Bagian 1/3 (tidak ada keturunan/saudara)";
        }
    }
    if (w.ayah && adaKeturunan) {
        fardh.ayah = 1/6;
        deskripsi.ayah = "Ashabul Furudh: Bagian 1/6 (karena ada keturunan)";
    }
    if (w.kakek && adaKeturunan && !w.ayah) { fardh.kakek = 1/6; deskripsi.kakek = "Ashabul Furudh: Bagian 1/6 (ada keturunan, tdk ada Ayah)"; }
    if (w.nenek && !w.ibu) { fardh.nenek = 1/6; deskripsi.nenek = "Ashabul Furudh: Bagian 1/6 (karena tdk ada Ibu)"; }
    if (!adaAnakL) {
        if (w.anakP === 1 && !w.cucuL && w.cucuP === 0) { fardh.anakP = 1/2; deskripsi.anakP = "Ashabul Furudh: Bagian 1/2 (sendirian, tdk ada anak laki-laki)"; }
        else if (w.anakP >= 2) { fardh.anakP = 2/3 / w.anakP; deskripsi.anakP = "Ashabul Furudh: Bagian 2/3 (bersama, tdk ada anak laki-laki)"; }
        if (w.anakP === 0 && !w.cucuL) {
            if (w.cucuP === 1) { fardh.cucuP = 1/2; deskripsi.cucuP = "Ashabul Furudh: Bagian 1/2 (sendirian, tdk ada cucu laki-laki)"; }
            else if (w.cucuP >= 2) { fardh.cucuP = 2/3 / w.cucuP; deskripsi.cucuP = "Ashabul Furudh: Bagian 2/3 (bersama, tdk ada cucu laki-laki)"; }
        } else if (w.anakP === 1 && w.cucuP > 0 && !w.cucuL) { fardh.cucuP = (1/6) / w.cucuP; deskripsi.cucuP = "Ashabul Furudh: Bagian 1/6 (Takmilah, penyempurna 2/3)";}
    }
    if (!adaKeturunan && !w.ayah && !w.kakek && !w.saudaraL) {
        if (w.saudaraP === 1) { fardh.saudaraP = 1/2; deskripsi.saudaraP = "Ashabul Furudh: Bagian 1/2 (sendirian, tdk ada furu'/usul laki-laki)"; }
        if (w.saudaraP >= 2) { fardh.saudaraP = 2/3 / w.saudaraP; deskripsi.saudaraP = "Ashabul Furudh: Bagian 2/3 (bersama, tdk ada furu'/usul laki-laki)"; }
    }

    // --- 3. 'ASABAH (Residuary) with Highly Dynamic Descriptions ---
    let asabah = null;
    if (w.anakL > 0) {
        asabah = { type: "'Aṣabah bil-Ghair", heirs: [{ key: 'anakL', ratio: 2, count: w.anakL }, { key: 'anakP', ratio: 1, count: w.anakP }] };
        deskripsi.anakL = `'Aṣabah bin-Nafs (sebagai ${heirNames.anakL})`;
        if (w.anakP > 0) deskripsi.anakP = `'Aṣabah bil-Ghair (bersama ${heirNames.anakL})`;
    } else if (w.cucuL > 0) {
        asabah = { type: "'Aṣabah bil-Ghair", heirs: [{ key: 'cucuL', ratio: 2, count: w.cucuL }, { key: 'cucuP', ratio: 1, count: w.cucuP }] };
        deskripsi.cucuL = `'Aṣabah bin-Nafs (sebagai ${heirNames.cucuL})`;
        if (w.cucuP > 0) deskripsi.cucuP = `'Aṣabah bil-Ghair (bersama ${heirNames.cucuL})`;
    } else if (w.saudaraL > 0) {
        asabah = { type: "'Aṣabah bil-Ghair", heirs: [{ key: 'saudaraL', ratio: 2, count: w.saudaraL }, { key: 'saudaraP', ratio: 1, count: w.saudaraP }] };
        deskripsi.saudaraL = `'Aṣabah bin-Nafs (sebagai ${heirNames.saudaraL})`;
        if(w.saudaraP > 0) deskripsi.saudaraP = `'Aṣabah bil-Ghair (bersama ${heirNames.saudaraL})`;
    } else if (w.saudaraP > 0 && (w.anakP > 0 || w.cucuP > 0)) {
        asabah = { type: "'Aṣabah ma'al-Ghair", heirs: [{ key: 'saudaraP', ratio: 1, count: w.saudaraP }] };
        const withHeir = w.anakP > 0 ? heirNames.anakP : heirNames.cucuP;
        deskripsi.saudaraP = `'Aṣabah ma'al-Ghair (bersama ${withHeir})`;
    } else if (w.ayah && !adaKeturunan) {
        asabah = { type: "'Aṣabah bin-Nafs", heirs: [{ key: 'ayah', ratio: 1, count: 1 }] };
        const baseText = deskripsi.ayah ? deskripsi.ayah + " + " : "";
        deskripsi.ayah = baseText + `'Aṣabah bin-Nafs (sebagai ${heirNames.ayah})`;
    } else if (w.kakek && !adaKeturunan && !w.ayah) {
        asabah = { type: "'Aṣabah bin-Nafs", heirs: [{ key: 'kakek', ratio: 1, count: 1 }] };
        const baseText = deskripsi.kakek ? deskripsi.kakek + " + " : "";
        deskripsi.kakek = baseText + `'Aṣabah bin-Nafs (sebagai ${heirNames.kakek})`;
    }

    // --- 4. CALCULATION ---
    let amounts = {};
    if (fardh.suami) { amounts.suami = fardh.suami * harta; }
    if (fardh.istri) { amounts.istri = fardh.istri * harta; }
    const sisaSetelahPasangan = harta - (amounts.suami || amounts.istri || 0);
    if (fardh.ibu === "1/3 Sisa") {
        amounts.ibu = (1/3) * sisaSetelahPasangan;
    }
    for (const p in fardh) {
        if (!amounts[p] && typeof fardh[p] === 'number') {
            amounts[p] = fardh[p] * harta;
        }
    }
    const totalFardhAmount = Object.values(amounts).reduce((a, b) => a + b, 0);
    let sisaHarta = harta - totalFardhAmount;

    // 'Aul
    if (sisaHarta < -0.001) {
        const factor = harta / totalFardhAmount;
        for (const key in amounts) {
            amounts[key] *= factor;
            if(w[key]) deskripsi[key] = (deskripsi[key] || "Sisa") + " ('Aul)";
        }
        sisaHarta = 0;
    }

    // 'Asabah
    if (sisaHarta > 0.001 && asabah) {
        const totalRatio = asabah.heirs.reduce((sum, heir) => sum + (heir.count * heir.ratio), 0);
        if (totalRatio > 0) {
            asabah.heirs.forEach(heir => {
                if(heir.count > 0){
                    const asabahShare = sisaHarta * (heir.count * heir.ratio) / totalRatio;
                    amounts[heir.key] = (amounts[heir.key] || 0) + asabahShare;
                }
            });
            sisaHarta = 0;
        }
    }

    // Radd
    if (sisaHarta > 0.001 && !asabah) {
        let raddHeirsShares = 0;
        let raddHeirs = [];
        for (const p in fardh) {
            if (p !== 'suami' && p !== 'istri' && typeof fardh[p] === 'number' && w[p]) {
                raddHeirs.push(p);
                raddHeirsShares += fardh[p];
            }
        }
        if (raddHeirsShares > 0) {
            for (const p of raddHeirs) {
                amounts[p] += sisaHarta * (fardh[p] / raddHeirsShares);
                deskripsi[p] = (deskripsi[p] || "Sisa") + " (Radd)";
            }
            sisaHarta = 0;
        }
    }

    // --- 5. Finalize output ---
    const finalResult = {};
    for (const key in ahliWarisInput) {
        if ((typeof ahliWarisInput[key] === 'boolean' && ahliWarisInput[key]) || (ahliWarisInput[key] > 0)) {
            finalResult[key] = {
                jumlah: amounts[key] || 0,
                deskripsi: deskripsi[key] || "Tidak ada bagian atau terhalang."
            };
        }
    }
    return finalResult;
}
