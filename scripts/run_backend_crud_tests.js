// Load .env manually to avoid requiring dotenv in this environment
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
      // strip surrounding quotes
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

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});

function uniqueName(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

async function getTenantId() {
  const { data } = await admin.from('tenants').select('id').limit(1).maybeSingle();
  if (!data || !data.id) {
    // Try to find tenant via members table
    const { data: m } = await admin.from('members').select('tenant_id').limit(1).maybeSingle();
    return m?.tenant_id || null;
  }
  return data.id;
}

async function testAcademicYears(tenantId, report) {
  const created = [];
  try {
    const payload = {
      name: uniqueName('e2e-ay'),
      start_date: new Date().toISOString().slice(0,10),
      end_date: new Date(Date.now()+365*24*3600*1000).toISOString().slice(0,10),
      is_current: false,
      tenant_id: tenantId,
    };
    const { data, error } = await admin.from('academic_years').insert([payload]).select().single();
    if (error) throw error;
    created.push(data.id);
    report.academic_years = { created: data };

    // Read single
    const { data: single, error: e2 } = await admin.from('academic_years').select('*').eq('id', data.id).single();
    if (e2) throw e2;
    report.academic_years.read = single;

    // Update
    const { data: upd, error: e3 } = await admin.from('academic_years').update({ name: payload.name + '-updated' }).eq('id', data.id).select().single();
    if (e3) throw e3;
    report.academic_years.updated = upd;

    // Delete
    const { error: delErr } = await admin.from('academic_years').delete().eq('id', data.id);
    if (delErr) throw delErr;
    report.academic_years.deleted = true;
  } catch (err) {
    report.academic_years = report.academic_years || {};
    report.academic_years.error = String(err.message || err);
  }
  return created;
}

async function testClassesSections(tenantId, report) {
  try {
    // Create class
    const classPayload = { tenant_id: tenantId, name: uniqueName('e2e-class'), description: 'E2E' };
    const { data: cls, error } = await admin.from('classes').insert([classPayload]).select().single();
    if (error) throw error;
    report.class = { created: cls };

    // Create section
    const sectionPayload = { tenant_id: tenantId, class_id: cls.id, name: uniqueName('e2e-section'), room_number: null, capacity: 20 };
    const { data: sec, error: secErr } = await admin.from('sections').insert([sectionPayload]).select().single();
    if (secErr) throw secErr;
    report.section = { created: sec };

    // Read list
    const { data: classesList, error: listErr } = await admin.from('classes').select('*').eq('tenant_id', tenantId);
    if (listErr) throw listErr;
    report.class.list = classesList.length;

    // Update section
    const { data: updatedSection, error: upErr } = await admin.from('sections').update({ name: sectionPayload.name + '-u' }).eq('id', sec.id).select().single();
    if (upErr) throw upErr;
    report.section.updated = updatedSection;

    // Cleanup
    await admin.from('sections').delete().eq('id', sec.id);
    await admin.from('classes').delete().eq('id', cls.id);
    report.class.deleted = true;
    report.section.deleted = true;
  } catch (err) {
    report.class = report.class || {};
    report.class.error = String(err.message || err);
  }
}

async function testSubjects(tenantId, report) {
  try {
    const payload = { tenant_id: tenantId, name: uniqueName('e2e-subj'), code: `E2E${Math.floor(Math.random()*10000)}`, description: 'E2E' };
    const { data, error } = await admin.from('subjects').insert([payload]).select().single();
    if (error) throw error;
    report.subject = { created: data };

    // Update
    const { data: upd, error: uErr } = await admin.from('subjects').update({ name: payload.name + '-u' }).eq('id', data.id).select().single();
    if (uErr) throw uErr;
    report.subject.updated = upd;

    // Delete
    const { error: delErr } = await admin.from('subjects').delete().eq('id', data.id);
    if (delErr) throw delErr;
    report.subject.deleted = true;
  } catch (err) {
    report.subject = report.subject || {};
    report.subject.error = String(err.message || err);
  }
}

async function testTransport(tenantId, report) {
  try {
    // Create vehicle
    const vehicle = {
      tenant_id: tenantId,
      vehicle_number: `E2E-${Date.now()}`,
      vehicle_type: 'bus',
      model: 'E2E Model',
      capacity: 40,
      driver_name: 'E2E Driver',
      driver_phone: '9999999999',
      driver_license: 'DL-E2E',
      status: 'active',
    };
    const { data: vData, error: vErr } = await admin.from('vehicles').insert([vehicle]).select().single();
    if (vErr) throw vErr;
    report.vehicle = { created: vData };

    // Create route
    const route = {
      tenant_id: tenantId,
      route_name: `E2E Route ${Date.now()}`,
      route_number: `R-${Math.floor(Math.random()*1000)}`,
      starting_point: 'Start',
      ending_point: 'End',
      distance_km: 12.5,
      fare: 25.0,
      status: 'active',
    };
    const { data: rData, error: rErr } = await admin.from('routes').insert([route]).select().single();
    if (rErr) throw rErr;
    report.route = { created: rData };

    // Create a route stop
    const stop = {
      tenant_id: tenantId,
      route_id: rData.id,
      stop_name: 'Stop A',
      stop_order: 1,
      pickup_time: null,
      drop_time: null,
    };
    const { data: sData, error: sErr } = await admin.from('route_stops').insert([stop]).select().single();
    if (sErr) throw sErr;
    report.route_stop = { created: sData };

    // Create student to link transport
    const studentPayload = {
      tenant_id: tenantId,
      first_name: 'E2E',
      last_name: 'Student',
      admission_no: `ADM-${Date.now()}`,
      status: 'active',
    };
    const { data: stData, error: stErr } = await admin.from('students').insert([studentPayload]).select().single();
    if (stErr) throw stErr;
    report.transport_student = { created: stData };

    // Create student_transport
    const transport = {
      tenant_id: tenantId,
      student_id: stData.id,
      route_id: rData.id,
      pickup_stop_id: sData.id,
      drop_stop_id: sData.id,
      pickup_time: null,
      drop_time: null,
      academic_year_id: null,
      status: 'active',
    };
    const { data: tData, error: tErr } = await admin.from('student_transport').insert([transport]).select().single();
    if (tErr) throw tErr;
    report.student_transport = { created: tData };

    // Cleanup created rows
    await admin.from('student_transport').delete().eq('id', tData.id);
    await admin.from('route_stops').delete().eq('id', sData.id);
    await admin.from('routes').delete().eq('id', rData.id);
    await admin.from('vehicles').delete().eq('id', vData.id);
    await admin.from('students').delete().eq('id', stData.id);
    report.transport_deleted = true;
  } catch (err) {
    report.transport = report.transport || {};
    report.transport.error = String(err.message || err);
  }
}

async function testStudentsTenant(tenantId, report) {
  try {
    const studentPayload = {
      tenant_id: tenantId,
      first_name: `E2EStudent${Date.now()}`,
      last_name: 'Test',
      admission_no: `ADM-${Date.now()}`,
      status: 'active',
    };
    const { data: student, error: sErr } = await admin.from('students').insert([studentPayload]).select().single();
    if (sErr) throw sErr;
    report.student = { created: student };

    // Add guardian
    const guardian = {
      tenant_id: tenantId,
      student_id: student.id,
      name: 'E2E Guardian',
      relation: 'parent',
      phone: '9999999999',
      email: null,
    };
    const { data: gData, error: gErr } = await admin.from('guardians').insert([guardian]).select().single();
    if (gErr) throw gErr;
    report.guardian = { created: gData };

    // Update student
    const { data: upd, error: uErr } = await admin.from('students').update({ last_name: 'Updated' }).eq('id', student.id).select().single();
    if (uErr) throw uErr;
    report.student.updated = upd;

    // Cleanup
    await admin.from('guardians').delete().eq('id', gData.id);
    await admin.from('students').delete().eq('id', student.id);
    report.student.deleted = true;
  } catch (err) {
    report.student = report.student || {};
    report.student.error = String(err.message || err);
  }
}

async function run() {
  const report = { started_at: new Date().toISOString() };
  const tenantId = await getTenantId();
  if (!tenantId) {
    console.error('No tenant id found in database. Cannot proceed safely.');
    process.exit(1);
  }
  report.tenantId = tenantId;

  await testAcademicYears(tenantId, report);
  await testClassesSections(tenantId, report);
  await testSubjects(tenantId, report);

  report.completed_at = new Date().toISOString();
  const outDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'backend_crud_report.json'), JSON.stringify(report, null, 2));
  console.log('Backend CRUD tests finished. Report:', path.join('reports', 'backend_crud_report.json'));
}

run().catch((e) => {
  console.error('Fatal error running tests:', e);
  process.exit(1);
});
