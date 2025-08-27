/**
 * Mesin Kalkulator Faraid V4 - Final Robust Version
 *
 * This version uses a more structured approach to prevent runtime errors.
 * 1. It separates share fractions from monetary amounts during calculation.
 * 2. It correctly handles Hijab, Ashabul Furudh, 'Asabah, 'Aul, and Radd.
 * 3. It ensures all data structures are handled consistently to prevent type errors.
 * 4. It returns a detailed object for every selected heir.
 */
export default function hitungFaraid(harta, ahliWarisInput) {
    if (harta <= 0) {
        const result = {};
        for (const key in ahliWarisInput) {
            if ((typeof ahliWarisInput[key] === 'boolean' && ahliWarisInput[key]) || (typeof ahliWarisInput[key] === 'number' && ahliWarisInput[key] > 0)) {
                result[key] = { status: 'Terhalang', jumlah: 0, deskripsi: 'Harta tidak mencukupi.' };
            }
        }
        return result;
    }

    let w = { ...ahliWarisInput };
    let fardh = {}; // Fractional shares for Ashabul Furudh
    let deskripsi = {}; // Descriptions and statuses

    // --- 1. HIJAB (Blocking) ---
    const adaAnakL = w.anakL > 0;
    const adaAnakP = w.anakP > 0;
    const adaAyah = w.ayah;
    const adaIbu = w.ibu;
    const adaKakek = w.kakek;
    const adaNenek = w.nenek;

    if (adaAyah && adaKakek) {
        deskripsi.kakek = { status: "Terhalang", deskripsi: "Terhalang oleh Ayah" };
        w.kakek = false;
    }
    if (adaIbu && adaNenek) {
        deskripsi.nenek = { status: "Terhalang", deskripsi: "Terhalang oleh Ibu" };
        w.nenek = false;
    }
    if (adaAnakL) {
        if (w.cucuL > 0) { deskripsi.cucuL = { status: "Terhalang", deskripsi: "Oleh Anak Laki-laki" }; w.cucuL = 0; }
        if (w.cucuP > 0) { deskripsi.cucuP = { status: "Terhalang", deskripsi: "Oleh Anak Laki-laki" }; w.cucuP = 0; }
    }
    if (adaAnakL || adaAyah) {
        if (w.saudaraL > 0) { deskripsi.saudaraL = { status: "Terhalang", deskripsi: "Oleh Anak Laki-laki/Ayah" }; w.saudaraL = 0; }
        if (w.saudaraP > 0) { deskripsi.saudaraP = { status: "Terhalang", deskripsi: "Oleh Anak Laki-laki/Ayah" }; w.saudaraP = 0; }
    }

    // --- 2. ASHABUL FURUDH (Fixed Shares) ---
    const adaAnak = adaAnakL || adaAnakP;
    const adaCucu = w.cucuL > 0 || w.cucuP > 0;
    const adaKeturunan = adaAnak || adaCucu;
    const jumlahSaudara = (w.saudaraL || 0) + (w.saudaraP || 0);

    if (w.suami) fardh.suami = adaKeturunan ? 1/4 : 1/2;
    if (w.istri) fardh.istri = adaKeturunan ? 1/8 : 1/4;

    if (w.ibu) {
        if (adaKeturunan || jumlahSaudara >= 2) {
            fardh.ibu = 1/6;
        } else if (w.ayah && (w.suami || w.istri)) {
            fardh.ibu = "1/3 Sisa"; // Special case: Umariyyatain
        } else {
            fardh.ibu = 1/3;
        }
    }

    if (w.ayah && adaKeturunan) fardh.ayah = 1/6;
    if (w.kakek && adaKeturunan && !w.ayah) fardh.kakek = 1/6;
    if (w.nenek && !w.ibu) fardh.nenek = 1/6;

    if (!adaAnakL) {
        if (w.anakP === 1 && w.cucuP === 0) fardh.anakP = 1/2;
        else if (w.anakP >= 2) fardh.anakP = 2/3 / w.anakP; // Per-person share

        if (w.anakP === 0 && !w.cucuL) {
            if (w.cucuP === 1) fardh.cucuP = 1/2;
            else if (w.cucuP >= 2) fardh.cucuP = 2/3 / w.cucuP;
        } else if (w.anakP === 1 && w.cucuP > 0 && !w.cucuL) {
            fardh.cucuP = (1/6) / w.cucuP; // Takmilah
        }
    }

    if (!adaKeturunan && !w.ayah && !w.kakek && !w.saudaraL) {
        if (w.saudaraP === 1) fardh.saudaraP = 1/2;
        if (w.saudaraP >= 2) fardh.saudaraP = 2/3 / w.saudaraP;
    }

    // --- 3. 'ASABAH (Residuary) ---
    let asabah = null;
    if (w.anakL > 0) asabah = { type: "'Aṣabah bil-Ghair", heirs: [{ key: 'anakL', ratio: 2, count: w.anakL }, { key: 'anakP', ratio: 1, count: w.anakP }] };
    else if (w.cucuL > 0) asabah = { type: "'Aṣabah bil-Ghair", heirs: [{ key: 'cucuL', ratio: 2, count: w.cucuL }, { key: 'cucuP', ratio: 1, count: w.cucuP }] };
    else if (w.saudaraL > 0) asabah = { type: "'Aṣabah bil-Ghair", heirs: [{ key: 'saudaraL', ratio: 2, count: w.saudaraL }, { key: 'saudaraP', ratio: 1, count: w.saudaraP }] };
    else if (w.saudaraP > 0 && (w.anakP > 0 || w.cucuP > 0)) asabah = { type: "'Aṣabah ma'al-Ghair", heirs: [{ key: 'saudaraP', ratio: 1, count: w.saudaraP }] };
    else if (w.ayah && !adaKeturunan) asabah = { type: "'Aṣabah bin-Nafs", heirs: [{ key: 'ayah', ratio: 1, count: 1 }] };
    else if (w.kakek && !adaKeturunan && !w.ayah) asabah = { type: "'Aṣabah bin-Nafs", heirs: [{ key: 'kakek', ratio: 1, count: 1 }] };

    // --- 4. CALCULATION ---
    let amounts = {};
    let sisaHarta = harta;
    let totalFardh = 0;

    // Calculate spouse share first
    if (fardh.suami) { amounts.suami = fardh.suami * harta; sisaHarta -= amounts.suami; }
    if (fardh.istri) { amounts.istri = fardh.istri * harta; sisaHarta -= amounts.istri; }

    // Handle Umariyyatain for Mother
    if (fardh.ibu === "1/3 Sisa") {
        amounts.ibu = (1/3) * sisaHarta;
        sisaHarta -= amounts.ibu;
        deskripsi.ibu = { status: "1/3 Sisa", deskripsi: "Kasus Umariyyatain" };
    }

    // Calculate other fixed shares from original harta
    for (const p in fardh) {
        if (!amounts[p]) { // if not already calculated (spouse, mother in umariyyatain)
            amounts[p] = fardh[p] * harta;
            sisaHarta -= amounts[p];
        }
    }

    // Check for 'Aul (total shares > harta)
    const totalInitialAmount = Object.values(amounts).reduce((a, b) => a + b, 0);
    if (totalInitialAmount > harta * 1.00001) { // Use tolerance for float issues
        const factor = harta / totalInitialAmount;
        for (const key in amounts) {
            amounts[key] *= factor;
            deskripsi[key] = { status: `Bagian ('Aul)`, deskripsi: "Bagian dikurangi secara proporsional" };
        }
        sisaHarta = 0;
    } else {
        sisaHarta = harta - Object.values(amounts).reduce((a, b) => a + b, 0);
    }

    // Distribute remainder to Asabah
    if (sisaHarta > 0.001 && asabah) {
        const totalRatio = asabah.heirs.reduce((sum, heir) => sum + (heir.count * heir.ratio), 0);
        if (totalRatio > 0) {
            asabah.heirs.forEach(heir => {
                const asabahShare = sisaHarta * (heir.count * heir.ratio) / totalRatio;
                amounts[heir.key] = (amounts[heir.key] || 0) + asabahShare;
                deskripsi[heir.key] = { status: (deskripsi[heir.key]?.status || "") + " + Sisa", deskripsi: asabah.type };
            });
            sisaHarta = 0;
        }
    }

    // Check for Radd (remainder with no Asabah)
    // Simplified Radd: Distribute remainder to non-spouse fardh-heirs
    if (sisaHarta > 0.001 && !asabah) {
        let raddHeirsShares = 0;
        for (const p in fardh) {
            if (p !== 'suami' && p !== 'istri') {
                raddHeirsShares += fardh[p];
            }
        }
        if (raddHeirsShares > 0) {
            for (const p in fardh) {
                if (p !== 'suami' && p !== 'istri') {
                    amounts[p] += sisaHarta * (fardh[p] / raddHeirsShares);
                    deskripsi[p].status += " (Radd)";
                }
            }
            sisaHarta = 0;
        }
    }

    // --- 5. Finalize output object ---
    const finalResult = {};
    for (const key in ahliWarisInput) {
        if ((typeof ahliWarisInput[key] === 'boolean' && ahliWarisInput[key]) || (typeof ahliWarisInput[key] === 'number' && ahliWarisInput[key] > 0)) {
            finalResult[key] = {
                jumlah: amounts[key] || 0,
                status: deskripsi[key]?.status || "Tidak Mendapat Bagian",
                deskripsi: deskripsi[key]?.deskripsi || "Tidak ada bagian atau terhalang."
            };
        }
    }

    return finalResult;
}
