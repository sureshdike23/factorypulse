/**
 * FactoryPulse V1 - Production Service (Phase 3B-2)
 * Handles machine resolution and persistent INSERT operations to public.production_entries in Supabase.
 */
import { getSupabaseClient } from './supabaseClient.js';
import { FACTORY_INFO } from '../data/demoData.js';

// Cached UUIDs to optimize lookups
let cachedFactoryId = null;
const machineCache = new Map(); // machineCode -> machine UUID

/**
 * Normalizes user-facing dates (e.g. '05 Sep 2026') to PostgreSQL ISO date format ('2026-09-05').
 */
export function normalizeReportDate(dateStr) {
  if (!dateStr) return '2026-09-05';
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const parts = trimmed.split(/[\s-]+/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const monthStr = parts[1].toLowerCase();
    const year = parts[2];
    const months = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
    };
    const monthKey = monthStr.substring(0, 3);
    if (months[monthKey]) {
      return `${year}-${months[monthKey]}-${day}`;
    }
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return '2026-09-05';
}

/**
 * Normalizes shift string (e.g. 'Shift A' -> 'A').
 */
export function normalizeShift(shiftStr) {
  if (!shiftStr) return 'A';
  const clean = shiftStr.trim();
  if (clean.startsWith('Shift ')) {
    return clean.replace('Shift ', '').trim();
  }
  return clean;
}

/**
 * Resolves the factory UUID for Pune Precision Components.
 */
export async function resolveFactoryId(supabase) {
  if (cachedFactoryId) return cachedFactoryId;

  try {
    const { data, error } = await supabase
      .from('factories')
      .select('id, name')
      .ilike('name', '%Pune Precision%')
      .limit(1);

    if (!error && data && data.length > 0) {
      cachedFactoryId = data[0].id;
      return cachedFactoryId;
    }
  } catch (e) {
    console.warn('[productionService] Error querying factories, falling back to default UUID:', e);
  }

  // Known fallback UUID from Phase 3A
  cachedFactoryId = '11111111-1111-1111-1111-111111111111';
  return cachedFactoryId;
}

/**
 * Resolves the machine UUID from public.machines using factory_id and machine_code.
 */
export async function resolveMachineId(supabase, factoryId, machineCode) {
  const code = (machineCode || '').trim();
  if (machineCache.has(code)) {
    return machineCache.get(code);
  }

  try {
    const { data, error } = await supabase
      .from('machines')
      .select('id, machine_code, factory_id')
      .eq('factory_id', factoryId)
      .eq('machine_code', code)
      .limit(1);

    if (!error && data && data.length > 0) {
      const machineUuid = data[0].id;
      machineCache.set(code, machineUuid);
      return machineUuid;
    }

    // Secondary fallback without factory filter if needed
    const { data: fallbackData } = await supabase
      .from('machines')
      .select('id, machine_code')
      .eq('machine_code', code)
      .limit(1);

    if (fallbackData && fallbackData.length > 0) {
      const machineUuid = fallbackData[0].id;
      machineCache.set(code, machineUuid);
      return machineUuid;
    }
  } catch (e) {
    console.warn(`[productionService] Error resolving machine ${code}:`, e);
  }

  // Known deterministic fallback mapping from Phase 3A schema (20000000-0000-0000-0000-00000000000X)
  const numMatch = code.match(/\d+$/);
  if (numMatch) {
    const machineNum = parseInt(numMatch[0], 10);
    const hexNum = machineNum.toString().padStart(12, '0');
    const fallbackUuid = `20000000-0000-0000-0000-${hexNum}`;
    machineCache.set(code, fallbackUuid);
    return fallbackUuid;
  }

  throw new Error(`Unable to resolve machine UUID for code "${code}"`);
}

/**
 * Inserts one production entry row into public.production_entries in Supabase.
 * 
 * @param {Object} entryData Form submission data
 * @returns {Promise<{ success: boolean, data?: Object, error?: Object }>}
 */
export async function insertProductionEntry(entryData) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: new Error('Supabase client is not configured or unavailable.'),
    };
  }

  try {
    const factoryId = await resolveFactoryId(supabase);
    const machineId = await resolveMachineId(supabase, factoryId, entryData.machineId);

    const reportDate = normalizeReportDate(entryData.date || FACTORY_INFO.demoDate);
    const shift = normalizeShift(entryData.shift || 'A');

    const payload = {
      factory_id: factoryId,
      machine_id: machineId,
      report_date: reportDate,
      shift: shift,
      job_number: entryData.jobNumber.trim(),
      part_description: entryData.partName.trim(),
      target_quantity: parseInt(entryData.targetQty, 10),
      produced_quantity: parseInt(entryData.producedQty, 10),
      rejected_quantity: parseInt(entryData.rejectedQty, 10),
      downtime_minutes: parseInt(entryData.downtimeMinutes, 10),
      downtime_reason: entryData.downtimeReason || 'None / Operational',
      supervisor_notes: entryData.notes && entryData.notes.trim() ? entryData.notes.trim() : null,
    };

    console.group('%c[FactoryPulse Supabase] INSERT public.production_entries%c', 'color: #2563eb; font-weight: bold;', 'color: inherit;');
    console.log('Submitting Payload:', payload);

    const { data, error } = await supabase
      .from('production_entries')
      .insert([payload])
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase INSERT Failed:', error);
      console.groupEnd();
      return {
        success: false,
        error: error,
      };
    }

    console.log('✅ Supabase INSERT Succeeded:', data);
    console.groupEnd();

    return {
      success: true,
      data: data,
    };
  } catch (err) {
    console.error('❌ Exception during insertProductionEntry:', err);
    return {
      success: false,
      error: err,
    };
  }
}
