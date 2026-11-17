const input = document.querySelector('#message');
const result = document.querySelector('#result');
const count = document.querySelector('#char-count');
let language = 'ar';
let lastReport = null;

const examples = {
  urgent: {
    ar: 'تم إيقاف حسابك البنكي مؤقتًا. أكّد بياناتك فورًا خلال ساعة لتجنب إغلاق الحساب: http://bank-verification.example.com/login',
    en: 'Your bank account is suspended. Verify your password and card details now to avoid closure: http://bank-verification.example.com/login'
  },
  link: {
    ar: 'مبروك! كسبت جائزة، استلمها الآن من الرابط: https://bit.ly/claim-prize',
    en: 'Congratulations! You won a prize. Claim it now: https://bit.ly/claim-prize'
  },
  safe: {
    ar: 'مساء الخير، اجتماع فريق المشروع بكرة الساعة ١٠ صباحًا في المكتب. أشوفكم على خير.',
    en: 'Hi, the project team meeting is tomorrow at 10 AM in the office. See you there.'
  }
};

const text = {
  ar: {
    local: 'فحص محلي للرسالة', eyebrow: 'خليك واعي قبل ما تضغط', hero: 'وصلك شيء مريب؟<br><span>افحصه الأول.</span>', intro: 'الصق نص الرسالة أو الرابط، ودرعك هيوضح لك العلامات اللي تستحق الانتباه — من غير ما يفتح الرابط.',
    checker: 'حط الرسالة هنا', hint: 'انسخ النص أو الرابط كما وصلك', label: 'نص الرسالة أو الرابط', placeholder: 'مثال: تم إيقاف حسابك مؤقتًا. اضغط هنا لتأكيد بياناتك...', clear: 'مسح', check: 'افحص الآن', privacy: 'الفحص بيتم على جهازك. النص مش بيتبعت لأي مكان.',
    examples: 'مش عارف تبدأ؟', examplesTitle: 'جرّب مثال', examplesHint: 'اضغط على مثال عشان تجربه', urgent: 'رسالة مستعجلة', urgentSub: 'تهديد بإيقاف الحساب', link: 'رابط مشبوه', linkSub: 'عنوان مختصر أو غير مألوف', safe: 'رسالة عادية', safeSub: 'للمقارنة والتجربة',
    disclaimer: '<strong>خد بالك:</strong> الفحص المبدئي مش ضمان إن الرسالة آمنة. لو الرسالة بتطلب كلمة مرور أو كود تحقق أو بيانات بنكية، ما تبعتهاش. ادخل على الموقع الرسمي بنفسك أو اتصل بالجهة من رقم موثوق.', footer: 'درعك — خطوة صغيرة تحمي بياناتك', version: 'نسخة تجريبية · الفحص مبدئي',
    empty: 'اكتب أو الصق الرسالة أو الرابط الأول.',
    short: 'الرابط مختصر؛ الوجهة الحقيقية مش واضحة قبل فتحه.', url: 'الرسالة فيها رابط. وجود رابط لوحده مش دليل احتيال، لكن راجع اسم النطاق بعناية.', http: 'الرابط لا يستخدم اتصال HTTPS المشفر. ده مش دليل قاطع على الاحتيال، لكنه سبب إضافي للحذر.', ip: 'الرابط بيستخدم عنوان IP مباشر بدل اسم موقع مألوف.', puny: 'اسم الموقع فيه صيغة نطاق دولية قد تُستخدم لتقليد اسم موقع بحروف متشابهة.', credentials: 'عنوان الرابط يحتوي على بيانات قبل اسم الموقع (مثل user@host)، ودي حيلة ممكن تخفي الوجهة الحقيقية.', manySubdomains: 'اسم الموقع فيه نطاقات فرعية كثيرة، وده ممكن يخلي عنوانًا مضللًا يبدو مألوفًا.', keywordHost: 'اسم النطاق فيه كلمات مثل تسجيل الدخول أو التحقق؛ تأكد من الجهة عبر تطبيقها أو موقعها الرسمي.',
    urgency: 'فيها استعجال أو تهديد بعقوبة لدفعك للتصرف بسرعة.', sensitive: 'بتطلب بيانات حساسة أو رمز تحقق. ما تشاركش المعلومات دي في رسالة أو رابط.', prize: 'فيها جائزة أو مكافأة غير متوقعة، وده أسلوب شائع لجذبك للضغط على رابط.', payment: 'بتطلب دفع مبلغ أو رسوم بشكل مفاجئ؛ راجع الطلب من التطبيق أو الموقع الرسمي.',
    high: 'مؤشرات خطر واضحة', highSub: 'اتعامل مع الرسالة بحذر، وما تضغطش على أي رابط فيها.', medium: 'خد بالك قبل ما تتصرف', mediumSub: 'لقينا علامات تستاهل التحقق من مصدر الرسالة.', low: 'مفيش مؤشرات قوية واضحة', lowSub: 'ده فحص مبدئي فقط، ومش تأكيد إن الرسالة آمنة.', unknown: 'محتاجين تفاصيل أكتر', unknownSub: 'النص قصير أو مفيهوش علامات كفاية للحكم.', findings: 'إيه اللي لفت انتباهنا؟', noFindings: 'ما لقيناش في النص علامات الاحتيال الشائعة اللي بيفحصها النموذج.', linkCaution: 'ما ظهرش نمط خطر واضح في النص، لكن افحص اسم الموقع من مصدر موثوق قبل ما تفتحه.', score: 'مؤشر العلامات', caution: 'النتيجة مبنية على فحص محلي بسيط. ممكن رسالة خطيرة ما تظهرش فيها العلامات دي، وممكن رسالة سليمة يظهر فيها بعضها.', report: 'تنزيل بلاغ للمراجعة', reportDone: 'تم تنزيل البلاغ. لم يُرسل لأي جهة.',
    downloadable: 'بلاغ مبدئي من درعك', generated: 'وقت إنشاء البلاغ', domains: 'النطاقات التي ظهرت في الرسالة', risk: 'مؤشر العلامات', reasons: 'الأسباب التي ظهرت', notice: 'هذا الملف لم يُرسل تلقائيًا لأي جهة. راجع قناة الإبلاغ الرسمية المناسبة وأرفقه بنفسك. لم يتم تضمين نص الرسالة حفاظًا على الخصوصية.'
  },
  en: {
    local: 'On-device message check', eyebrow: 'Pause before you tap', hero: 'Got something suspicious?<br><span>Check it first.</span>', intro: 'Paste a message or link. Derak shows warning signs to review without opening the link.',
    checker: 'Paste a message here', hint: 'Copy the message or link as you received it', label: 'Message or link text', placeholder: 'Example: Your account is suspended. Click here to verify your details...', clear: 'Clear', check: 'Check now', privacy: 'The check runs on this device. Your text is not sent anywhere.',
    examples: 'Need a starting point?', examplesTitle: 'Try an example', examplesHint: 'Select an example to check it', urgent: 'Urgent message', urgentSub: 'Threat to suspend an account', link: 'Suspicious link', linkSub: 'Shortened or unfamiliar address', safe: 'Ordinary message', safeSub: 'For comparison',
    disclaimer: '<strong>Keep in mind:</strong> This preliminary check cannot guarantee a message is safe. Never share a password, verification code, or bank details in a message or link. Visit the official site yourself or call a trusted number.', footer: 'Derak — a small step to protect your data', version: 'Demo version · preliminary check',
    empty: 'Paste or type a message or link first.',
    short: 'This is a shortened link, so its destination is not clear before opening it.', url: 'The message contains a link. A link alone does not prove fraud, but check the domain carefully.', http: 'This link does not use HTTPS encryption. That alone does not prove fraud, but it is a reason for extra caution.', ip: 'The link uses a raw IP address instead of a familiar domain name.', puny: 'The domain uses an internationalized format that can be used to imitate names with look-alike characters.', credentials: 'The link includes text before the actual host (such as user@host), which can obscure its destination.', manySubdomains: 'The domain has several subdomains, which can make a misleading address look familiar.', keywordHost: 'The domain includes words such as login or verify. Confirm the sender through its official app or website.',
    urgency: 'It uses urgency or a threat to pressure you into acting quickly.', sensitive: 'It asks for sensitive information or a verification code. Do not share these through a message or link.', prize: 'It offers an unexpected prize or reward, a common way to lure people into clicking.', payment: 'It requests an unexpected payment or fee. Check through the official app or website.',
    high: 'Strong warning signs', highSub: 'Treat this message carefully and do not click its links.', medium: 'Pause and verify first', mediumSub: 'We found signs worth checking with the sender.', low: 'No strong warning signs found', lowSub: 'This is a preliminary check, not proof that the message is safe.', unknown: 'Not enough information', unknownSub: 'The text is too short or lacks signs we can assess.', findings: 'What caught our attention', noFindings: 'We did not find the common warning signs this demo checks for.', linkCaution: 'No clear pattern was found, but verify the domain through a trusted source before opening it.', score: 'Warning sign score', caution: 'This result comes from a simple on-device check. A harmful message may not show these signs, and a legitimate one may show some.', report: 'Download a report', reportDone: 'Report downloaded. It was not sent to anyone.',
    downloadable: 'Preliminary report from Derak', generated: 'Report created', domains: 'Domains found in the message', risk: 'Warning sign score', reasons: 'Findings', notice: 'This file was not sent to any organization. Review the relevant official reporting channel and attach it yourself. The message text is not included to protect privacy.'
  }
};

