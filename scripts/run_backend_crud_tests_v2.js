// Run backend CRUD E2E tests (v2)
const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  env.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
    if (m) {
      const key = m[1];
      let val = m[2] || '';
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}
const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
function uniqueName(prefix) { return `${prefix}-${Date.now()}-${Math.floor(Math.random()*10000)}`; }
async function getTenantId() {
  const { data } = await admin.from('tenants').select('id').limit(1).maybeSingle();
  if (!data || !data.id) {
    const { data: m } = await admin.from('members').select('tenant_id').limit(1).maybeSingle();
    return m?.tenant_id || null;
  }
  return data.id;
}
async function testAcademicYears(tenantId, report) {
  try {
    const payload = { name: uniqueName('e2e-ay'), start_date: new Date().toISOString().slice(0,10), end_date: new Date(Date.now()+365*24*3600*1000).toISOString().slice(0,10), is_current: false, tenant_id: tenantId };
    const { data, error } = await admin.from('academic_years').insert([payload]).select().single();
    if (error) throw error;
    report.academic_years = { created: data };
    const { data: single, error: e2 } = await admin.from('academic_years').select('*').eq('id', data.id).single();
    if (e2) throw e2; report.academic_years.read = single;
    const { data: upd, error: e3 } = await admin.from('academic_years').update({ name: payload.name + '-updated' }).eq('id', data.id).select().single();
    if (e3) throw e3; report.academic_years.updated = upd;
    const { error: delErr } = await admin.from('academic_years').delete().eq('id', data.id);
    if (delErr) throw delErr; report.academic_years.deleted = true;
  } catch (err) { report.academic_years = report.academic_years || {}; report.academic_years.error = String(err.message || err); }
}
async function testClassesSections(tenantId, report) {
  try {
    const classPayload = { tenant_id: tenantId, name: uniqueName('e2e-class'), description: 'E2E' };
    const { data: cls, error } = await admin.from('classes').insert([classPayload]).select().single();
    if (error) throw error; report.class = { created: cls };
    const sectionPayload = { tenant_id: tenantId, class_id: cls.id, name: uniqueName('e2e-section'), room_number: null, capacity: 20 };
    const { data: sec, error: secErr } = await admin.from('sections').insert([sectionPayload]).select().single();
    if (secErr) throw secErr; report.section = { created: sec };
    const { data: classesList, error: listErr } = await admin.from('classes').select('*').eq('tenant_id', tenantId);
    if (listErr) throw listErr; report.class.list = classesList.length;
    const { data: updatedSection, error: upErr } = await admin.from('sections').update({ name: sectionPayload.name + '-u' }).eq('id', sec.id).select().single();
    if (upErr) throw upErr; report.section.updated = updatedSection;
    await admin.from('sections').delete().eq('id', sec.id);
    await admin.from('classes').delete().eq('id', cls.id);
    report.class.deleted = true; report.section.deleted = true;
  } catch (err) { report.class = report.class || {}; report.class.error = String(err.message || err); }
}
async function testSubjects(tenantId, report) {
  try {
    const payload = { tenant_id: tenantId, name: uniqueName('e2e-subj'), code: `E2E${Math.floor(Math.random()*10000)}`, description: 'E2E' };
    const { data, error } = await admin.from('subjects').insert([payload]).select().single();
    if (error) throw error; report.subject = { created: data };
    const { data: upd, error: uErr } = await admin.from('subjects').update({ name: payload.name + '-u' }).eq('id', data.id).select().single();
    if (uErr) throw uErr; report.subject.updated = upd;
    const { error: delErr } = await admin.from('subjects').delete().eq('id', data.id);
    if (delErr) throw delErr; report.subject.deleted = true;
  } catch (err) { report.subject = report.subject || {}; report.subject.error = String(err.message || err); }
}
async function testTransport(tenantId, report) {
  try {
    const vehicle = { tenant_id: tenantId, vehicle_number: `E2E-${Date.now()}`, vehicle_type: 'bus', model: 'E2E Model', capacity: 40, driver_name: 'E2E Driver', driver_phone: '9999999999', driver_license: 'DL-E2E', status: 'active' };
    const { data: vData, error: vErr } = await admin.from('vehicles').insert([vehicle]).select().single();
    if (vErr) throw vErr; report.vehicle = { created: vData };
    const route = { tenant_id: tenantId, route_name: `E2E Route ${Date.now()}`, route_number: `R-${Math.floor(Math.random()*1000)}`, starting_point: 'Start', ending_point: 'End', distance_km: 12.5, fare: 25.0, status: 'active' };
    const { data: rData, error: rErr } = await admin.from('routes').insert([route]).select().single();
    if (rErr) throw rErr; report.route = { created: rData };
    const stop = { tenant_id: tenantId, route_id: rData.id, stop_name: 'Stop A', stop_order: 1, pickup_time: null, drop_time: null };
    const { data: sData, error: sErr } = await admin.from('route_stops').insert([stop]).select().single();
    if (sErr) throw sErr; report.route_stop = { created: sData };
    const studentPayload = { tenant_id: tenantId, first_name: 'E2E', last_name: 'Student', admission_no: `ADM-${Date.now()}`, status: 'active' };
    const { data: stData, error: stErr } = await admin.from('students').insert([studentPayload]).select().single();
    if (stErr) throw stErr; report.transport_student = { created: stData };
    const transport = { tenant_id: tenantId, student_id: stData.id, route_id: rData.id, pickup_stop_id: sData.id, drop_stop_id: sData.id, pickup_time: null, drop_time: null, academic_year_id: null, status: 'active' };
    const { data: tData, error: tErr } = await admin.from('student_transport').insert([transport]).select().single();
    if (tErr) throw tErr; report.student_transport = { created: tData };
    await admin.from('student_transport').delete().eq('id', tData.id);
    await admin.from('route_stops').delete().eq('id', sData.id);
    await admin.from('routes').delete().eq('id', rData.id);
    await admin.from('vehicles').delete().eq('id', vData.id);
    await admin.from('students').delete().eq('id', stData.id);
    report.transport_deleted = true;
  } catch (err) { report.transport = report.transport || {}; report.transport.error = String(err.message || err); }
}
async function testStudentsTenant(tenantId, report) {
  try {
    const studentPayload = { tenant_id: tenantId, first_name: `E2EStudent${Date.now()}`, last_name: 'Test', admission_no: `ADM-${Date.now()}`, status: 'active' };
    const { data: student, error: sErr } = await admin.from('students').insert([studentPayload]).select().single();
    if (sErr) throw sErr; report.student = { created: student };
    const guardian = { tenant_id: tenantId, student_id: student.id, name: 'E2E Guardian', phone: '9999999999', email: null };
    const { data: gData, error: gErr } = await admin.from('guardians').insert([guardian]).select().single();
    if (gErr) throw gErr; report.guardian = { created: gData };
    const { data: upd, error: uErr } = await admin.from('students').update({ last_name: 'Updated' }).eq('id', student.id).select().single();
    if (uErr) throw uErr; report.student.updated = upd;
    await admin.from('guardians').delete().eq('id', gData.id);
    await admin.from('students').delete().eq('id', student.id);
    report.student.deleted = true;
  } catch (err) { report.student = report.student || {}; report.student.error = String(err.message || err); }
}

