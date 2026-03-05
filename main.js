    // Firebase Config
    const firebaseConfig = {
      apiKey: "AIzaSyB7LzE4WpLWbkIM7w9jN3TYR99npzH_q5I",
      authDomain: "zivs-f1b9f.firebaseapp.com",
      projectId: "zivs-f1b9f",
      storageBucket: "zivs-f1b9f.firebasestorage.app",
      messagingSenderId: "194868221714",
      appId: "1:194868221714:web:80062d4d6103206b8985cb"
    };
    
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    window.auth = auth;
    window.db = db;

    auth.onAuthStateChanged((user) => {
      const membersArea = document.getElementById('membersArea');
      const authBadgeText = document.getElementById('authBadgeText');
      const authBadge = document.getElementById('authBadge');
      const memberName = document.getElementById('memberName');
      if (user) {
        membersArea?.classList.add('visible');
        authBadgeText.textContent = 'Members Area';
        authBadge.style.background = 'var(--navy)';
        authBadge.style.color = 'var(--gold)';
        db.collection('users').doc(user.uid).get().then((doc) => {
          if (doc.exists) memberName.textContent = doc.data().fullName || user.email.split('@')[0];
          else memberName.textContent = user.email.split('@')[0];
        }).catch(() => memberName.textContent = user.email.split('@')[0]);
      } else {
        membersArea?.classList.remove('visible');
        authBadgeText.textContent = 'Member Login';
        authBadge.style.background = 'var(--gold)';
        authBadge.style.color = 'var(--navy)';
      }
    });

    window.switchTab = function(tabName) {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
      document.querySelectorAll('.auth-form').forEach(f => f.classList.toggle('active', f.id === tabName + 'Form'));
    };

    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    const authModal = document.getElementById('authModal');
    const authBadge = document.getElementById('authBadge');
    const closeAuth = document.getElementById('closeAuth');

    authBadge.addEventListener('click', () => {
      if (auth.currentUser) document.getElementById('membersArea').scrollIntoView({ behavior: 'smooth' });
      else authModal.classList.add('active');
    });

    document.getElementById('memberNavLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (auth.currentUser) document.getElementById('membersArea').scrollIntoView({ behavior: 'smooth' });
      else authModal.classList.add('active');
    });

    closeAuth.addEventListener('click', () => {
      authModal.classList.remove('active');
      document.getElementById('loginFormElement').reset();
      document.getElementById('registerFormElement').reset();
      document.getElementById('loginError').style.display = 'none';
      document.getElementById('registerError').style.display = 'none';
      document.getElementById('registerSuccess').style.display = 'none';
    });

    window.addEventListener('click', (e) => { if (e.target === authModal) authModal.classList.remove('active'); });

    document.getElementById('loginFormElement').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errorDiv = document.getElementById('loginError');
      errorDiv.style.display = 'none';
      auth.signInWithEmailAndPassword(email, password)
        .then(() => { authModal.classList.remove('active'); alert('Login successful!'); })
        .catch((error) => { errorDiv.textContent = error.message; errorDiv.style.display = 'block'; });
    });

    document.getElementById('registerFormElement').addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('regFullName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      const confirm = document.getElementById('regConfirmPassword').value;
      const membershipType = document.getElementById('regMembershipType').value;
      const errorDiv = document.getElementById('registerError');
      const successDiv = document.getElementById('registerSuccess');
      errorDiv.style.display = 'none';
      if (password !== confirm) { errorDiv.textContent = 'Passwords do not match'; errorDiv.style.display = 'block'; return; }
      if (!membershipType) { errorDiv.textContent = 'Select membership type'; errorDiv.style.display = 'block'; return; }
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          return db.collection('users').doc(userCredential.user.uid).set({ fullName, email, membershipType, createdAt: firebase.firestore.FieldValue.serverTimestamp(), uid: userCredential.user.uid })
            .then(() => { successDiv.textContent = 'Registration successful! Please login.'; successDiv.style.display = 'block'; document.getElementById('registerFormElement').reset(); setTimeout(() => switchTab('login'), 2000); });
        })
        .catch((error) => { errorDiv.textContent = error.message; errorDiv.style.display = 'block'; });
    });

    document.getElementById('logoutBtn').addEventListener('click', () => auth.signOut().then(() => alert('Logged out.')));

    window.downloadPDF = function(filename, filepath) {
      if (!auth.currentUser) { alert('Please login to access member content.'); authModal.classList.add('active'); return; }
      const link = document.createElement('a'); link.href = filepath || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; link.download = filename; link.target = '_blank'; link.rel = 'noopener noreferrer'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    window.downloadPublicPDF = function(filename, filepath) {
      const link = document.createElement('a'); link.href = filepath || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; link.download = filename; link.target = '_blank'; link.rel = 'noopener noreferrer'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger?.addEventListener('click', () => navLinks.classList.toggle('active'));

    document.querySelectorAll('.smooth').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault(); const id = this.getAttribute('href'); if (id?.startsWith('#')) document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' }); if (window.innerWidth < 860) navLinks.classList.remove('active');
      });
    });

    document.getElementById('floatApplyBtn')?.addEventListener('click', () => document.getElementById('membership').scrollIntoView({ behavior: 'smooth' }));
    document.getElementById('heroApplyBtn')?.addEventListener('click', () => document.getElementById('membership').scrollIntoView({ behavior: 'smooth' }));
    document.getElementById('corporateApplyBtn')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('corpModal').classList.add('active'); });
    document.getElementById('individualApplyBtn')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('individualModal').classList.add('active'); });

    document.getElementById('closeCorpModal')?.addEventListener('click', () => document.getElementById('corpModal').classList.remove('active'));
    document.getElementById('closeIndividualModal')?.addEventListener('click', () => document.getElementById('individualModal').classList.remove('active'));

    document.getElementById('downloadCorporateFormPdfBtn')?.addEventListener('click', () => downloadPublicPDF('ZIVS_Corporate_Application.pdf', '/pdfs/corporate-application-form.pdf'));
    document.getElementById('downloadIndividualFormPdfBtn')?.addEventListener('click', () => downloadPublicPDF('ZIVS_Individual_Application.pdf', '/pdfs/individual-application-form.pdf'));
    document.getElementById('downloadMainPdfBtn')?.addEventListener('click', () => downloadPublicPDF('ZIVS_Application_Forms.pdf', '/pdfs/application-forms.pdf'));
    document.getElementById('downloadRenewalPdfBtn')?.addEventListener('click', () => downloadPublicPDF('ZIVS_Renewal_Form.pdf', '/pdfs/renewal-form.pdf'));

    // Multi-step
    let currentStep = 1;
    function showStep(step) {
      document.querySelectorAll('.step-form').forEach(el => el.classList.add('hidden'));
      const stepEl = document.getElementById(`step${step}`); if (stepEl) stepEl.classList.remove('hidden');
      document.querySelectorAll('.step').forEach((el,i) => el.classList.remove('active'));
      const steps = document.querySelectorAll('.step'); if (steps[step-1]) steps[step-1].classList.add('active');
      currentStep = step;
    }
    document.querySelectorAll('.nextStep').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); let n = btn.dataset.next; if (n) showStep(parseInt(n)); }));
    document.querySelectorAll('.prevStep').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); let p = btn.dataset.prev; if (p) showStep(parseInt(p)); }));

    document.getElementById('addBranchBtn')?.addEventListener('click', () => {
      let div = document.createElement('div'); div.innerHTML = `<div style="border:1px solid #ddd; padding:16px; margin:12px 0; border-radius:8px;"><input placeholder="Trading name" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Physical address" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Postal address" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Phone" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Email" style="width:100%; padding:8px;"></div>`;
      document.getElementById('branchContainer').appendChild(div);
    });
    document.getElementById('addPrincipalBtn')?.addEventListener('click', () => {
      let d = document.createElement('div'); d.innerHTML = `<div style="border:1px solid #ddd; padding:16px; margin:12px 0; border-radius:8px;"><input placeholder="Member Name" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Membership Category" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Job Title" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Status" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Phone" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Email" style="width:100%; padding:8px;"></div>`;
      document.getElementById('principalContainer').appendChild(d);
    });
    document.getElementById('addEmployeeBtn')?.addEventListener('click', () => {
      let d = document.createElement('div'); d.innerHTML = `<div style="border:1px solid #ddd; padding:16px; margin:12px 0; border-radius:8px;"><input placeholder="Employee Name" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Category" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Job Title" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Status" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Phone" style="width:100%; margin-bottom:8px; padding:8px;"><input placeholder="Email" style="width:100%; padding:8px;"></div>`;
      document.getElementById('employeeContainer').appendChild(d);
    });

    document.getElementById('saveDraftBtn')?.addEventListener('click', (e) => { e.preventDefault(); localStorage.setItem('zivs_corp_draft', JSON.stringify({ regName: document.getElementById('regName')?.value || '' })); document.getElementById('draftMsg').innerText = '✓ Draft saved.'; });
    document.getElementById('submitCorporateForm')?.addEventListener('click', (e) => { e.preventDefault(); let name = document.getElementById('declName')?.value || 'Applicant'; window.location.href = `mailto:president@zivs.org.zm?cc=finance@zivs.org.zm&subject=Corporate%20Membership%20Application&body=${encodeURIComponent(`Corporate application from ${name}. Submitted via ZIVS.`)}`; alert('✓ Application opened in mail client.'); document.getElementById('corpModal').classList.remove('active'); });
    document.getElementById('submitIndividualForm')?.addEventListener('click', (e) => { e.preventDefault(); let name = document.getElementById('individualName')?.value || 'Applicant'; window.location.href = `mailto:president@zivs.org.zm?cc=finance@zivs.org.zm&subject=Individual%20Membership%20Application&body=${encodeURIComponent(`Individual application from ${name}. Submitted via ZIVS.`)}`; alert('✓ Application opened.'); document.getElementById('individualModal').classList.remove('active'); });
    document.getElementById('saveIndividualDraft')?.addEventListener('click', (e) => { e.preventDefault(); localStorage.setItem('zivs_individual_draft', JSON.stringify({ name: document.getElementById('individualName')?.value || '' })); document.getElementById('individualDraftMsg').innerText = '✓ Draft saved.'; });

    document.getElementById('contactForm')?.addEventListener('submit', (e) => { e.preventDefault(); let msg = document.getElementById('contactMsg').value; window.location.href = `mailto:president@zivs.org.zm?cc=finance@zivs.org.zm&subject=Contact%20ZIVS&body=${encodeURIComponent(msg)}`; });

    const faqData = [
      {q:"How do I register as a valuation surveyor?", a:"Submit qualifications, experience log, and fee."},
      {q:"How long does registration take?", a:"Up to 21 working days."},
      {q:"What documents are required?", a:"Degree certificates, NRC, TPIN, internship proof."},
      {q:"How do I renew my membership?", a:"Annual renewal online before 31st March."},
      {q:"How are complaints handled?", a:"Ethics committee reviews within 30 days."},
      {q:"Can foreign firms apply?", a:"Yes, through a local partner."},
      {q:"What fees are required?", a:"See fee schedule on downloads page."},
      {q:"Where are ZIVS offices?", a:"Provident House, Cairo Road, Lusaka."},
      {q:"What does Act No. 9 cover?", a:"Establishment, regulation, discipline of ZIVS."},
      {q:"Do I need a TPIN?", a:"Yes for corporate, recommended for individual."},
      {q:"CPD requirement?", a:"8 hours annually."},
      {q:"Student memberships?", a:"Yes, for enrolled students."},
      {q:"Verify a licensed valuer?", a:"Contact ZIVS for register search."},
      {q:"Firm inspections?", a:"Regular compliance audits."}
    ];
    let accHTML = ''; faqData.forEach(item => accHTML += `<div class="accordion-item"><div class="accordion-title"><span>${item.q}</span> <i class="fas fa-chevron-down" style="color: var(--gold);"></i></div><div class="accordion-content"><p>${item.a}</p></div></div>`);
    document.getElementById('accordionContainer').innerHTML = accHTML;
    document.querySelectorAll('.accordion-title').forEach(title => title.addEventListener('click', function() { let content = this.nextElementSibling; content.classList.toggle('show'); this.querySelector('i')?.classList.toggle('fa-chevron-up'); }));

    window.addEventListener('click', (e) => { if (e.target === document.getElementById('corpModal')) document.getElementById('corpModal').classList.remove('active'); if (e.target === document.getElementById('individualModal')) document.getElementById('individualModal').classList.remove('active'); });

    if (window.innerWidth < 860) {
      document.querySelectorAll('.nav-links > li > a').forEach(link => link.addEventListener('click', function(e) { if (this.nextElementSibling?.classList.contains('dropdown-menu')) { e.preventDefault(); this.parentElement.classList.toggle('dropdown-open'); } }));
    }

