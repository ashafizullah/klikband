// Umrah guide following Almanhaj, "Tata Cara Umrah" by Yusuf bin Abdullah
// bin Ahmad Al-Ahmad: https://almanhaj.or.id/2252-tata-cara-umrah.html
// Each step: title and points per language, readings (Latin + meaning), and an
// optional round counter ('thawaf' or 'sai'). Indonesian meanings follow the
// article; the article has no transliteration, so the Latin is ours.

const TAKBIR = {
  latin: 'Allahu akbar',
  meaning: { id: 'Allah Maha Besar.', en: 'Allah is the Greatest.', zh: '真主至大。' }
}

const RUKUN_YAMANI = {
  latin: "Robbanaa aatinaa fid dunyaa hasanah, wa fil aakhiroti hasanah, wa qinaa 'adzaaban naar",
  meaning: {
    id: 'Wahai Rabb kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat, dan jagalah kami dari siksa api Neraka.',
    en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    zh: '我们的主啊！求你在今世赏赐我们美好的，在后世也赏赐我们美好的，求你保护我们免受火狱的刑罚。'
  }
}

const SHAFA_VERSE = {
  latin: "Innash shofaa wal marwata min sya'aa-irillaah",
  meaning: {
    id: "Sesungguhnya Shafa dan Marwah adalah sebagian dari syi'ar Allah. [Al-Baqarah/2: 158]",
    en: 'Indeed, Safa and Marwah are among the symbols of Allah. [Al-Baqarah 2:158]',
    zh: '赛法与麦尔维确是真主的标志。【黄牛章 2:158】'
  }
}

const ABDA_U = {
  latin: "Abda-u bimaa bada-allaahu bih",
  meaning: {
    id: 'Kami memulai dengan apa yang dengannya Allah memulai.',
    en: 'I begin with what Allah began with.',
    zh: '我从真主开始的地方开始。'
  }
}

const SHAFA_DHIKR = {
  latin:
    "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiit, wa huwa 'alaa kulli syai-in qodiir. Laa ilaaha illallaahu wahdahu laa syariika lah, anjaza wa'dah, wa nashoro 'abdah, wa hazamal ahzaaba wahdah",
  meaning: {
    id: 'Tiada sesembahan yang haq melainkan Allah semata, tiada sekutu bagi-Nya, hanya bagi-Nya segala kerajaan dan hanya bagi-Nya segala puji dan Dia Mahakuasa atas segala sesuatu. Tiada sesembahan yang haq melainkan Dia, tiada sekutu bagi-Nya, yang menepati janji-Nya, yang memenangkan hamba-Nya dan yang menghancurkan golongan-golongan (kafir) dengan tanpa dibantu siapa pun.',
    en: 'There is no god worthy of worship but Allah alone, without partner. His is the dominion and the praise, He gives life and causes death, and He has power over all things. There is no god but Allah alone, without partner; He fulfilled His promise, gave victory to His servant, and defeated the confederates alone.',
    zh: '除真主外，绝无应受崇拜的，他独一无偶。国权归他，赞颂归他，他使生使死，他对万事是全能的。除真主外，绝无应受崇拜的，他独一无偶；他实践了诺言，援助了他的仆人，独自击败了联军。'
  }
}