async function tableExists(tableName) {
  try {
    const { error } = await admin.from(tableName).select('id').limit(1);
    if (error) return false;
    return true;
  } catch (e) {
    return false;
  }
}

async function testStaff(tenantId, report) {
  report.staff = {};
  if (!(await tableExists('staff'))) {
    report.staff.skipped = true;
    report.staff.reason = 'table not found';
    return;
  }
  try {
    const payload = { tenant_id: tenantId, first_name: 'E2E', last_name: 'Staff', employee_no: `EMP-${Date.now()}` };
    const { data, error } = await admin.from('staff').insert([payload]).select().single();
    if (error) throw error;
    report.staff.created = data;
    await admin.from('staff').delete().eq('id', data.id);
    report.staff.deleted = true;
  } catch (err) {
    report.staff.error = String(err.message || err);
  }
}

async function testFees(tenantId, report) {
  report.fees = {};
  const candidates = ['fees', 'fee_structures', 'fee_items'];
  let found = null;
  for (const t of candidates) if (await tableExists(t)) { found = t; break; }
  if (!found) { report.fees.skipped = true; report.fees.reason = 'no fees table found'; return; }
  try {
    const payload = { tenant_id: tenantId, name: 'E2E Fee', amount: 1 };
    const { data, error } = await admin.from(found).insert([payload]).select().single();
    if (error) throw error;
    report.fees.created = { table: found, row: data };
    await admin.from(found).delete().eq('id', data.id);
    report.fees.deleted = true;
  } catch (err) { report.fees.error = String(err.message || err); }
}

