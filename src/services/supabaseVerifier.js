/**
 * FactoryPulse V1 - Supabase Read-Only Data Verification Module
 * 
 * Phase 3B-1: Performs non-destructive, isolated read-only queries against
 * public.factories, public.machines, and public.production_entries.
 * 
 * Verifies demo records and production totals without modifying UI or in-memory state.
 */
import { getSupabaseClient } from './supabaseClient.js';
import { isSupabaseConfigured } from '../config/supabase.js';

export async function verifySupabaseConnection() {
  const report = {
    timestamp: new Date().toISOString(),
    configured: isSupabaseConfigured(),
    clientInitialized: false,
    factories: {
      success: false,
      count: 0,
      records: [],
      matchesDemo: false,
      error: null,
    },
    machines: {
      success: false,
      count: 0,
      records: [],
      matchesDemo: false,
      error: null,
    },
    productionEntries: {
      success: false,
      count: 0,
      records: [],
      matchesDemoCount: false,
      totals: {
        target: 0,
        produced: 0,
        rejected: 0,
        downtime: 0,
      },
      matchesDemoTotals: false,
      error: null,
    },
    allChecksPassed: false,
    issues: [],
  };

  console.group('%c[FactoryPulse V1] Supabase Verification (Phase 3B-1)%c', 'color: #2563eb; font-weight: bold; font-size: 13px;', 'color: inherit;');

  if (!report.configured) {
    report.issues.push('Supabase credentials are placeholder values in src/config/supabase.js. Please provide actual SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.');
    console.warn('⚠️ Supabase not yet configured with actual project URL and Publishable Key.');
    console.info('👉 Update src/config/supabase.js with your project credentials to verify live database tables.');
    console.groupEnd();
    return report;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    report.issues.push('Failed to initialize Supabase client instance.');
    console.error('❌ Supabase client failed to initialize.');
    console.groupEnd();
    return report;
  }

  report.clientInitialized = true;
  console.log('✅ Supabase client initialized successfully.');

  // 1. Verify public.factories
  try {
    const { data: factoriesData, error: factoriesError } = await supabase
      .from('factories')
      .select('*');

    if (factoriesError) {
      report.factories.error = factoriesError.message || factoriesError;
      report.issues.push(`factories query error: ${factoriesError.message || JSON.stringify(factoriesError)}`);
      console.error('❌ Failed to read public.factories:', factoriesError);
    } else {
      report.factories.success = true;
      report.factories.records = factoriesData || [];
      report.factories.count = report.factories.records.length;

      const hasDemoFactory = report.factories.records.some(
        (f) => (f.name && f.name.includes('Pune Precision')) || (f.factory_name && f.factory_name.includes('Pune Precision'))
      );
      report.factories.matchesDemo = hasDemoFactory;

      if (hasDemoFactory) {
        console.log(`✅ public.factories read successful (${report.factories.count} records). Found "Pune Precision Components".`);
      } else {
        report.issues.push('public.factories did not contain "Pune Precision Components".');
        console.warn(`⚠️ public.factories read successful, but "Pune Precision Components" was not found in records:`, report.factories.records);
      }
    }
  } catch (err) {
    report.factories.error = err.message || err;
    report.issues.push(`factories network/exception: ${err.message}`);
    console.error('❌ Exception during public.factories read:', err);
  }

  // 2. Verify public.machines
  try {
    const { data: machinesData, error: machinesError } = await supabase
      .from('machines')
      .select('*')
      .order('id', { ascending: true });

    if (machinesError) {
      report.machines.error = machinesError.message || machinesError;
      report.issues.push(`machines query error: ${machinesError.message || JSON.stringify(machinesError)}`);
      console.error('❌ Failed to read public.machines:', machinesError);
    } else {
      report.machines.success = true;
      report.machines.records = machinesData || [];
      report.machines.count = report.machines.records.length;
      report.machines.matchesDemo = report.machines.count === 10;

      if (report.machines.matchesDemo) {
        console.log(`✅ public.machines read successful: Exactly 10 machines detected (CNC-01 to CNC-10).`);
      } else {
        report.issues.push(`Expected 10 machines in public.machines, found ${report.machines.count}.`);
        console.warn(`⚠️ Expected 10 machines, but public.machines returned ${report.machines.count} records.`);
      }
    }
  } catch (err) {
    report.machines.error = err.message || err;
    report.issues.push(`machines network/exception: ${err.message}`);
    console.error('❌ Exception during public.machines read:', err);
  }

  // 3. Verify public.production_entries
  try {
    const { data: entriesData, error: entriesError } = await supabase
      .from('production_entries')
      .select('*');

    if (entriesError) {
      report.productionEntries.error = entriesError.message || entriesError;
      report.issues.push(`production_entries query error: ${entriesError.message || JSON.stringify(entriesError)}`);
      console.error('❌ Failed to read public.production_entries:', entriesError);
    } else {
      report.productionEntries.success = true;
      report.productionEntries.records = entriesData || [];
      report.productionEntries.count = report.productionEntries.records.length;
      report.productionEntries.matchesDemoCount = report.productionEntries.count === 10;

      // Calculate totals across flexible column naming conventions
      let sumTarget = 0;
      let sumProduced = 0;
      let sumRejected = 0;
      let sumDowntime = 0;

      for (const item of report.productionEntries.records) {
        const target = item.target_qty ?? item.target_quantity ?? item.target ?? item.targetQty ?? 0;
        const produced = item.produced_qty ?? item.produced_quantity ?? item.produced ?? item.producedQty ?? 0;
        const rejected = item.rejected_qty ?? item.rejected_quantity ?? item.rejected ?? item.rejectedQty ?? 0;
        const downtime = item.downtime_minutes ?? item.downtime_mins ?? item.downtime ?? item.downtimeMinutes ?? 0;

        sumTarget += Number(target);
        sumProduced += Number(produced);
        sumRejected += Number(rejected);
        sumDowntime += Number(downtime);
      }

      report.productionEntries.totals = {
        target: sumTarget,
        produced: sumProduced,
        rejected: sumRejected,
        downtime: sumDowntime,
      };

      const targetOk = sumTarget === 5000;
      const producedOk = sumProduced === 4620;
      const rejectedOk = sumRejected === 105;
      const downtimeOk = sumDowntime === 200;

      report.productionEntries.matchesDemoTotals = targetOk && producedOk && rejectedOk && downtimeOk;

      console.log(`✅ public.production_entries read successful (${report.productionEntries.count} records).`);
      console.table([
        { Metric: 'Target Quantity', Expected: 5000, ActualFromSupabase: sumTarget, Match: targetOk ? '✅' : '❌' },
        { Metric: 'Produced Quantity', Expected: 4620, ActualFromSupabase: sumProduced, Match: producedOk ? '✅' : '❌' },
        { Metric: 'Rejected Quantity', Expected: 105, ActualFromSupabase: sumRejected, Match: rejectedOk ? '✅' : '❌' },
        { Metric: 'Downtime (Minutes)', Expected: 200, ActualFromSupabase: sumDowntime, Match: downtimeOk ? '✅' : '❌' },
      ]);

      if (!report.productionEntries.matchesDemoCount) {
        report.issues.push(`Expected 10 production entries, found ${report.productionEntries.count}.`);
      }
      if (!report.productionEntries.matchesDemoTotals) {
        report.issues.push(`Totals mismatch: Expected (T:5000, P:4620, R:105, D:200), got (T:${sumTarget}, P:${sumProduced}, R:${sumRejected}, D:${sumDowntime}).`);
      }
    }
  } catch (err) {
    report.productionEntries.error = err.message || err;
    report.issues.push(`production_entries network/exception: ${err.message}`);
    console.error('❌ Exception during public.production_entries read:', err);
  }

  // Summary evaluation
  report.allChecksPassed =
    report.clientInitialized &&
    report.factories.success &&
    report.factories.matchesDemo &&
    report.machines.success &&
    report.machines.matchesDemo &&
    report.productionEntries.success &&
    report.productionEntries.matchesDemoCount &&
    report.productionEntries.matchesDemoTotals;

  if (report.allChecksPassed) {
    console.log('%c🎉 All Supabase Phase 3B-1 verification checks passed! Database is ready for Phase 3B-2.', 'color: #16a34a; font-weight: bold;');
  } else {
    console.warn('%c⚠️ Supabase verification completed with warnings/issues. Review report details.', 'color: #d97706; font-weight: bold;', report);
  }

  console.groupEnd();
  return report;
}
