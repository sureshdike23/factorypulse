/**
 * FactoryPulse V1 - Central Reactive State Store
 * Supports live Supabase data hydration (Phase 3B-3)
 */
import { INITIAL_PRODUCTION_RECORDS, FACTORY_INFO, MACHINES } from './data/demoData.js';

class StateStore {
  constructor() {
    this.state = {
      activeTab: 'history', // 'dashboard' | 'entry' | 'history' | 'machines' | 'more'
      searchQuery: '',
      selectedDate: '2026-09-05',
      selectedShift: 'All',
      selectedMachine: 'All',
      selectedStatus: 'All',
      factory: { ...FACTORY_INFO },
      machines: [...MACHINES],
      records: [...INITIAL_PRODUCTION_RECORDS],
      isLoading: false,
      loadError: null,
      isLiveConnected: false,
      toast: {
        visible: false,
        title: '',
        desc: '',
      },
      // Phase 4F: Authentication & Role-Based Routing
      session: null,
      user: null,
      profile: null,
      role: null, // 'OWNER' | 'SUPERVISOR'
      factoryId: null,
      authChecked: false,
      authError: null,
    };
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  setActiveTab(tab) {
    this.setState({ activeTab: tab });
  }

  setLiveState({ factory, machines, records }) {
    this.setState({
      factory: factory || this.state.factory,
      machines: machines || this.state.machines,
      records: records || this.state.records,
      isLoading: false,
      loadError: null,
      isLiveConnected: true,
    });
  }

  setLoading(isLoading) {
    this.setState({ isLoading });
  }

  setLoadError(loadError) {
    this.setState({ isLoading: false, loadError });
  }

  addRecord(record) {
    this.setState({
      records: [record, ...this.state.records],
    });
  }

  setSearchQuery(query) {
    this.setState({ searchQuery: query });
  }

  showToast(title, desc) {
    this.setState({
      toast: { visible: true, title, desc },
    });
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.setState({
        toast: { visible: false, title: '', desc: '' },
      });
    }, 3000);
  }

  hideToast() {
    this.setState({
      toast: { visible: false, title: '', desc: '' },
    });
  }

  setAuth({ session, user, profile, role, factoryId }) {
    this.setState({
      session,
      user,
      profile,
      role: role ? role.toUpperCase() : null,
      factoryId: factoryId || null,
      authChecked: true,
      authError: null,
    });
  }

  clearAuth() {
    this.setState({
      session: null,
      user: null,
      profile: null,
      role: null,
      factoryId: null,
      authChecked: true,
      authError: null,
      records: [],
      machines: [],
      isLiveConnected: false,
    });
  }

  setAuthError(authError) {
    this.setState({ authError, isLoading: false });
  }
}

export const store = new StateStore();