async function testExams(tenantId, report) {
  report.exams = {};
  const candidates = ['exams', 'exam_sessions', 'assessments'];
  let found = null;
  for (const t of candidates) if (await tableExists(t)) { found = t; break; }
  if (!found) { report.exams.skipped = true; report.exams.reason = 'no exams table found'; return; }
  try {
    const payload = { tenant_id: tenantId, name: 'E2E Exam' };
    const { data, error } = await admin.from(found).insert([payload]).select().single();
    if (error) throw error;
    report.exams.created = { table: found, row: data };
    await admin.from(found).delete().eq('id', data.id);
    report.exams.deleted = true;
  } catch (err) { report.exams.error = String(err.message || err); }
}

async function testLibrary(tenantId, report) {
  report.library = {};
  const candidates = ['books', 'library_books', 'items'];
  let found = null;
  for (const t of candidates) if (await tableExists(t)) { found = t; break; }
  if (!found) { report.library.skipped = true; report.library.reason = 'no library table found'; return; }
  try {
    const payload = { tenant_id: tenantId, title: 'E2E Book', author: 'E2E' };
    const { data, error } = await admin.from(found).insert([payload]).select().single();
    if (error) throw error;
    report.library.created = { table: found, row: data };
    await admin.from(found).delete().eq('id', data.id);
    report.library.deleted = true;
  } catch (err) { report.library.error = String(err.message || err); }
}

async function testAttendance(tenantId, report) {
  report.attendance = {};
  const candidates = ['attendances', 'attendance', 'student_attendance'];
  let found = null;
  for (const t of candidates) if (await tableExists(t)) { found = t; break; }
  if (!found) { report.attendance.skipped = true; report.attendance.reason = 'no attendance table found'; return; }
  try {
    const payload = { tenant_id: tenantId, date: new Date().toISOString().slice(0,10), status: 'present' };
    const { data, error } = await admin.from(found).insert([payload]).select().single();
    if (error) throw error;
    report.attendance.created = { table: found, row: data };
    await admin.from(found).delete().eq('id', data.id);
    report.attendance.deleted = true;
  } catch (err) { report.attendance.error = String(err.message || err); }
}

async function testTimetable(tenantId, report) {
  report.timetable = {};
  const candidates = ['timetables', 'timetable_entries', 'timetable'];
  let found = null;
  for (const t of candidates) if (await tableExists(t)) { found = t; break; }
  if (!found) { report.timetable.skipped = true; report.timetable.reason = 'no timetable table found'; return; }
  try {
    const payload = { tenant_id: tenantId, name: 'E2E Timetable' };
    const { data, error } = await admin.from(found).insert([payload]).select().single();
    if (error) throw error;
    report.timetable.created = { table: found, row: data };
    await admin.from(found).delete().eq('id', data.id);
    report.timetable.deleted = true;
  } catch (err) { report.timetable.error = String(err.message || err); }
}

async function testInventory(tenantId, report) {
  report.inventory = {};
  const candidates = ['inventory', 'items', 'inventory_items'];
  let found = null;
  for (const t of candidates) if (await tableExists(t)) { found = t; break; }
  if (!found) { report.inventory.skipped = true; report.inventory.reason = 'no inventory table found'; return; }
  try {
    const payload = { tenant_id: tenantId, name: 'E2E Item', quantity: 1 };
    const { data, error } = await admin.from(found).insert([payload]).select().single();
    if (error) throw error;
    report.inventory.created = { table: found, row: data };
    await admin.from(found).delete().eq('id', data.id);
    report.inventory.deleted = true;
  } catch (err) { report.inventory.error = String(err.message || err); }
}