const patterns = [
  { re: /\b(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|rb\.gy|shorturl\.at|ow\.ly|buff\.ly)\b/i, key: 'short', points: 3 },
  { re: /(?:عاجل|فورًا|حالًا|خلال\s*(?:ساعة|دقايق|دقائق)|سيتم\s*(?:إيقاف|إغلاق|حظر)|أوقفنا|موقوف|آخر\s*فرصة|تحذير|urgent|immediately|suspended|account\s+locked|verify\s+now|act\s+now|within\s+\d+\s*(?:minutes|hours))/i, key: 'urgency', points: 2 },
  { re: /(?:كلمة\s*المرور|رمز\s*التحقق|كود\s*التحقق|الرقم\s*السري|بيانات(?:ك)?\s*(?:البنكية|الشخصية)|رقم\s*البطاقة|otp|password|verification\s+code|bank\s+details|credit\s+card|social\s+security)/i, key: 'sensitive', points: 3 },
  { re: /(?:كسبت|مبروك|جائزة|اربح|هدية|تحويل\s*مالي|استلم\s*مكافأتك|prize|winner|claim\s+reward|free\s+gift|you\s+won)/i, key: 'prize', points: 2 },
  { re: /(?:ادفع|رسوم\s*التوصيل|طردك|شحنة|فاتورة\s*غير\s*مدفوعة|مستحقات|payment\s+failed|delivery\s+fee|unpaid\s+invoice|pay\s+now)/i, key: 'payment', points: 2 }
];

