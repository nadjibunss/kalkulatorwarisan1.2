export default function hitungFaraid(total, ahliWaris) {
  let hasil = {};
  let sisa = total;

  // Suami
  if (ahliWaris.suami) {
    hasil.suami = ahliWaris.anakL || ahliWaris.anakP ? total * 0.25 : total * 0.5;
    sisa -= hasil.suami;
  }

  // Istri
  if (ahliWaris.istri) {
    hasil.istri = ahliWaris.anakL || ahliWaris.anakP ? total * 0.125 : total * 0.25;
    sisa -= hasil.istri;
  }

  // Ibu
  if (ahliWaris.ibu) {
    if (ahliWaris.anakL || ahliWaris.anakP) {
      hasil.ibu = total * (1 / 6);
    } else if (ahliWaris.ayah) {
      hasil.ibu = total * (1 / 6);
    } else {
      hasil.ibu = total * (1 / 3);
    }
    sisa -= hasil.ibu;
  }

  // Ayah
  if (ahliWaris.ayah) {
    if (ahliWaris.anakL || ahliWaris.anakP) {
      hasil.ayah = total * (1 / 6);
      sisa -= hasil.ayah;
    } else {
      hasil.ayah = sisa;
      sisa = 0;
    }
  }

  // Anak
  if (ahliWaris.anakL || ahliWaris.anakP) {
    const totalBagian = (ahliWaris.anakL * 2) + ahliWaris.anakP;
    const bagianPerUnit = sisa / totalBagian;

    hasil["anakLaki(perOrang)"] = bagianPerUnit * 2;
    hasil["anakPerempuan(perOrang)"] = bagianPerUnit;
  }

  return hasil;
    }