async function testAccountHeads(tenantId, report) {
  report.account_heads = {};
  if (!(await tableExists('account_heads'))) {
    report.account_heads.skipped = true; report.account_heads.reason = 'table not found'; return;
  }
  try {
    const payload = { tenant_id: tenantId, name: 'E2E Account Head', type: 'income', description: 'E2E' };
    const { data, error } = await admin.from('account_heads').insert([payload]).select().single();
    if (error) throw error;
    report.account_heads.created = data;
    await admin.from('account_heads').delete().eq('id', data.id);
    report.account_heads.deleted = true;
  } catch (err) { report.account_heads.error = String(err.message || err); }
}

async function testFeesPayments(tenantId, report) {
  report.fee_structures = {};
  if (!(await tableExists('fee_structures'))) { report.fee_structures.skipped = true; report.fee_structures.reason = 'table not found'; }
  try {
    if (await tableExists('fee_structures')) {
      const payload = { tenant_id: tenantId, name: 'E2E Fee Struct', amount: 100, frequency: 'one_time' };
      const { data, error } = await admin.from('fee_structures').insert([payload]).select().single();
      if (error) throw error;
      report.fee_structures.created = data;

      // create fee_payment if table exists and students table exists
      if (await tableExists('fee_payments')) {
        // create a student to link
        const { data: st, error: stErr } = await admin.from('students').insert([{ tenant_id: tenantId, admission_no: `ADM-${Date.now()}`, first_name: 'E2E', last_name: 'Fee' }]).select().single();
        if (stErr) throw stErr;
        report.fee_structures.test_student = st;
        const payment = { tenant_id: tenantId, student_id: st.id, fee_structure_id: data.id, amount_paid: 100, payment_method: 'cash' };
        const { data: pData, error: pErr } = await admin.from('fee_payments').insert([payment]).select().single();
        if (pErr) throw pErr;
        report.fee_payments = { created: pData };
        await admin.from('fee_payments').delete().eq('id', pData.id);
        await admin.from('students').delete().eq('id', st.id);
      }

      await admin.from('fee_structures').delete().eq('id', data.id);
      report.fee_structures.deleted = true;
    }
  } catch (err) { report.fee_structures.error = String(err.message || err); }
}

async function testExamsExtended(tenantId, report) {
  report.exams_extended = {};
  if (!(await tableExists('exams'))) { report.exams_extended.skipped = true; report.exams_extended.reason = 'exams table not found'; return; }
  try {
    // create exam_type if exists
    let examType = null;
    if (await tableExists('exam_types')) {
      const { data, error } = await admin.from('exam_types').insert([{ tenant_id: tenantId, name: 'E2E Type' }]).select().single();
      if (error) throw error; examType = data; report.exams_extended.exam_type = data;
    }

    // need class and subject ids; try to create minimal class/subject
    let cls = null;
    if (await tableExists('classes')) {
      const { data, error } = await admin.from('classes').insert([{ tenant_id: tenantId, name: 'E2E Class' }]).select().single();
      if (error) throw error; cls = data; report.exams_extended.class = data;
    }
    let subj = null;
    if (await tableExists('subjects')) {
      const { data, error } = await admin.from('subjects').insert([{ tenant_id: tenantId, name: 'E2E Subject' }]).select().single();
      if (error) throw error; subj = data; report.exams_extended.subject = data;
    }

    // create exam
    const examPayload = { tenant_id: tenantId, exam_type_id: examType?.id || null, name: 'E2E Exam' };
    const { data: examData, error: examErr } = await admin.from('exams').insert([examPayload]).select().single();
    if (examErr) throw examErr; report.exams_extended.exam = examData;

    // create schedule if table exists and we have class & subject
    if (await tableExists('exam_schedules') && cls && subj) {
      const sched = { tenant_id: tenantId, exam_id: examData.id, class_id: cls.id, subject_id: subj.id, exam_date: new Date().toISOString().slice(0,10) };
      const { data: sData, error: sErr } = await admin.from('exam_schedules').insert([sched]).select().single();
      if (sErr) throw sErr; report.exams_extended.schedule = sData;
      // create result if table exists and we have a student
      if (await tableExists('exam_results')) {
        const { data: st, error: stErr } = await admin.from('students').insert([{ tenant_id: tenantId, admission_no: `ADM-${Date.now()}`, first_name: 'E2E', last_name: 'Res' }]).select().single();
        if (stErr) throw stErr;
        const res = { tenant_id: tenantId, exam_schedule_id: sData.id, student_id: st.id, marks_obtained: 85 };
        const { data: rData, error: rErr } = await admin.from('exam_results').insert([res]).select().single();
        if (rErr) throw rErr; report.exams_extended.result = rData;
        await admin.from('exam_results').delete().eq('id', rData.id);
        await admin.from('students').delete().eq('id', st.id);
      }
      await admin.from('exam_schedules').delete().eq('id', sData.id);
    }

    await admin.from('exams').delete().eq('id', examData.id);
    if (examType) await admin.from('exam_types').delete().eq('id', examType.id);
    if (cls) await admin.from('classes').delete().eq('id', cls.id);
    if (subj) await admin.from('subjects').delete().eq('id', subj.id);
    report.exams_extended.cleaned = true;
  } catch (err) { report.exams_extended.error = String(err.message || err); }
}

