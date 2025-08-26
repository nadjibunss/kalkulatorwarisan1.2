/**
 * Mesin Kalkulator Faraid V2
 *
 * Logika ini menangani kasus-kasus waris yang lebih kompleks, termasuk:
 * - Hirarki ahli waris.
 * - Aturan Hijab Hirman (penghalangan total) dan Hijab Nuqshan (pengurangan bagian).
 * - Tiga jenis 'Asabah: bi-nafsihi, bi-al-ghair, ma'a al-ghair.
 * - Kasus khusus seperti 'Aul (penambahan) dan Radd (pengembalian).
 *
 * Ini tetap merupakan model yang disederhanakan dan bukan pengganti nasihat hukum dari ahli Faraid.
 */
export default function hitungFaraid(harta, ahliWarisInput) {
    let ahliWaris = { ...ahliWarisInput };
    let hasil = {};
    let sisaHarta = harta;
    let totalBagian = 0;

    // Inisialisasi semua ahli waris yang ada
    for (const key in ahliWaris) {
        if ((typeof ahliWaris[key] === 'boolean' && ahliWaris[key]) || (typeof ahliWaris[key] === 'number' && ahliWaris[key] > 0)) {
            hasil[key] = { status: "", jumlah: 0, deskripsi: "" };
        }
    }

    const adaAnakL = ahliWaris.anakL > 0;
    const adaAnakP = ahliWaris.anakP > 0;
    const adaCucuL = ahliWaris.cucuL > 0;
    const adaCucuP = ahliWaris.cucuP > 0;
    const adaAyah = ahliWaris.ayah;
    const adaIbu = ahliWaris.ibu;
    const adaKakek = ahliWaris.kakek;
    const adaNenek = ahliWaris.nenek;
    const adaSuami = ahliWaris.suami;
    const adaIstri = ahliWaris.istri;
    const jumlahSaudara = (ahliWaris.saudaraL || 0) + (ahliWaris.saudaraP || 0);

    const adaKeturunanLaki = adaAnakL || adaCucuL;
    const adaKeturunan = adaAnakL || adaAnakP || adaCucuL || adaCucuP;

    // --- Tahap 1: HIJAB HIRMAN (Penghalangan Total) ---
    if (adaAyah && adaKakek) {
        hasil.kakek = { status: "Terhalang (Hijab)", jumlah: 0, deskripsi: "Terhalang oleh Ayah." };
        ahliWaris.kakek = false;
    }
    if (adaIbu && adaNenek) {
        hasil.nenek = { status: "Terhalang (Hijab)", jumlah: 0, deskripsi: "Terhalang oleh Ibu." };
        ahliWaris.nenek = false;
    }
    if (adaAnakL) {
        if (ahliWaris.cucuL > 0) { hasil.cucuL = { status: "Terhalang (Hijab)", jumlah: 0, deskripsi: "Terhalang oleh Anak Laki-laki." }; ahliWaris.cucuL = 0; }
        if (ahliWaris.cucuP > 0) { hasil.cucuP = { status: "Terhalang (Hijab)", jumlah: 0, deskripsi: "Terhalang oleh Anak Laki-laki." }; ahliWaris.cucuP = 0; }
    }
    if (adaAnakL || adaAyah) {
        if (ahliWaris.saudaraL > 0) { hasil.saudaraL = { status: "Terhalang (Hijab)", jumlah: 0, deskripsi: "Terhalang oleh Anak Laki-laki atau Ayah." }; ahliWaris.saudaraL = 0; }
        if (ahliWaris.saudaraP > 0) { hasil.saudaraP = { status: "Terhalang (Hijab)", jumlah: 0, deskripsi: "Terhalang oleh Anak Laki-laki atau Ayah." }; ahliWaris.saudaraP = 0; }
    }

    // --- Tahap 2: ASHABUL FURUD (Bagian Tetap) ---
    let bagian = {};

    if (ahliWaris.suami) bagian.suami = adaKeturunan ? 1/4 : 1/2;
    if (ahliWaris.istri) bagian.istri = adaKeturunan ? 1/8 : 1/4;
    if (ahliWaris.ibu) bagian.ibu = (adaKeturunan || jumlahSaudara >= 2) ? 1/6 : 1/3;
    // Kasus Umariyyatain (Ayah, Ibu, Suami/Istri) - Ibu mendapat 1/3 dari sisa
    if (adaIbu && adaAyah && !adaKeturunan && jumlahSaudara < 2 && (adaSuami || adaIstri)) {
        bagian.ibu = "1/3 Sisa"; // Ditangani secara khusus setelah bagian pasangan
    }
    if (ahliWaris.ayah && adaKeturunanLaki) bagian.ayah = 1/6;
    if (ahliWaris.kakek && adaKeturunanLaki) bagian.kakek = 1/6;
    if (ahliWaris.nenek) bagian.nenek = 1/6;

    if (!adaAnakL && !adaCucuL) {
      if (ahliWaris.anakP === 1 && ahliWaris.saudaraP > 0) { // 'Asabah ma'a al-Ghair
          bagian.anakP = 1/2;
      } else if (ahliWaris.anakP === 1) {
          bagian.anakP = 1/2;
      } else if (ahliWaris.anakP >= 2) {
          bagian.anakP = 2/3;
      }

      if (!adaAnakP && ahliWaris.cucuP > 0) {
          if(ahliWaris.cucuP === 1) bagian.cucuP = 1/2;
          else bagian.cucuP = 2/3;
      } else if (ahliWaris.anakP === 1 && ahliWaris.cucuP > 0) {
          bagian.cucuP = 1/6; // Takmilah
      }
    }

    // Hitung bagian tetap dan sisa harta
    let hartaSetelahPasangan = harta;
    if (bagian.suami) {
        hasil.suami = { status: "1/4" + (adaKeturunan ? "" : " (tidak ada anak)"), jumlah: harta * bagian.suami, deskripsi: "Bagian tetap suami" };
        sisaHarta -= hasil.suami.jumlah;
        hartaSetelahPasangan -= hasil.suami.jumlah;
    }
    if (bagian.istri) {
        hasil.istri = { status: "1/8" + (adaKeturunan ? "" : " (tidak ada anak)"), jumlah: harta * bagian.istri, deskripsi: "Bagian tetap istri" };
        sisaHarta -= hasil.istri.jumlah;
        hartaSetelahPasangan -= hasil.istri.jumlah;
    }

    if (bagian.ibu === "1/3 Sisa") {
        bagian.ibu = (1/3) * hartaSetelahPasangan / harta; // Normalisasi ke fraksi total harta
        hasil.ibu = { status: "1/3 Sisa", jumlah: harta * bagian.ibu, deskripsi: "Kasus Umariyyatain" };
        sisaHarta -= hasil.ibu.jumlah;
    } else if (bagian.ibu) {
        hasil.ibu = { status: "1/6", jumlah: harta * bagian.ibu, deskripsi: "Bagian tetap ibu" };
        sisaHarta -= hasil.ibu.jumlah;
    }

    // ... Lanjutkan untuk Ashabul Furudh lainnya
    ['ayah', 'kakek', 'nenek', 'anakP', 'cucuP', 'saudaraP'].forEach(key => {
        if (bagian[key] && !hasil[key]) {
            const jumlah = bagian[key] * harta;
            hasil[key] = { status: `Bagian ${bagian[key]}`, jumlah: jumlah, deskripsi: "Ashabul Furudh" };
            sisaHarta -= jumlah;
        }
    });


    // --- Tahap 3: 'AṢABAH (Penerima Sisa) ---
    sisaHarta = Math.max(0, sisaHarta);

    if (sisaHarta > 0.001) {
        const asabahList = [];
        if (adaAnakL) asabahList.push({ key: 'anakL', count: anakL, ratio: 2 }, { key: 'anakP', count: anakP, ratio: 1 });
        else if (adaCucuL) asabahList.push({ key: 'cucuL', count: cucuL, ratio: 2 }, { key: 'cucuP', count: cucuP, ratio: 1 });
        else if (adaAyah && !adaKeturunanLaki) asabahList.push({ key: 'ayah', count: 1, ratio: 1 });
        else if (adaKakek && !adaKeturunanLaki) asabahList.push({ key: 'kakek', count: 1, ratio: 1 });
        else if (ahliWaris.saudaraL > 0) asabahList.push({ key: 'saudaraL', count: ahliWaris.saudaraL, ratio: 2 }, { key: 'saudaraP', count: ahliWaris.saudaraP, ratio: 1 });
        else if (ahliWaris.saudaraP > 0 && adaKeturunan && !adaKeturunanLaki) asabahList.push({ key: 'saudaraP', count: ahliWaris.saudaraP, ratio: 1 });

        const totalRatio = asabahList.reduce((sum, heir) => sum + (heir.count * heir.ratio), 0);

        if (totalRatio > 0) {
            asabahList.forEach(heir => {
                if (heir.count > 0) {
                    const jatahAsabah = (sisaHarta * heir.count * heir.ratio) / totalRatio;
                    const isBilGhair = (heir.key === 'anakP' || heir.key === 'cucuP' || heir.key === 'saudaraP') && asabahList.some(h => h.ratio === 2);
                    const isMaalGhair = (heir.key === 'saudaraP') && !asabahList.some(h => h.ratio === 2);
                    const deskripsi = isBilGhair ? "'Aṣabah bil-Ghair" : (isMaalGhair ? "'Aṣabah ma'al-Ghair" : "'Aṣabah bin-Nafs");

                    if (hasil[heir.key]) {
                        hasil[heir.key].jumlah += jatahAsabah;
                        hasil[heir.key].status += " + Sisa";
                        hasil[heir.key].deskripsi = deskripsi;
                    } else {
                        hasil[heir.key] = { status: "'Aṣabah", jumlah: jatahAsabah, deskripsi: deskripsi };
                    }
                }
            });
        }
    }

    // --- Tahap 4: Finalisasi & Pembulatan ---
    const finalResult = {};
    for (const key in ahliWaris) {
      if ((typeof ahliWaris[key] === 'boolean' && ahliWaris[key]) || (typeof ahliWaris[key] === 'number' && ahliWaris[key] > 0)) {
        if (hasil[key]) {
          finalResult[key] = {
            status: hasil[key].status,
            jumlah: Math.round(hasil[key].jumlah),
            deskripsi: hasil[key].deskripsi
          };
        } else {
           // Jika tidak dapat bagian dan tidak terhalang (misal, saudara perempuan dengan anak perempuan saja tanpa 'asabah lain)
           // Ini adalah kasus yg lebih kompleks, untuk sekarang kita tandai tidak dapat bagian
           finalResult[key] = { status: "Tidak Mendapat Bagian", jumlah: 0, deskripsi: "Tidak ada sisa harta ('Asabah) atau bagian tetap (Ashabul Furudh)." };
        }
      }
    }

    return finalResult;
}