function tr(key) { return text[language][key]; }
function extractUrls(message) {
  const found = message.match(/(?:https?:\/\/|www\.)[^\s<>"']+|(?<![@\w])(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<>"']*)?/gi) || [];
  return [...new Set(found.map(value => value.replace(/[),.!؟،;]+$/g, '')))];
}
function inspectUrl(raw) {
  let normalized = raw;
  if (/^www\./i.test(normalized) || !/^[a-z][a-z\d+.-]*:\/\//i.test(normalized)) normalized = `https://${normalized}`;
  let url;
  try { url = new URL(normalized); } catch { return null; }
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const findings = [];
  let points = 0;
  if (/^(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|rb\.gy|shorturl\.at|ow\.ly|buff\.ly)$/i.test(host)) { findings.push('short'); points += 3; }
  if (url.protocol !== 'https:') { findings.push('http'); points += 1; }
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host) || /^\[[\da-f:]+\]$/i.test(host)) { findings.push('ip'); points += 3; }
  if (url.username || url.password) { findings.push('credentials'); points += 3; }
  if (host.includes('xn--')) { findings.push('puny'); points += 2; }
  const labels = host.split('.');
  if (labels.length >= 5) { findings.push('manySubdomains'); points += 2; }
  if (/(?:login|verify|secure|account|update|support|confirm)/i.test(labels.slice(0, -1).join('.'))) { findings.push('keywordHost'); points += 1; }
  return { host, protocol: url.protocol, findings, points };
}

function inspectMessage(message) {
  let score = 0;
  const findings = [];
  for (const pattern of patterns) if (pattern.re.test(message)) { findings.push(pattern.key); score += pattern.points; }
  const urls = extractUrls(message);
  const urlResults = urls.map(inspectUrl).filter(Boolean);
  for (const item of urlResults) for (const key of item.findings) { if (!findings.includes(key)) findings.push(key); }
  for (const item of urlResults) score += item.points;
  if (urls.length && !findings.includes('url')) findings.push('url');
  return { score: Math.min(score, 10), findings, urls: urlResults };
}