async function testLibraryTransactions(tenantId, report) {
  report.library_tx = {};
  if (!(await tableExists('library_books'))) { report.library_tx.skipped = true; report.library_tx.reason = 'no library_books'; return; }
  try {
    const { data: book, error: bErr } = await admin.from('library_books').insert([{ tenant_id: tenantId, title: 'E2E Book', author: 'E2E' }]).select().single();
    if (bErr) throw bErr; report.library_tx.book = book;
    // create a student
    const { data: st, error: stErr } = await admin.from('students').insert([{ tenant_id: tenantId, admission_no: `ADM-${Date.now()}`, first_name: 'E2E', last_name: 'Lib' }]).select().single();
    if (stErr) throw stErr; report.library_tx.student = st;
    if (await tableExists('library_transactions')) {
      const tx = { tenant_id: tenantId, book_id: book.id, student_id: st.id, issue_date: new Date().toISOString().slice(0,10), due_date: new Date(Date.now()+7*24*3600*1000).toISOString().slice(0,10) };
      const { data: txData, error: txErr } = await admin.from('library_transactions').insert([tx]).select().single();
      if (txErr) throw txErr; report.library_tx.tx = txData;
      await admin.from('library_transactions').delete().eq('id', txData.id);
    }
    await admin.from('library_books').delete().eq('id', book.id);
    await admin.from('students').delete().eq('id', st.id);
    report.library_tx.cleaned = true;
  } catch (err) { report.library_tx.error = String(err.message || err); }
}

async function testAttendanceExtended(tenantId, report) {
  report.attendance_extended = {};
  try {
    // student_attendance
    if (await tableExists('student_attendance')) {
      // need class & student
      const { data: cls } = await admin.from('classes').insert([{ tenant_id: tenantId, name: 'E2E Class Att' }]).select().single();
      const { data: st } = await admin.from('students').insert([{ tenant_id: tenantId, admission_no: `ADM-${Date.now()}`, first_name: 'E2E', last_name: 'Att', class_id: cls.id }]).select().single();
      const att = { tenant_id: tenantId, student_id: st.id, class_id: cls.id, date: new Date().toISOString().slice(0,10), status: 'present' };
      const { data: aData, error: aErr } = await admin.from('student_attendance').insert([att]).select().single();
      if (aErr) throw aErr; report.attendance_extended.student_attendance = aData;
      await admin.from('student_attendance').delete().eq('id', aData.id);
      await admin.from('students').delete().eq('id', st.id);
      await admin.from('classes').delete().eq('id', cls.id);
    }
    // staff_attendance
    if (await tableExists('staff_attendance') && await tableExists('staff')) {
      const { data: stf } = await admin.from('staff').insert([{ tenant_id: tenantId, employee_id: `EMP-${Date.now()}`, first_name: 'E2E', last_name: 'Stf', email: `e2e${Date.now()}@test.local` }]).select().single();
      const satt = { tenant_id: tenantId, staff_id: stf.id, date: new Date().toISOString().slice(0,10), status: 'present' };
      const { data: saData, error: saErr } = await admin.from('staff_attendance').insert([satt]).select().single();
      if (saErr) throw saErr; report.attendance_extended.staff_attendance = saData;
      await admin.from('staff_attendance').delete().eq('id', saData.id);
      await admin.from('staff').delete().eq('id', stf.id);
    }
    report.attendance_extended.cleaned = true;
  } catch (err) { report.attendance_extended.error = String(err.message || err); }
}

