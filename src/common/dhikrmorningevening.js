// Morning and evening dhikr, in the order and counts given by
// https://almanhaj.or.id/11518-dzikir-pagi-dan-petang.html
// The article has Arabic and Indonesian only; the Arabic follows the article, the Latin
// transliteration follows Hisnul Muslim. Qur'an text: Tanzil Quran Text (Simple), Copyright (C) Tanzil
// Project, CC BY 3.0, used verbatim (verse numbers added) under Tanzil's terms: https://tanzil.net
// `only` limits a step to 'morning' or 'evening'; `evening` overrides text for the evening set.
const ITEMS = [
  {
    latin:
      "Allaahu laa ilaaha illaa huwal hayyul qoyyuum, laa ta'khudzuhuu sinatuw wa laa naum, lahuu maa fis samaawaati wa maa fil ardh, man dzal ladzii yasyfa'u 'indahuu illaa bi idznih, ya'lamu maa baina aidiihim wa maa kholfahum, wa laa yuhiithuuna bisyai-im min 'ilmihii illaa bimaa syaa', wasi'a kursiyyuhus samaawaati wal ardh, wa laa ya-uuduhuu hifzhuhumaa, wa huwal 'aliyyul 'azhiim (255)",
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ (٢٥٥)',
    count: 1,
    meaning: {
      id: "Diawali A'uudzu billaahi minasy syaithoonir rojiim, lalu baca QS. Al-Baqarah: 255",
      en: "Begin with A'udhu billahi minash-shaytanir-rajim, then recite Al-Baqarah 2:255",
      zh: '先念求护词，再诵读《黄牛章》第255节'
    }
  },
  {
    latin:
      'Bismillaahir rahmaanir rahiim. Qul huwallaahu ahad (1) Allaahush shomad (2) Lam yalid wa lam yuulad (3) Wa lam yakul lahuu kufuwan ahad (4)',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ هُوَ اللَّهُ أَحَدٌ (١) اللَّهُ الصَّمَدُ (٢) لَمْ يَلِدْ وَلَمْ يُولَدْ (٣) وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ (٤)',
    count: 3,
    meaning: { id: 'Baca surat Al-Ikhlas', en: 'Recite Surah Al-Ikhlas', zh: '诵读《忠诚章》' }
  },
  {
    latin:
      "Bismillaahir rahmaanir rahiim. Qul a'uudzu birobbil falaq (1) Min syarri maa kholaq (2) Wa min syarri ghoosiqin idzaa waqob (3) Wa min syarrin naffaatsaati fil 'uqod (4) Wa min syarri haasidin idzaa hasad (5)",
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (١) مِنْ شَرِّ مَا خَلَقَ (٢) وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ (٣) وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (٤) وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ (٥)',
    count: 3,
    meaning: { id: 'Baca surat Al-Falaq', en: 'Recite Surah Al-Falaq', zh: '诵读《曙光章》' }
  },
  {
    latin:
      "Bismillaahir rahmaanir rahiim. Qul a'uudzu birobbin naas (1) Malikin naas (2) Ilaahin naas (3) Min syarril waswaasil khonnaas (4) Alladzii yuwaswisu fii shuduurin naas (5) Minal jinnati wan naas (6)",
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ النَّاسِ (١) مَلِكِ النَّاسِ (٢) إِلَٰهِ النَّاسِ (٣) مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (٤) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (٥) مِنَ الْجِنَّةِ وَالنَّاسِ (٦)',
    count: 3,
    meaning: { id: 'Baca surat An-Nas', en: 'Recite Surah An-Nas', zh: '诵读《世人章》' }
  },
  {
    latin:
      "Ashbahnaa wa ashbahal mulku lillaah, walhamdu lillaah, laa ilaaha illallaah wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qodiir. Robbi as-aluka khoiro maa fii haadzal yaum wa khoiro maa ba'dahu, wa a'uudzu bika min syarri maa fii haadzal yaum wa syarri maa ba'dahu. Robbi a'uudzu bika minal kasali wa suu-il kibar. Robbi a'uudzu bika min 'adzaabin fin naari wa 'adzaabin fil qobr",
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِيْ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوْءِ الْكِبَرِ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    count: 1,
    meaning: {
      id: 'Kami memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tiada Rabb yang berhak disembah selain Allah Yang Maha Esa. Ya Rabbku, aku mohon kebaikan di hari ini dan sesudahnya, dan aku berlindung dari kejahatan hari ini dan sesudahnya, dari kemalasan, keburukan di hari tua, siksa neraka dan siksa kubur.',
      en: 'We have entered the morning and the dominion belongs to Allah; all praise is for Allah. There is no god but Allah alone. My Lord, I ask You for the good of this day and what follows it, and seek refuge from its evil and what follows it, from laziness and the misery of old age, and from the punishment of the Fire and the grave.',
      zh: '我们进入早晨，国权归真主，一切赞颂归真主。万物非主，唯有真主。我的主啊，我求你赐我今日及其后的福分，求你护佑我免遭今日及其后的祸害，免遭懒惰与衰老之苦，免遭火狱与坟墓之刑。'
    },
    evening: {
      latin:
        "Amsainaa wa amsal mulku lillaah, walhamdu lillaah, laa ilaaha illallaah wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qodiir. Robbi as-aluka khoiro maa fii haadzihil lailah wa khoiro maa ba'dahaa, wa a'uudzu bika min syarri maa fii haadzihil lailah wa syarri maa ba'dahaa. Robbi a'uudzu bika minal kasali wa suu-il kibar. Robbi a'uudzu bika min 'adzaabin fin naari wa 'adzaabin fil qobr",
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
      meaning: {
        id: 'Kami memasuki waktu sore dan kerajaan hanya milik Allah, segala puji bagi Allah. Tiada Rabb yang berhak disembah selain Allah Yang Maha Esa. Ya Rabbku, aku mohon kebaikan di malam ini dan sesudahnya, dan aku berlindung dari kejahatan malam ini dan sesudahnya, dari kemalasan, keburukan di hari tua, siksa neraka dan siksa kubur.',
        en: 'We have entered the evening and the dominion belongs to Allah; all praise is for Allah. There is no god but Allah alone. My Lord, I ask You for the good of this night and what follows it, and seek refuge from its evil and what follows it, from laziness and the misery of old age, and from the punishment of the Fire and the grave.',
        zh: '我们进入傍晚，国权归真主，一切赞颂归真主。万物非主，唯有真主。我的主啊，我求你赐我今夜及其后的福分，求你护佑我免遭今夜及其后的祸害，免遭懒惰与衰老之苦，免遭火狱与坟墓之刑。'
      }
    }
  },
  {
    latin: "Allahumma bika ashbahnaa, wa bika amsainaa, wa bika nahyaa, wa bika namuutu, wa ilaikan nusyuur",
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ، وَإِلَيْكَ النُّشُوْرُ',
    count: 1,
    meaning: {
      id: 'Ya Allah, dengan rahmat-Mu kami memasuki waktu pagi dan waktu sore, dengan-Mu kami hidup dan mati, dan kepada-Mu kebangkitan.',
      en: 'O Allah, by You we enter the morning and the evening, by You we live and die, and to You is the resurrection.',
      zh: '主啊，我们凭你进入早晨与傍晚，凭你生，凭你死，复活归于你。'
    },
    evening: {
      latin: "Allahumma bika amsainaa, wa bika ashbahnaa, wa bika nahyaa, wa bika namuutu, wa ilaikal mashiir",
      arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيْرُ',
      meaning: {
        id: 'Ya Allah, dengan rahmat-Mu kami memasuki waktu sore dan waktu pagi, dengan-Mu kami hidup dan mati, dan kepada-Mu tempat kembali.',
        en: 'O Allah, by You we enter the evening and the morning, by You we live and die, and to You is the return.',
        zh: '主啊，我们凭你进入傍晚与早晨，凭你生，凭你死，归宿在你那里。'
      }
    }
  },
  {
    latin:
      "Allahumma anta robbii laa ilaaha illaa anta, kholaqtanii wa ana 'abduka, wa ana 'alaa 'ahdika wa wa'dika mastatho'tu, a'uudzu bika min syarri maa shona'tu, abuu-u laka bini'matika 'alayya, wa abuu-u bidzanbii, faghfirlii fa innahu laa yaghfirudz dzunuuba illaa anta",
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّيْ لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ',
    count: 1,
    meaning: {
      id: 'Sayyidul Istighfar. Ya Allah, Engkau Rabbku, tiada Rabb yang berhak disembah selain Engkau. Engkau menciptakanku dan aku hamba-Mu, aku berada di atas perjanjian-Mu semampuku. Aku berlindung dari kejahatan perbuatanku, aku mengakui nikmat-Mu dan dosaku, maka ampunilah aku, karena tiada yang mengampuni dosa selain Engkau.',
      en: 'The master of seeking forgiveness. O Allah, You are my Lord, there is no god but You. You created me and I am Your servant, keeping Your covenant as best I can. I seek refuge from the evil I have done, I acknowledge Your favour upon me and my sin, so forgive me, for none forgives sins but You.',
      zh: '求饶恕之冠。主啊，你是我的主，除你外绝无应受崇拜者。你创造了我，我是你的仆人，我尽力遵守对你的约定。求你护佑我免遭我所做的恶，我承认你的恩典与我的罪过，求你饶恕我，因为除你外无人能饶恕罪过。'
    }
  },
  {
    latin:
      "Allahumma 'aafinii fii badanii, Allahumma 'aafinii fii sam'ii, Allahumma 'aafinii fii bashorii, laa ilaaha illaa anta. Allahumma innii a'uudzu bika minal kufri wal faqr, wa a'uudzu bika min 'adzaabil qobr, laa ilaaha illaa anta",
    arabic: 'اللَّهُمَّ عَافِنِيْ فِيْ بَدَنِيْ، اللَّهُمَّ عَافِنِيْ فِيْ سَمْعِيْ، اللَّهُمَّ عَافِنِيْ فِيْ بَصَرِيْ، لاَ إِلَهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوْذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ',
    count: 3,
    meaning: {
      id: 'Ya Allah, selamatkanlah tubuhku, pendengaranku, dan penglihatanku. Tiada Rabb yang berhak disembah selain Engkau. Ya Allah, aku berlindung kepada-Mu dari kekufuran, kefakiran, dan siksa kubur.',
      en: 'O Allah, grant health to my body, my hearing and my sight. There is no god but You. O Allah, I seek refuge in You from disbelief, poverty, and the punishment of the grave.',
      zh: '主啊，求你使我的身体、听觉和视觉健康。除你外绝无应受崇拜者。主啊，求你护佑我免遭不信、贫穷和坟墓之刑。'
    }
  },
  {
    latin:
      "Allahumma innii as-alukal 'afwa wal 'aafiyah fid dunyaa wal aakhiroh. Allahumma innii as-alukal 'afwa wal 'aafiyah fii diinii wa dun-yaaya wa ahlii wa maalii. Allahummastur 'awrootii wa aamin row'aatii. Allahummahfazhnii min baini yadayya wa min kholfii wa 'an yamiinii wa 'an syimaalii wa min fauqii, wa a'uudzu bi 'azhomatika an ughtaala min tahtii",
    arabic: 'اللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِيْنِيْ وَدُنْيَايَ وَأَهْلِيْ وَمَالِيْ، اللَّهُمَّ اسْتُرْ عَوْرَاتِيْ وَآمِنْ رَوْعَاتِيْ. اللَّهُمَّ احْفَظْنِيْ مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِيْ، وَعَنْ يَمِيْنِيْ وَعَنْ شِمَالِيْ، وَمِنْ فَوْقِيْ، وَأَعُوْذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِيْ',
    count: 1,
    meaning: {
      id: 'Ya Allah, aku memohon ampunan dan keselamatan di dunia dan akhirat, dalam agama, dunia, keluarga, dan hartaku. Tutupilah auratku dan tenteramkan aku dari rasa takut. Peliharalah aku dari depan, belakang, kanan, kiri, dan atas, dan aku berlindung dengan keagungan-Mu agar tidak dicelakakan dari bawah.',
      en: 'O Allah, I ask You for pardon and well-being in this world and the next, in my religion, worldly affairs, family and wealth. Conceal my faults and calm my fears. Protect me from in front, behind, my right, my left and above, and I seek refuge in Your greatness from being harmed from below.',
      zh: '主啊，我求你在今世和后世饶恕我、赐我平安，保佑我的宗教、生活、家人和财产。求你遮掩我的缺陷，平息我的恐惧。求你从前后左右和上方保护我，我凭你的伟大求护佑，免遭来自下方的伤害。'
    }
  },
  {
    latin:
      "Allahumma 'aalimal ghoibi wasy syahaadah, faathiros samaawaati wal ardh, robba kulli syai-in wa maliikah, asyhadu an laa ilaaha illaa anta, a'uudzu bika min syarri nafsii, wa min syarrisy syaithooni wa syirkihi, wa an aqtarifa 'alaa nafsii suu-an aw ajurrohu ilaa muslim",
    arabic: 'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيْكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِيْ، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِيْ سُوْءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ',
    count: 1,
    meaning: {
      id: 'Ya Allah, Yang Mengetahui yang gaib dan yang nyata, Pencipta langit dan bumi, Rabb dan Penguasa segala sesuatu. Aku bersaksi tiada Rabb yang berhak disembah selain Engkau. Aku berlindung dari kejahatan diriku, setan dan ajakan syiriknya, serta dari berbuat buruk terhadap diriku atau kepada seorang muslim.',
      en: 'O Allah, Knower of the unseen and the seen, Creator of the heavens and the earth, Lord and Sovereign of all things. I bear witness that there is no god but You. I seek refuge from the evil of myself, of Satan and his call to shirk, and from wronging myself or any Muslim.',
      zh: '主啊，全知幽玄与显著的主，天地的创造者，万物的主宰。我作证除你外绝无应受崇拜者。求你护佑我免遭自身之恶、恶魔及其以物配主之恶，免于伤害自己或任何穆斯林。'
    }
  },
  {
    latin: "Bismillaahil ladzii laa yadhurru ma'asmihi syai-un fil ardhi wa laa fis samaa', wa huwas samii'ul 'aliim",
    arabic: 'بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيْعُ الْعَلِيْمُ',
    count: 3,
    meaning: {
      id: 'Dengan nama Allah yang bila disebut, segala sesuatu di bumi dan langit tidak akan membahayakan. Dia Maha Mendengar lagi Maha Mengetahui.',
      en: 'In the name of Allah, with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.',
      zh: '奉真主之名，有他的尊名，天地间任何事物都不能伤害。他是全听的，全知的。'
    }
  },
  {
    latin: "Rodhiitu billaahi robbaa, wa bil islaami diinaa, wa bi Muhammadin shollallahu 'alaihi wa sallama nabiyyaa",
    arabic: 'رَضِيْتُ بِاللهِ رَبًّا، وَبِالْإِسْلاَمِ دِيْنًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    count: 3,
    meaning: {
      id: 'Aku ridha Allah sebagai Rabb, Islam sebagai agama, dan Muhammad shallallahu alaihi wa sallam sebagai nabi.',
      en: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad (peace be upon him) as my Prophet.',
      zh: '我喜悦真主为我的主，伊斯兰为我的宗教，穆罕默德为我的先知。'
    }
  },
  {
    latin: "Yaa Hayyu yaa Qoyyuum, bi rohmatika astaghiits, ashlih lii sya'nii kullahu, wa laa takilnii ilaa nafsii thorfata 'ain",
    arabic: 'يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ، أَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ وَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ',
    count: 1,
    meaning: {
      id: 'Wahai Rabb Yang Maha Hidup dan Berdiri Sendiri, dengan rahmat-Mu aku memohon pertolongan. Perbaikilah seluruh urusanku dan jangan Engkau serahkan kepada diriku walau sekejap mata.',
      en: 'O Ever-Living, O Self-Sustaining, by Your mercy I seek help. Set right all my affairs and do not leave me to myself even for the blink of an eye.',
      zh: '永生不灭、自立的主啊，我凭你的慈悯求援。求你改善我的一切事务，片刻也不要把我交给我自己。'
    }
  },
  {
    latin:
      "Ashbahnaa 'alaa fithrotil islaam, wa 'alaa kalimatil ikhlaash, wa 'alaa diini nabiyyinaa Muhammadin shollallahu 'alaihi wa sallam, wa 'alaa millati abiinaa Ibroohiima haniifam muslimaa, wa maa kaana minal musyrikiin",
    arabic: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلاَمِ وَعَلَى كَلِمَةِ الْإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ',
    count: 1,
    meaning: {
      id: 'Di waktu pagi kami berada di atas fitrah Islam, kalimat ikhlas, agama Nabi kami Muhammad, dan agama bapak kami Ibrahim yang lurus dan muslim, dan ia tidak termasuk orang musyrik.',
      en: 'We have entered the morning upon the natural way of Islam, the word of sincerity, the religion of our Prophet Muhammad, and the way of our father Ibrahim, upright and Muslim, who was not of the polytheists.',
      zh: '我们在伊斯兰的天性、忠诚之言、我们先知穆罕默德的宗教，以及我们祖先易卜拉欣纯正的宗教上进入早晨，他不是以物配主者。'
    },
    evening: {
      latin:
        "Amsainaa 'alaa fithrotil islaam, wa 'alaa kalimatil ikhlaash, wa 'alaa diini nabiyyinaa Muhammadin shollallahu 'alaihi wa sallam, wa 'alaa millati abiinaa Ibroohiima haniifam muslimaa, wa maa kaana minal musyrikiin",
      arabic: 'أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلاَمِ وَعَلَى كَلِمَةِ الْإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ',
      meaning: {
        id: 'Di waktu sore kami berada di atas fitrah Islam, kalimat ikhlas, agama Nabi kami Muhammad, dan agama bapak kami Ibrahim yang lurus dan muslim, dan ia tidak termasuk orang musyrik.',
        en: 'We have entered the evening upon the natural way of Islam, the word of sincerity, the religion of our Prophet Muhammad, and the way of our father Ibrahim, upright and Muslim, who was not of the polytheists.',
        zh: '我们在伊斯兰的天性、忠诚之言、我们先知穆罕默德的宗教，以及我们祖先易卜拉欣纯正的宗教上进入傍晚，他不是以物配主者。'
      }
    }
  },
  {
    latin: "Laa ilaaha illallaah wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qodiir",
    arabic: 'لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ',
    count: 10,
    meaning: {
      id: 'Tiada Rabb yang berhak disembah selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujian, Dia Mahakuasa atas segala sesuatu.',
      en: 'There is no god but Allah alone, without partner. His is the dominion and the praise, and He has power over all things.',
      zh: '万物非主，唯有真主，独一无偶。国权归他，赞颂归他，他对万事是全能的。'
    },
    note: { id: 'Atau 1x saat malas', en: 'Or once if unable', zh: '或念一次' }
  },
  {
    latin: "Subhaanallaahi wa bihamdihi 'adada kholqihi, wa ridhoo nafsihi, wa zinata 'arsyihi, wa midaada kalimaatih",
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
    count: 3,
    only: 'morning',
    meaning: {
      id: 'Maha Suci Allah dan aku memuji-Nya sebanyak makhluk-Nya, sesuai ridha-Nya, seberat timbangan Arsy-Nya, dan sebanyak tinta kalimat-Nya.',
      en: 'Glory be to Allah and praise Him, as many as His creation, as much as pleases Him, as heavy as His Throne, and as much as the ink of His words.',
      zh: '赞主清净，赞颂归于他，其数如他的造物，如他所喜悦，如他宝座之重，如他言辞之墨。'
    }
  },
  {
    latin: "Allahumma innii as-aluka 'ilman naafi'aa, wa rizqon thoyyibaa, wa 'amalan mutaqobbalaa",
    arabic: 'اللَّهُمَّ إِنِّيْ أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً',
    count: 1,
    only: 'morning',
    meaning: {
      id: 'Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang halal, dan amal yang diterima.',
      en: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.',
      zh: '主啊，我向你祈求有益的知识、佳美的给养和被接受的善功。'
    }
  },
  {
    latin: 'Subhaanallaahi wa bihamdih',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
    count: 100,
    meaning: { id: 'Maha Suci Allah, aku memuji-Nya', en: 'Glory be to Allah and praise Him', zh: '赞主清净，赞颂归于他' }
  },
  {
    latin: 'Astaghfirullaaha wa atuubu ilaih',
    arabic: 'أَسْتَغْفِرُ اللهَ وَأَتُوْبُ إِلَيْهِ',
    count: 100,
    meaning: {
      id: 'Aku memohon ampun kepada Allah dan bertaubat kepada-Nya',
      en: 'I seek forgiveness from Allah and repent to Him',
      zh: '我向真主求饶恕，并向他忏悔'
    },
    note: { id: '100x dalam sehari', en: '100 times a day', zh: '每日100次' }
  },
  {
    latin: "A'uudzu bi kalimaatillaahit taammaati min syarri maa kholaq",
    arabic: 'أَعُوْذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    count: 3,
    only: 'evening',
    meaning: {
      id: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang diciptakan-Nya.',
      en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
      zh: '我凭真主完美的言辞求护佑，免遭他所造之物的伤害。'
    }
  }
]

// Steps for 'morning' or 'evening'
export function morningEveningDhikr(period) {
  return ITEMS.filter((item) => !item.only || item.only === period).map((item) => {
    const override = period === 'evening' && item.evening ? item.evening : {}
    return {
      latin: override.latin || item.latin,
      arabic: override.arabic || item.arabic,
      count: item.count,
      meaning: override.meaning || item.meaning,
      note: item.note
    }
  })
}