function showResult(message) {
  const analysis = inspectMessage(message);
  const { score, findings, urls } = analysis;
  const level = score >= 5 ? 'high' : score >= 2 ? 'medium' : message.trim().length >= 12 ? 'low' : 'unknown';
  const title = tr(level);
  const subtitle = tr(`${level}Sub`);
  const icon = level === 'low' ? '✓' : level === 'unknown' ? '?' : '!';
  const findingsHtml = findings.length
    ? `<p class="findings-title">${tr('findings')}</p><ul class="findings">${findings.map(key => `<li>${tr(key)}</li>`).join('')}</ul>`
    : `<p class="no-findings">${urls.length ? tr('linkCaution') : tr('noFindings')}</p>`;
  const domains = urls.map(item => item.host);
  lastReport = { createdAt: new Date().toISOString(), score, level, findings: findings.map(key => tr(key)), domains };
  result.className = `result card risk-${level}`;
  result.innerHTML = `<div class="result-head"><span class="result-badge" aria-hidden="true">${icon}</span><div><h2>${title}</h2><p class="result-subtitle">${subtitle}</p></div></div><div class="score-row"><div class="score-track" role="meter" aria-label="${tr('score')}" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${score}"><div class="score-fill" style="--score:${score * 10}%"></div></div><span class="score-label">${tr('score')}: ${score} / 10</span></div><div class="url-results">${urls.map((item, index) => `<div class="url-row"><span class="url-status ${item.findings.length ? 'url-warn' : 'url-ok'}">${item.findings.length ? '!' : '✓'}</span><div><strong>${language === 'ar' ? 'الرابط' : 'Link'} ${index + 1}: <bdi>${item.host}</bdi></strong><small>${item.findings.length ? item.findings.map(key => tr(key)).join(' ') : (language === 'ar' ? 'لم تظهر علامة واضحة في العنوان، لكن ده لا يثبت أمانه.' : 'No obvious address signal found, but this does not prove it is safe.')}</small></div></div>`).join('')}</div>${findingsHtml}<p class="result-caution">${tr('caution')}</p><div class="report-area"><button id="report-button" class="button button-report" type="button">⇩ ${tr('report')}</button><span id="report-status" role="status"></span></div>`;
  result.hidden = false;
  result.querySelector('#report-button').addEventListener('click', downloadReport);
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function downloadReport() {
  const report = { title: tr('downloadable'), [tr('generated')]: lastReport.createdAt, [tr('domains')]: lastReport.domains, [tr('risk')]: `${lastReport.score}/10 (${tr(lastReport.level)})`, [tr('reasons')]: lastReport.findings, notice: tr('notice') };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'derak-report.json';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  result.querySelector('#report-status').textContent = tr('reportDone');
}

function setLanguage(next) {
  language = next;
  document.documentElement.lang = next;
  document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  const ids = { 'local-label':'local', eyebrow:'eyebrow', 'hero-title':'hero', intro:'intro', 'checker-title':'checker', 'checker-hint':'hint', 'input-label':'label', 'clear-button':'clear', 'check-button':'check', 'examples-eyebrow':'examples', 'examples-title':'examplesTitle', 'examples-hint':'examplesHint', 'example-title-urgent':'urgent', 'example-sub-urgent':'urgentSub', 'example-title-link':'link', 'example-sub-link':'linkSub', 'example-title-safe':'safe', 'example-sub-safe':'safeSub', disclaimer:'disclaimer', 'footer-brand':'footer', 'footer-note':'version' };
  for (const [id, key] of Object.entries(ids)) document.getElementById(id).innerHTML = tr(key);
  document.getElementById('footer-owner').textContent = 'Website owned by Mohamed El-Saiedy';
  document.getElementById('message').placeholder = tr('placeholder');
  document.getElementById('privacy-note').innerHTML = `<span aria-hidden="true">◇</span> ${tr('privacy')}`;
  document.getElementById('language-button').textContent = next === 'ar' ? 'English' : 'العربية';
  document.getElementById('language-button').setAttribute('aria-label', next === 'ar' ? 'Switch language to English' : 'غيّر اللغة للعربية');
  document.querySelector('.brand').setAttribute('aria-label', next === 'ar' ? 'درعك - الصفحة الرئيسية' : 'Derak - home');
  document.getElementById('char-count').textContent = `${input.value.length} / 5000`;
  if (!result.hidden) showResult(input.value);
}

document.getElementById('language-button').addEventListener('click', () => setLanguage(language === 'ar' ? 'en' : 'ar'));
input.addEventListener('input', () => { count.textContent = `${input.value.length} / 5000`; input.setCustomValidity(''); });
document.getElementById('check-button').addEventListener('click', () => {
  if (!input.value.trim()) { input.focus(); input.setCustomValidity(tr('empty')); input.reportValidity(); return; }
  input.setCustomValidity('');
  showResult(input.value);
});
document.getElementById('clear-button').addEventListener('click', () => { input.value = ''; count.textContent = '0 / 5000'; result.hidden = true; input.focus(); });
document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
  input.value = examples[button.dataset.example][language];
  input.dispatchEvent(new Event('input'));
  input.focus();
  showResult(input.value);
}));

setLanguage('ar');