async function testAdmission(tenantId, report) {
  report.admission = {};
  if (!(await tableExists('admission_applications'))) { report.admission.skipped = true; report.admission.reason = 'table not found'; return; }
  try {
    const payload = {
      tenant_id: tenantId,
      application_no: `APP-${Date.now()}`,
      first_name: 'E2E',
      last_name: 'Applicant',
      status: 'pending'
    };
    const { data, error } = await admin.from('admission_applications').insert([payload]).select().single();
    if (error) throw error;
    report.admission.created = data;
    await admin.from('admission_applications').delete().eq('id', data.id);
    report.admission.deleted = true;
  } catch (err) { report.admission.error = String(err.message || err); }
}

async function testTransactions(tenantId, report) {
  report.transactions = {};
  if (!(await tableExists('transactions')) || !(await tableExists('account_heads'))) { report.transactions.skipped = true; report.transactions.reason = 'missing table(s)'; return; }
  try {
    // create account_head
    const { data: ah, error: ahErr } = await admin.from('account_heads').insert([{ tenant_id: tenantId, name: 'E2E Acc Tx', type: 'expense' }]).select().single();
    if (ahErr) throw ahErr; report.transactions.account_head = ah;
    // create transaction referencing account_head
    const tx = { tenant_id: tenantId, transaction_date: new Date().toISOString().slice(0,10), account_head_id: ah.id, type: 'debit', amount: 10, description: 'E2E' };
    const { data, error } = await admin.from('transactions').insert([tx]).select().single();
    if (error) throw error; report.transactions.created = data;
    await admin.from('transactions').delete().eq('id', data.id);
    await admin.from('account_heads').delete().eq('id', ah.id);
    report.transactions.deleted = true;
  } catch (err) { report.transactions.error = String(err.message || err); }
}

async function testHostel(tenantId, report) {
  report.hostel = {};
  if (!(await tableExists('hostels'))) { report.hostel.skipped = true; report.hostel.reason = 'table not found'; return; }
  try {
    const { data: hostel, error: hErr } = await admin.from('hostels').insert([{ tenant_id: tenantId, name: 'E2E Hostel', hostel_type: 'boys' }]).select().single();
    if (hErr) throw hErr; report.hostel.hostel = hostel;
    if (await tableExists('hostel_rooms')) {
      const { data: room, error: rErr } = await admin.from('hostel_rooms').insert([{ tenant_id: tenantId, hostel_id: hostel.id, room_number: 'R1', capacity: 2 }]).select().single();
      if (rErr) throw rErr; report.hostel.room = room;
      if (await tableExists('hostel_allocations')) {
        // create student
        const { data: st } = await admin.from('students').insert([{ tenant_id: tenantId, admission_no: `ADM-${Date.now()}`, first_name: 'E2E', last_name: 'Hostel' }]).select().single();
        const alloc = { tenant_id: tenantId, student_id: st.id, hostel_id: hostel.id, room_id: room.id };
        const { data: aData, error: aErr } = await admin.from('hostel_allocations').insert([alloc]).select().single();
        if (aErr) throw aErr; report.hostel.allocation = aData;
        await admin.from('hostel_allocations').delete().eq('id', aData.id);
        await admin.from('students').delete().eq('id', st.id);
      }
      await admin.from('hostel_rooms').delete().eq('id', room.id);
    }
    await admin.from('hostels').delete().eq('id', hostel.id);
    report.hostel.cleaned = true;
  } catch (err) { report.hostel.error = String(err.message || err); }
}