export const UMRAH_STEPS = [
  {
    title: { id: 'Ihram di Miqat', en: 'Ihram at the Miqat', zh: '在戒关受戒' },
    points: {
      id: [
        'Pria: mandi, pakai minyak wangi di badan (rambut, jenggot), bukan di pakaian ihram. Pakai kain dan selendang putih tanpa jahitan, serta sandal.',
        'Payung, kacamata, cincin dan sabuk boleh dipakai.',
        'Wanita: mandi meski haid, pakai pakaian yang memenuhi syarat hijab, tanpa perhiasan dan minyak wangi. Tidak ada warna khusus.',
        'Wanita tetap wajib menutup wajah dari laki-laki selama ihram.',
        'Naik pesawat: mandi di rumah, mulai ihram saat mendekati miqat.',
        'Khawatir terhalang sakit atau lainnya: ucapkan syarat (bacaan kedua).',
        'Pakaian ihram boleh diganti kapan saja. Jaga aurat, misalnya saat duduk atau tidur.'
      ],
      en: [
        "Men: bathe and put perfume on the body (hair, beard), not on the ihram cloth. Wear a white unsewn wrap and shawl, and sandals.",
        'An umbrella, glasses, ring and belt are allowed.',
        'Women: bathe even during menses and wear clothing that meets hijab requirements, without jewellery or perfume. No particular colour is required.',
        'Women must still cover the face from men while in ihram.',
        'By plane: bathe at home and enter ihram when nearing the miqat.',
        'If you fear being prevented by illness or else: say the condition (second reading).',
        'Ihram clothes may be changed at any time. Keep the awrah covered, e.g. when sitting or sleeping.'
      ],
      zh: [
        '男子：大净，在身体（头发、胡须）上擦香，不擦在戒衣上。穿无缝的白色围布和披肩，穿凉鞋。',
        '可以使用雨伞、眼镜、戒指和腰带。',
        '女子：即使在经期也要大净，穿符合盖头要求的衣服，不戴首饰，不用香料。没有指定颜色。',
        '受戒期间，女子仍须在男子面前遮盖面部。',
        '乘飞机：在家大净，接近戒关时受戒。',
        '若担心因病等受阻：念条件词（第二段念词）。',
        '戒衣可随时更换。注意遮盖羞体，例如坐着或睡觉时。'
      ]
    },
    readings: [
      {
        latin: "Labbaika 'umratan",
        meaning: {
          id: 'Aku penuhi panggilan-Mu untuk menunaikan ibadah umrah.',
          en: 'Here I am, answering Your call to perform umrah.',
          zh: '我响应你的召唤，前来履行副朝。'
        }
      },
      {
        latin: 'Fa in habasanii haabisun, fa mahillii haitsu habastanii',
        meaning: {
          id: 'Jika aku terhalang oleh suatu halangan maka tempat (tahallul)ku adalah di mana Engkau menahanku.',
          en: 'If I am prevented by any obstacle, then my place of release is wherever You hold me back.',
          zh: '如果我被任何障碍阻挡，那么你阻挡我的地方就是我开戒的地方。'
        }
      }
    ]
  },
  {
    title: { id: 'Talbiyah', en: 'Talbiyah', zh: '应召词' },
    points: {
      id: [
        'Dibaca sejak ihram hingga sampai di Makkah. Hukumnya sunnah mu’akkadah bagi pria dan wanita.',
        'Pria mengeraskan suara, wanita tidak.',
        'Dibaca sendiri-sendiri, bukan bersama-sama dengan satu suara.',
        'Disunnahkan mandi sebelum masuk Makkah jika memungkinkan.'
      ],
      en: [
        'Recited from ihram until reaching Makkah. It is a stressed sunnah for men and women.',
        'Men raise their voices, women do not.',
        'Each person recites it alone, not in unison as a group.',
        'Bathing before entering Makkah is sunnah if possible.'
      ],
      zh: [
        '从受戒开始念，直到抵达麦加。对男女都是重要圣行。',
        '男子高声念，女子不高声。',
        '各自念诵，不要集体齐声念。',
        '如有可能，进入麦加前大净是圣行。'
      ]
    },
    readings: [
      {
        latin:
          "Labbaikallaahumma labbaik, labbaika laa syariika laka labbaik, innal hamda wan ni'mata laka wal mulk, laa syariika lak",
        meaning: {
          id: 'Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Aku penuhi panggilan-Mu, tidak ada sekutu bagi-Mu, aku penuhi panggilan-Mu. Sesungguhnya segala pujian dan nikmat serta kerajaan adalah milik-Mu, tidak ada sekutu bagi-Mu.',
          en: 'Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Surely all praise, blessings and dominion are Yours. You have no partner.',
          zh: '主啊，我来响应你了，我来响应你了。我来响应你了，你没有伙伴，我来响应你了。一切赞颂、恩典和国权都属于你，你没有伙伴。'
        }
      }
    ]
  },
  {
    title: { id: 'Masuk Masjidil Haram', en: 'Entering Masjid al-Haram', zh: '进入禁寺' },
    points: {
      id: ['Dahulukan kaki kanan dan baca doa di bawah. Doa ini juga dibaca saat masuk masjid lain.'],
      en: ['Enter with the right foot and say the dua below. It is also said when entering any mosque.'],
      zh: ['右脚先进，念下面的祈祷词。进入其他清真寺时也念。']
    },
    readings: [
      {
        latin:
          "Bismillaah, wash sholaatu was salaamu 'alaa rosuulillaah. Allaahummaftah lii abwaaba rohmatik. A'uudzu billaahil 'azhiim, wa biwajhihil kariim, wa sulthoonihil qodiim, minasy syaithoonir rojiim",
        meaning: {
          id: 'Dengan nama Allah, semoga shalawat dan salam dicurahkan kepada Rasulullah. Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu. Aku berlindung kepada Allah Yang Mahaagung dan dengan Wajah-Nya Yang Mahamulia serta Kekuasaan-Nya Yang Mahaazali dari setan yang terkutuk.',
          en: 'In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, open for me the gates of Your mercy. I seek refuge in Allah the Almighty, in His Noble Face and His eternal authority, from the accursed devil.',
          zh: '奉真主之名，愿真主赐福安于真主的使者。主啊，求你为我打开你的慈悯之门。我求庇于伟大的真主、他尊贵的面容和他永恒的权能，免遭被驱逐的恶魔之害。'
        }
      }
    ]
  },
  {
    title: { id: 'Thawaf', en: 'Tawaf', zh: '环绕天房' },
    counter: 'thawaf',
    points: {
      id: [
        'Mulai dari Hajar Aswad: menghadap, ucapkan takbir, usap dengan tangan kanan lalu cium. Jika tidak mampu, usap dengan tangan lalu cium tangan; jika tidak mampu juga, isyarat sekali dengan tangan tanpa mencium tangan. Jangan berdesakan. Lakukan tiap putaran.',
        "7 putaran, Ka'bah di sebelah kiri.",
        "Pria: raml (jalan cepat, langkah pendek) di 3 putaran pertama dan idhthiba' (tengah selendang di bawah pundak kanan, ujungnya di pundak kiri), hanya pada thawaf pertama.",
        'Rukun Yamani: usap jika mungkin, jangan dicium. Jika tidak bisa, jangan beri isyarat.',
        'Tidak ada doa khusus selain doa di antara Rukun Yamani dan Hajar Aswad. Perbanyak dzikir, doa, atau membaca Al-Qur’an.',
        'Wajib suci. Jika wudhu batal, berwudhu lalu ulangi thawaf dari awal.',
        'Jika ada shalat wajib atau jenazah, ikut shalat (tutup kedua pundak), lalu lanjutkan dari tempat berhenti.',
        'Boleh duduk sebentar, minum, atau pindah lantai.',
        'Ragu jumlah putaran: ambil yang diyakini, yaitu yang lebih sedikit.'
      ],
      en: [
        'Start at the Black Stone: face it, say takbir, touch it with the right hand and kiss it. If unable, touch it with the hand and kiss the hand; if still unable, point once with the hand without kissing it. Do not push. Do this each round.',
        "7 rounds, with the Ka'bah on your left.",
        "Men: raml (brisk short steps) in the first 3 rounds and idtiba' (middle of the shawl under the right shoulder, its ends over the left), only in the first tawaf.",
        'Yemeni Corner: touch it if possible, do not kiss it. If you cannot, do not point to it.',
        'There is no special dua except the one between the Yemeni Corner and the Black Stone. Make much dhikr, dua, or recite the Quran.',
        'Purity is required. If wudu breaks, make wudu and restart the tawaf.',
        'If an obligatory or funeral prayer starts, join it (cover both shoulders), then continue from where you stopped.',
        'Sitting briefly, drinking or changing floors is fine.',
        'Unsure of the count: take the number you are sure of, the lower one.'
      ],
      zh: [
        '从黑石开始：面向黑石，念大赞词，用右手触摸后亲吻。若不能，用手触摸后亲吻手；仍不能，则用手示意一次，不亲吻手。不要拥挤。每圈如此。',
        '共 7 圈，天房在左侧。',
        '男子：前 3 圈小步快走，并袒露右肩（披肩中间在右肩下，两端搭在左肩），只在第一次环绕时这样做。',
        '也门角：能则触摸，不亲吻。不能则不示意。',
        '除也门角与黑石之间的祈祷外没有专门的祈祷。多念记、祈祷或诵读古兰经。',
        '必须有小净。若小净坏了，重新洗小净后从头环绕。',
        '若遇主命拜或殡礼，随众礼拜（遮盖双肩），然后从停下的地方继续。',
        '可以短暂坐下、喝水或换楼层。',
        '对圈数有疑问：取确定的、较少的数。'
      ]
    },
    readings: [TAKBIR, RUKUN_YAMANI]
  },
  {
    title: { id: 'Shalat 2 Rakaat', en: 'Two Rakaat Prayer', zh: '两拜礼拜' },
    points: {
      id: [
        'Selesai putaran ke-7, tutup pundak kanan, menuju Maqam Ibrahim dan baca ayat di bawah.',
        "Shalat dua rakaat dengan Maqam di antara dirimu dan Ka'bah. Rakaat 1: Al-Kafirun, rakaat 2: Al-Ikhlas.",
        'Hukumnya sunnah; boleh di mana saja di Masjidil Haram.',
        'Saat penuh sesak, mundur menjauh agar tidak mengganggu orang yang thawaf.'
      ],
      en: [
        'After the 7th round, cover the right shoulder, go to the Station of Ibrahim and recite the verse below.',
        "Pray two rakaat with the Station between you and the Ka'bah. Rakaat 1: Al-Kafirun, rakaat 2: Al-Ikhlas.",
        'It is sunnah; anywhere in Masjid al-Haram is fine.',
        'When crowded, move back so you do not obstruct those doing tawaf.'
      ],
      zh: [
        '第 7 圈结束后遮盖右肩，前往易卜拉欣立足处，念下面的经文。',
        '让立足处在你和天房之间，礼两拜。第一拜念不信道者章，第二拜念忠诚章。',
        '这是圣行；在禁寺任何地方礼都可以。',
        '人多拥挤时退后，不要妨碍环绕的人。'
      ]
    },
    readings: [
      {
        latin: 'Wattakhidzuu mim maqoomi ibroohiima musholla',
        meaning: {
          id: 'Dan jadikanlah sebagian maqam Ibrahim tempat shalat. [Al-Baqarah/2: 125]',
          en: 'And take the Station of Ibrahim as a place of prayer. [Al-Baqarah 2:125]',
          zh: '你们当以易卜拉欣的立足地为礼拜处。【黄牛章 2:125】'
        }
      }
    ]
  },
  {
    title: { id: 'Zamzam', en: 'Zamzam', zh: '渗渗泉' },
    points: {
      id: ['Minum air zamzam, berdoa, lalu tuangkan di atas kepala.', 'Jika memungkinkan, kembali ke Hajar Aswad dan usaplah.'],
      en: ['Drink Zamzam water, make dua, then pour some over your head.', 'If possible, return to the Black Stone and touch it.'],
      zh: ['喝渗渗泉水，祈祷，然后把水浇在头上。', '如有可能，回到黑石处触摸它。']
    }
  },
  {
    title: { id: "Sa'i", en: "Sa'i", zh: '奔走' },
    counter: 'sai',
    points: {
      id: [
        'Saat mendekati Shafa, baca ayat lalu "Abda-u bimaa bada-allaahu bih".',
        "Naik ke Shafa, menghadap Ka'bah, takbir 3 kali, lalu dzikir di bawah 3 kali; berdoa setiap selesai membacanya.",
        'Di antara dua tanda hijau, pria berlari kecil; wanita tidak.',
        'Di Marwah, naik, menghadap Ka’bah, dan ucapkan seperti di Shafa.',
        'Shafa ke Marwah dihitung 1, Marwah ke Shafa dihitung 1; putaran ke-7 berakhir di Marwah.',
        'Tidak ada dzikir khusus untuk sa’i; perbanyak dzikir, doa dan membaca Al-Qur’an.'
      ],
      en: [
        'Approaching Safa, recite the verse, then "Abda-u bimaa bada-allaahu bih".',
        "Climb Safa, face the Ka'bah, say takbir 3 times, then the dhikr below 3 times, making dua after each.",
        'Between the two green markers men jog; women do not.',
        'At Marwah, climb it, face the Ka’bah and say the same as at Safa.',
        'Safa to Marwah counts 1, Marwah to Safa counts 1; the 7th ends at Marwah.',
        'There is no special dhikr for sa’i; make much dhikr, dua and recite the Quran.'
      ],
      zh: [
        '接近赛法时念经文，然后念“我从真主开始的地方开始”。',
        '登上赛法，面向天房，念三次大赞词，再念下面的记念三遍，每遍后祈祷。',
        '在两个绿色标志之间，男子小跑，女子不跑。',
        '到麦尔维后登上去，面向天房，念与赛法相同的内容。',
        '赛法到麦尔维算 1 次，麦尔维到赛法算 1 次；第 7 次在麦尔维结束。',
        '奔走没有专门的记念；多念记、祈祷和诵读古兰经。'
      ]
    },
    readings: [SHAFA_VERSE, ABDA_U, SHAFA_DHIKR]
  },
  {
    title: { id: 'Tahallul', en: 'Tahallul', zh: '开戒' },
    points: {
      id: [
        'Pria mencukur gundul atau memendekkan rambut. Untuk umrah, gundul lebih utama, kecuali waktu haji sudah dekat.',
        'Memendekkan harus merata di seluruh atau sebagian besar rambut, tidak cukup beberapa helai.',
        'Wanita mengumpulkan rambutnya dan memotong kira-kira seujung jari.',
        'Setelah ini umrah selesai. Tidak dituntunkan mengulang-ulang umrah setibanya di Makkah.'
      ],
      en: [
        'Men shave the head or shorten the hair. For umrah, shaving is better, unless hajj is near.',
        'Shortening must cover all or most of the hair, not just a few strands.',
        'Women gather their hair and cut about a fingertip’s length.',
        'The umrah is then complete. Repeating umrah after arriving in Makkah is not from the Sunnah.'
      ],
      zh: [
        '男子剃光头或剪短头发。副朝时剃光更优，除非朝觐临近。',
        '剪短须覆盖全部或大部分头发，不能只剪几根。',
        '女子把头发拢在一起，剪去约一个指尖长。',
        '至此副朝完成。到麦加后反复做副朝不是圣行。'
      ]
    }
  }
]

// Round counters: readings shown under the counter
export const COUNTERS = {
  thawaf: { rounds: 7, readings: [TAKBIR, RUKUN_YAMANI] },
  sai: { rounds: 7, readings: [SHAFA_DHIKR] }
}
