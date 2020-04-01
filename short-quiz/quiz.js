var testName = replaceAll(getParameterByName('test'),'-','_');
var testTitle = document.getElementById('test-title');
var imgSoal = document.getElementById('imgSoal');

const TEST_ID = `sq_${testName}`;
var etiket_testRef = db.collection(TEST_ID);
var couponRef = db.collection("coupons_"+TEST_ID);
var answerRef = db.collection("answers_"+TEST_ID);

var diare_patofis_questions = [
    "1. Sebutkan dan jelaskan beberapa klasifikasi diare",
    "2.	Jelaskan mekanisme dari diare osmotik karena makanan misalnya PEG",
    "3.	Jelaskan mekanisme dari diare sekretorik yang disebabkan Vibrio Cholera",
    "4.	Jelaskan mekanisme dari diare eksudatif/inflamatorik",
    "5.	Mengapa stress bisa menyebakan diare?"
];

var diare_farmako_questions = [
    "1.	Bolehkah loperamide diberikan pada pasien anak-anak di bawah 2 tahun? Jelaskan",
    "2.	Jelaskan mekanisme loeperamid",
    "3.	Sebutkan 3 obat golongan opiat untuk terapi diare",
    "4.	Mengapa dehidrasi bisa menyebabkan hipotensi pleural?",
    "5. Sebutkan tanda-tanda dehidrasi sedang pada anak"
]

var infeksi_patofis_questions = [
    "1.	Sebutkan 3 bakteri pada saluran pencernaan",
    "2.	Sebutkan 5 contoh penyakit yang disebabkan oleh virus",
    "3.	Jelaskan secara singkat mekanisme terjadinya nyeri",
    "4.	Sebutkan 3 mediator inflamasi",
    "5.	Jelaskan secara singkat mekanisme terjadinya demam",
    `
    <img src="data:image/png;base64,${img_infeksi_patofis_6}" /><br/>
    Sebutkan bagian-bagian (1-4) dari steruktur sel syaraf`
];

var infeksi_farmako_questions = [
    "1.	Sebutkan 3 contoh obat golongan opioid kuat",
    "2.	Sebutkan 3 contoh obat golongan NSAID yang tidak selektif COX 2",
    "3.	Sebutkan 3 contoh obat golongan NSAID yang selektif COX 2",
    "4. Jelaskan secara umum mekanisme aksi obat golongan opioid sebagai analgetik",
    "5. Jelaskan secara umum mekanisme aksi obat golongan NSAID"
]

var kasus_konversi_questions = [
    "1. Px 34 th mendapatkan Infus RL volume 500 ml. Mendapat terapi sefadroksil dosis 1g/hari dalam dosis terbagi setiap 12 jam. Dokter menghendaki infus intermitn tiap 12 jam selama 3 jam. Berapa kecepatan tetes infus permenit nya?",
    "2. Cairan yang tersedian 500 cc NaCl  0,9%. Diberikan dengan titrasi infus 20 tetes/menit. Berapa jam diburuhkan sampai cairan tersebut habis?",
    `
    <ul>
        <li>Ciprofloksasil IV</li>
        <li>Sediaan 10 mg/mL</li>
        <li>Volume sediaan 40 mL</li>
    </ul>
    <br />
    Anak 17 tahun mendapatkan ciprofloksasin 2 x sehari 400 mg. Berapa kecepatan tetes macro, jika dikehendaki infus selama 50 menit ??
    `
]

switch(testName){
    case 'diare_farmako' : questions = diare_farmako_questions; break;
    case 'diare_patofis' : questions = diare_patofis_questions; break;
    case 'infeksi_farmako' : questions = infeksi_farmako_questions; break;
    case 'infeksi_patofis' : questions = infeksi_patofis_questions; break;
    case 'kasus_konversi' : questions = kasus_konversi_questions; break;
    default: alert('PASTIKAN URL BENAR'); break;
}

switch(testName){
    case 'diare_farmako' : testTitle.innerHTML = "Test Diare Farmakoterapi"; break;
    case 'diare_patofis' : testTitle.innerHTML = "Test Diare Patofisiologi"; break;
    case 'infeksi_farmako' : testTitle.innerHTML = "Test Infeksi Farmakoterapi"; break;
    case 'infeksi_patofis' : testTitle.innerHTML = "Test Infeksi Patofisiologi"; break;
    case 'kasus_konversi' : testTitle.innerHTML = "Test Kasus Konversi" ; break;
    default: alert('PASTIKAN URL BENAR'); break;
}

var isRunning = false;
const tempo = 2*60 + 1;
var sisaWaktu = tempo;
var currentQuestion = 0;

var testProcess = null;
var stopwatch = null;