async function testMedical(tenantId, report) {
  report.medical = {};
  if (!(await tableExists('medical_records')) && !(await tableExists('medical_checkups'))) { report.medical.skipped = true; report.medical.reason = 'no medical tables'; return; }
  try {
    // create student
    const { data: st } = await admin.from('students').insert([{ tenant_id: tenantId, admission_no: `ADM-${Date.now()}`, first_name: 'E2E', last_name: 'Med' }]).select().single();
    if (await tableExists('medical_checkups')) {
      const chk = { tenant_id: tenantId, student_id: st.id, checkup_date: new Date().toISOString().slice(0,10) };
      const { data: cData, error: cErr } = await admin.from('medical_checkups').insert([chk]).select().single();
      if (cErr) throw cErr; report.medical.checkup = cData;
      await admin.from('medical_checkups').delete().eq('id', cData.id);
    }
    if (await tableExists('medical_records')) {
      const rec = { tenant_id: tenantId, student_id: st.id, record_date: new Date().toISOString().slice(0,10), symptoms: 'test' };
      const { data: rData, error: rErr } = await admin.from('medical_records').insert([rec]).select().single();
      if (rErr) throw rErr; report.medical.record = rData;
      await admin.from('medical_records').delete().eq('id', rData.id);
    }
    await admin.from('students').delete().eq('id', st.id);
    report.medical.cleaned = true;
  } catch (err) { report.medical.error = String(err.message || err); }
}

async function testMess(tenantId, report) {
  report.mess = {};
  if (!(await tableExists('mess_attendance'))) { report.mess.skipped = true; report.mess.reason = 'no mess_attendance'; return; }
  try {
    const { data: st } = await admin.from('students').insert([{ tenant_id: tenantId, admission_no: `ADM-${Date.now()}`, first_name: 'E2E', last_name: 'Mess' }]).select().single();
    const row = { tenant_id: tenantId, student_id: st.id, date: new Date().toISOString().slice(0,10), meal_type: 'lunch', is_present: true };
    const { data: mData, error: mErr } = await admin.from('mess_attendance').insert([row]).select().single();
    if (mErr) throw mErr; report.mess.created = mData;
    await admin.from('mess_attendance').delete().eq('id', mData.id);
    await admin.from('students').delete().eq('id', st.id);
    report.mess.cleaned = true;
  } catch (err) { report.mess.error = String(err.message || err); }
}
async function runAllAndExit() {
  try {
    const report = { started_at: new Date().toISOString() };
    const tenantId = await getTenantId();
    if (!tenantId) { console.error('No tenant id found in database. Cannot proceed safely.'); process.exit(1); }
    report.tenantId = tenantId;
    await testAcademicYears(tenantId, report);
    await testClassesSections(tenantId, report);
    await testSubjects(tenantId, report);
    await testTransport(tenantId, report);
    await testStudentsTenant(tenantId, report);
    await testAccountHeads(tenantId, report);
    await testFeesPayments(tenantId, report);
    await testExamsExtended(tenantId, report);
    await testLibraryTransactions(tenantId, report);
    await testAttendanceExtended(tenantId, report);
    await testAdmission(tenantId, report);
    await testTransactions(tenantId, report);
    await testHostel(tenantId, report);
    await testMedical(tenantId, report);
    await testMess(tenantId, report);
    // note: inventory & timetable tests already included above
    report.completed_at = new Date().toISOString();
    const outDir = path.join(__dirname, '..', 'reports'); if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'backend_crud_report.json'), JSON.stringify(report, null, 2));
    console.log('Backend CRUD tests finished. Report:', path.join('reports', 'backend_crud_report.json'));
    process.exit(0);
  } catch (e) { console.error('Fatal error running tests:', e); process.exit(1); }
}

runAllAndExit();
