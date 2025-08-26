/**
 * Kalkulator Faraid Sederhana
 *
 * Fungsi ini mengimplementasikan aturan dasar Faraid, termasuk beberapa kasus Hijab dan 'Aṣabah.
 * Ini bukan pengganti konsultasi dengan ulama yang ahli, tetapi sebagai alat bantu edukasi.
 *
 * Aturan yang diimplementasikan:
 * - Bagian Suami/Istri.
 * - Bagian Ayah, Ibu, Kakek, Nenek.
 * - Bagian Anak Laki-laki, Anak Perempuan.
 * - Bagian Cucu Laki-laki, Cucu Perempuan (dari anak laki-laki).
 * - Bagian Saudara Laki-laki, Saudara Perempuan.
 * - Hijab Hirman (penghalangan total) oleh Ayah dan Anak Laki-laki.
 * - 'Aṣabah (penerima sisa) oleh Anak Laki-laki, Ayah, dll.
 * - 'Aṣabah bil Ghair (bersama-sama) antara anak laki-laki & perempuan.
 * - 'Aṣabah ma'al Ghair (bersama yang lain) untuk saudara perempuan.
 */
export default function hitungFaraid(harta, ahliWaris) {
    let {
        suami, istri, ayah, ibu, kakek, nenek,
        anakL, anakP, cucuL, cucuP, saudaraL, saudaraP
    } = ahliWaris;

    const hasil = {};
    let sisaHarta = harta;
    let bagian = {};

    // Inisialisasi hasil untuk semua ahli waris yang ada
    Object.keys(ahliWaris).forEach(key => {
        if ((typeof ahliWaris[key] === 'boolean' && ahliWaris[key]) || (typeof ahliWaris[key] === 'number' && ahliWaris[key] > 0)) {
            hasil[key] = { status: "", jumlah: 0, deskripsi: "" };
        }
    });

    // --- Tahap 1: Pengecekan Hijab Hirman (Penghalangan Total) ---
    const adaAnakL = anakL > 0;
    const adaAnak = adaAnakL || anakP > 0;
    const adaCucuL = cucuL > 0;
    const adaCucu = adaCucuL || cucuP > 0;
    const adaKeturunan = adaAnak || adaCucu;

    if (ayah) {
        if (kakek) hasil.kakek = { status: "Terhalang", jumlah: 0, deskripsi: "Terhalang oleh Ayah" };
        if (saudaraL > 0) hasil.saudaraL = { status: "Terhalang", jumlah: 0, deskripsi: "Terhalang oleh Ayah" };
        if (saudaraP > 0) hasil.saudaraP = { status: "Terhalang", jumlah: 0, deskripsi: "Terhalang oleh Ayah" };
        kakek = false; saudaraL = 0; saudaraP = 0;
    }
    if (ibu) {
        if (nenek) hasil.nenek = { status: "Terhalang", jumlah: 0, deskripsi: "Terhalang oleh Ibu" };
        nenek = false;
    }
    if (adaAnakL) {
        if (cucuL > 0) hasil.cucuL = { status: "Terhalang", jumlah: 0, deskripsi: "Terhalang oleh Anak Laki-laki" };
        if (cucuP > 0) hasil.cucuP = { status: "Terhalang", jumlah: 0, deskripsi: "Terhalang oleh Anak Laki-laki" };
        if (saudaraL > 0) hasil.saudaraL = { status: "Terhalang", jumlah: 0, deskripsi: "Terhalang oleh Anak Laki-laki" };
        if (saudaraP > 0) hasil.saudaraP = { status: "Terhalang", jumlah: 0, deskripsi: "Terhalang oleh Anak Laki-laki" };
        cucuL = 0; cucuP = 0; saudaraL = 0; saudaraP = 0;
    }

    // --- Tahap 2: Pembagian Ashabul Furudh (Bagian Pasti) ---
    // Suami & Istri
    if (suami) bagian.suami = adaKeturunan ? 1/4 : 1/2;
    if (istri) bagian.istri = adaKeturunan ? 1/8 : 1/4;

    // Ibu
    const adaSaudara = (saudaraL + saudaraP) >= 2;
    if (ibu) bagian.ibu = (adaKeturunan || adaSaudara) ? 1/6 : 1/3;

    // Nenek
    if (nenek) bagian.nenek = 1/6;

    // Ayah & Kakek
    if (ayah && adaAnak) bagian.ayah = 1/6;
    if (kakek && adaCucu && !adaAnak) bagian.kakek = 1/6;

    // Anak Perempuan & Cucu Perempuan (jika tidak ada anak laki-laki)
    if (!adaAnakL) {
        if (anakP === 1 && cucuP === 0) bagian.anakP = 1/2;
        if (anakP >= 2 && cucuP === 0) bagian.anakP = 2/3;
        if (anakP === 1 && cucuP > 0) {
            bagian.anakP = 1/2;
            bagian.cucuP = 1/6; // Sebagai takmilah (penyempurna 2/3)
        }
        if (anakP === 0) {
            if (cucuP === 1) bagian.cucuP = 1/2;
            if (cucuP >= 2) bagian.cucuP = 2/3;
        }
    }

    // Hitung total bagian Ashabul Furudh
    let totalBagianPasti = 0;
    for (const p in bagian) {
        let jatah = 0;
        if (p === 'anakP') jatah = bagian[p] * harta;
        else if (p === 'cucuP') jatah = bagian[p] * harta;
        else jatah = bagian[p] * harta;

        hasil[p] = { status: `Bagian ${p === 'anakP' || p === 'cucuP' ? '' : (bagian[p] * 24) + '/24'}`, jumlah: jatah, deskripsi: "Ashabul Furudh" };
        sisaHarta -= jatah;
        totalBagianPasti += bagian[p];
    }

    if (totalBagianPasti > 1) { // Kasus 'Aul
        for (const p in hasil) {
            if (bagian[p]) {
                hasil[p].jumlah = (bagian[p] / totalBagianPasti) * harta;
                hasil[p].status += " ('Aul)";
            }
        }
        sisaHarta = 0;
    }

    // --- Tahap 3: Pembagian 'Aṣabah (Sisa) ---
    let sisaUntukAsabah = Math.max(0, sisaHarta);

    if (sisaUntukAsabah > 0) {
        let asabah = [];
        if (adaAnakL) asabah.push({key: 'anakL', count: anakL, ratio: 2}, {key: 'anakP', count: anakP, ratio: 1});
        else if (adaCucuL) asabah.push({key: 'cucuL', count: cucuL, ratio: 2}, {key: 'cucuP', count: cucuP, ratio: 1});
        else if (ayah) asabah.push({key: 'ayah', count: 1, ratio: 1});
        else if (kakek) asabah.push({key: 'kakek', count: 1, ratio: 1});
        else if (saudaraL > 0) asabah.push({key: 'saudaraL', count: saudaraL, ratio: 2}, {key: 'saudaraP', count: saudaraP, ratio: 1});
        else if (saudaraP > 0 && (adaAnak || adaCucu)) { // Asabah ma'al ghair
             asabah.push({key: 'saudaraP', count: saudaraP, ratio: 1});
        }

        let totalRatio = asabah.reduce((sum, heir) => sum + (heir.count * heir.ratio), 0);

        if (totalRatio > 0) {
            asabah.forEach(heir => {
                if (heir.count > 0) {
                    const jatahAsabah = (sisaUntukAsabah * heir.count * heir.ratio) / totalRatio;
                    hasil[heir.key] = {
                        status: hasil[heir.key] ? hasil[heir.key].status + " + 'Aṣabah" : "'Aṣabah",
                        jumlah: (hasil[heir.key] ? hasil[heir.key].jumlah : 0) + jatahAsabah,
                        deskripsi: "Menerima sisa harta"
                    };
                }
            });
            sisaHarta = 0;
        }
    }

    // --- Tahap 4: Radd (jika ada sisa dan tidak ada 'Aṣabah) ---
    // Logika Radd lebih kompleks dan di-skip untuk penyederhanaan saat ini.

    // Final formatting
    const finalResult = {};
    for (const p in hasil) {
        finalResult[p] = {
            ...hasil[p],
            jumlah: Math.round(hasil[p].jumlah) // Pembulatan
        };
    }

    return finalResult;
}
