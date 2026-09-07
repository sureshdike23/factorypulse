/**
 * FactoryPulse V1 - Live Data Service (Phase 3B-3)
 * Fetches and normalizes live data from Supabase tables:
 * - public.factories
 * - public.machines
 * - public.production_entries
 */
import { getSupabaseClient } from './supabaseClient.js';
import { FACTORY_INFO, MACHINES as FALLBACK_MACHINES } from '../data/demoData.js';

/**
 * Formats ISO timestamp to HH:MM IST format.
 */
function formatTimestampToIST(isoString) {
  if (!isoString) return '14:15 IST';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '14:15 IST';
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes} IST`;
  } catch (e) {
    return '14:15 IST';
  }
}

/**
 * Normalizes a single Supabase production_entries row into the application's record format.
 * 
 * @param {Object} row Supabase production_entries row
 * @param {Map<string, Object>} machineMap Map of machine_id -> machine object
 * @returns {Object} Normalized UI production record
 */
export function normalizeProductionEntry(row, machineMap = new Map()) {
  const machine = machineMap.get(row.machine_id) || {};
  const machineCode = machine.machine_code || machine.name || row.machine_code || 'CNC Unit';
  const machineType = machine.machine_type || machine.type || 'CNC Precision';

  const targetQty = parseInt(row.target_quantity ?? row.target_qty ?? row.target ?? 0, 10);
  const producedQty = parseInt(row.produced_quantity ?? row.produced_qty ?? row.produced ?? 0, 10);
  const rejectedQty = parseInt(row.rejected_quantity ?? row.rejected_qty ?? row.rejected ?? 0, 10);
  const downtimeMinutes = parseInt(row.downtime_minutes ?? row.downtime ?? 0, 10);

  const goodQty = producedQty - rejectedQty;
  const achievementPct = targetQty > 0 ? parseFloat(((producedQty / targetQty) * 100).toFixed(1)) : 0;
  const rejectionRatePct = producedQty > 0 ? parseFloat(((rejectedQty / producedQty) * 100).toFixed(1)) : 0;
  const isCritical = rejectionRatePct > 5.0;

  const shiftLabel = row.shift
    ? (row.shift.startsWith('Shift ') ? row.shift : `Shift ${row.shift}`)
    : 'Shift A';

  const timeLabel = formatTimestampToIST(row.created_at);
  const jobNumber = row.job_number || 'N/A';
  const partName = row.part_description || row.part_name || 'Component Part';
  const downtimeReason = row.downtime_reason || 'None / Operational';
  const supervisor = row.supervisor_notes && row.supervisor_notes.includes('Supervisor:')
    ? row.supervisor_notes.replace('Supervisor:', '').trim()
    : (row.supervisor || FACTORY_INFO.supervisor);

  const searchKeywords = [
    machineCode,
    machineType,
    jobNumber,
    partName,
    shiftLabel,
    downtimeReason,
    supervisor,
    isCritical ? 'critical high rejection' : 'normal',
  ].filter(Boolean).join(' ').toLowerCase();

  return {
    id: row.id,
    supabaseId: row.id,
    machineId: machineCode,
    machineUuid: row.machine_id,
    machineType: machineType,
    statusBadge: isCritical ? 'HIGH REJECTION' : 'NORMAL',
    isCritical: isCritical,
    shift: shiftLabel,
    time: timeLabel,
    date: row.report_date || '2026-09-05',
    jobNumber: jobNumber,
    partName: partName,
    targetQty: targetQty,
    producedQty: producedQty,
    goodQty: goodQty,
    rejectedQty: rejectedQty,
    rejectionRatePct: rejectionRatePct,
    achievementPct: achievementPct,
    downtimeMinutes: downtimeMinutes,
    downtimeReason: downtimeReason,
    notes: row.supervisor_notes || '',
    supervisor: supervisor,
    searchKeywords: searchKeywords,
    createdAt: row.created_at,
  };
}

/**
 * Calculates aggregated production totals from a list of records.
 * 
 * @param {Array<Object>} records List of normalized records
 * @returns {Object} Aggregated totals
 */
export function calculateProductionTotals(records = []) {
  const totalTarget = records.reduce((acc, r) => acc + (r.targetQty || 0), 0);
  const totalProduced = records.reduce((acc, r) => acc + (r.producedQty || 0), 0);
  const totalRejected = records.reduce((acc, r) => acc + (r.rejectedQty || 0), 0);
  const totalGood = totalProduced - totalRejected;
  const totalDowntime = records.reduce((acc, r) => acc + (r.downtimeMinutes || 0), 0);

  const achievementPct = totalTarget > 0 ? parseFloat(((totalProduced / totalTarget) * 100).toFixed(1)) : 0;
  const rejectionRatePct = totalProduced > 0 ? parseFloat(((totalRejected / totalProduced) * 100).toFixed(2)) : 0;

  return {
    totalTarget,
    totalProduced,
    totalGood,
    totalRejected,
    totalDowntime,
    achievementPct,
    rejectionRatePct,
    count: records.length,
    loggedMachinesCount: new Set(records.map((r) => r.machineId)).size,
  };
}

/**
 * Fetches live data from Supabase (factories, machines, production_entries).
 * 
 * @returns {Promise<{ success: boolean, factory?: Object, machines?: Array, records?: Array, error?: Object }>}
 */
export async function fetchLiveAppData(targetFactoryId = null) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: new Error('Supabase client is not configured or unavailable.'),
    };
  }

  try {
    console.group('%c[FactoryPulse DataService] Fetching Live Supabase Data%c', 'color: #2563eb; font-weight: bold;', 'color: inherit;');
    if (targetFactoryId) console.log('Filtering by Factory ID:', targetFactoryId);

    // 1. Fetch Factory
    let factoryQuery = supabase.from('factories').select('*');
    if (targetFactoryId) {
      factoryQuery = factoryQuery.eq('id', targetFactoryId);
    }
    const { data: factories, error: fError } = await factoryQuery.limit(1);

    if (fError) {
      console.error('Failed to fetch factories:', fError);
      console.groupEnd();
      return { success: false, error: fError };
    }

    const factoryData = factories && factories.length > 0 ? factories[0] : FACTORY_INFO;

    // 2. Fetch Machines
    let machinesQuery = supabase.from('machines').select('*');
    if (targetFactoryId) {
      machinesQuery = machinesQuery.eq('factory_id', targetFactoryId);
    }
    const { data: machines, error: mError } = await machinesQuery.order('machine_code', { ascending: true });

    if (mError) {
      console.error('Failed to fetch machines:', mError);
      console.groupEnd();
      return { success: false, error: mError };
    }

    const liveMachines = (machines && machines.length > 0) ? machines : FALLBACK_MACHINES;

    // Build lookup map for fast machine resolution: UUID -> machine object
    const machineMap = new Map();
    liveMachines.forEach((m) => {
      machineMap.set(m.id, m);
      if (m.machine_code) machineMap.set(m.machine_code, m);
    });

    // 3. Fetch Production Entries
    let entriesQuery = supabase.from('production_entries').select('*');
    if (targetFactoryId) {
      entriesQuery = entriesQuery.eq('factory_id', targetFactoryId);
    }
    const { data: entries, error: pError } = await entriesQuery.order('created_at', { ascending: false });

    if (pError) {
      console.error('Failed to fetch production_entries:', pError);
      console.groupEnd();
      return { success: false, error: pError };
    }

    const normalizedRecords = (entries || []).map((row) => normalizeProductionEntry(row, machineMap));

    console.log(`✅ Loaded ${normalizedRecords.length} live production entries.`);
    console.log(`✅ Loaded ${liveMachines.length} live machines.`);
    console.log(`✅ Loaded factory: "${factoryData.name}".`);
    console.groupEnd();

    return {
      success: true,
      factory: factoryData,
      machines: liveMachines,
      machineMap: machineMap,
      records: normalizedRecords,
    };
  } catch (err) {
    console.error('❌ Exception in fetchLiveAppData:', err);
    return {
      success: false,
      error: err,
    };
  }
}
