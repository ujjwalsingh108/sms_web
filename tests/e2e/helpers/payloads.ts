export function academicYearPayload() {
  const ts = Date.now();
  return {
    name: `E2E Academic ${ts}`,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
    is_current: false,
  };
}

export function classPayload() {
  const ts = Date.now();
  return { name: `E2E Class ${ts}`, description: 'Created by E2E' };
}

export function sectionPayload(classId: string) {
  const ts = Date.now();
  return { class_id: classId, name: `E2E Section ${ts}`, room_number: null, capacity: 30 };
}

export function subjectPayload() {
  const ts = Date.now();
  return { name: `E2E Subject ${ts}`, code: `E2E${ts % 10000}`, description: 'E2E subject' };
}
