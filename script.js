const form = document.querySelector('form');
const result = document.getElementById('result');
const submitButton = form.querySelector('.submit-button');
const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycbzollMSa2VHK0_iZKwJsk0lznyQiruawbYPy9KZSFjjxN4eu_ge6NC59641p2p9TAqRTw/exec';

const correctAnswers = {
  pg1: 'A', pg2: 'B', pg3: 'C', pg4: 'A', pg5: 'B',
  pg6: 'C', pg7: 'C', pg8: 'B', pg9: 'A', pg10: 'D',
  pg11: 'B', pg12: 'C', pg13: 'C', pg14: 'A', pg15: 'B',
  bs1: 'B', bs2: 'B', bs3: 'S', bs4: 'B', bs5: 'S',
  bs6: 'B', bs7: 'B', bs8: 'B', bs9: 'S', bs10: 'B',
  jodoh1: 'C', jodoh2: 'E', jodoh3: 'F', jodoh4: 'H', jodoh5: 'I',
  jodoh6: 'B', jodoh7: 'J', jodoh8: 'A', jodoh9: 'G', jodoh10: 'D'
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  result.hidden = false;
  result.textContent = 'Menghitung nilai dan mengirim jawaban...';

  let score = 0;
  let answered = 0;
  const answers = {};

  for (const [name, correctAnswer] of Object.entries(correctAnswers)) {
    const response = form.elements[name].value;
    answers[name] = response;
    if (response) answered++;
    if (response === correctAnswer) score++;
  }

  const total = Object.keys(correctAnswers).length;
  const percentage = Math.round((score / total) * 100);
  const payload = {
    waktuKirim: new Date().toISOString(),
    nama: form.elements.nama.value,
    kelas: form.elements.kelas.value,
    tanggalLahir: form.elements['tanggal-lahir'].value,
    mataPelajaran: form.elements['mata-pelajaran'].value,
    bab: form.elements.bab.value,
    jawaban: answers,
    nilai: percentage,
    jawabanBenar: score,
    totalSoal: total,
    jawabanTerisi: answered
  };

  try {
    await fetch(spreadsheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    result.textContent = `Tes selesai! Nilai: ${percentage} dari 100. Jawaban benar: ${score} dari ${total}. Jawaban terisi: ${answered} dari ${total}. Permintaan penyimpanan telah dikirim ke spreadsheet.`;
    form.querySelectorAll('input, select, button').forEach((control) => {
      control.disabled = true;
    });
  } catch (error) {
    result.textContent = `Nilai: ${percentage} dari 100. Pengiriman ke spreadsheet gagal. Periksa koneksi internet lalu coba kumpulkan kembali.`;
    submitButton.disabled = false;
  }
});
