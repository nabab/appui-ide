<!-- HTML Document -->

<div class="bbn-overlay bbn-padding bbn-margin bbn-alt-background">
  <h1 class="bbn-navy">Profiling settings.</h1>
  <div class="bbn-padding bbn-margin">
    <h3>Actual profiling</h3>
    <bbn-input v-model="source.profiling"
               @keydown.enter="post_profiling"
               placeholder="<?= _("Profiling") ?>"></bbn-input>
  </div>
  <h1 class="bbn-navy">Tideways XHProf Extension</h1>
  <div class="bbn-padding bbn-w-70">
    <h2>Data-Format</h2>
    <p>
      The XHProf data format records performance data for each parent => child function call that was made between the calls to tideways_xhprof_enable and tideways_xhprof_disable. It is formatted as an array with the parent and child function names as a key concatenated with ==> and an array value with 2 to 5 entries:
    </p>
    <ul>
      <li>wt: The summary wall time of all calls of (parent ==> child) pair.</li>
      <li>ct: The number of calls between (parent ==> child) pair.</li>
      <li>cpu: The cpu cycle time of all calls of (parent ==> child) pair.</li>
      <li>mu: The sum of increase in memory_get_usage for (parent ==> child) pair.</li>
      <li>pmu: The sum of increase in memory_get_peak_usage for (parent ==> child) pair.</li>
    </ul>
    <p>
      When TIDEWAYS_XHPROF_FLAGS_MEMORY_ALLOC flag is set, the following additional values are set:
    </p>
    <ul>
      <li>mem.na: The sum of the number of all allocations in this function.</li>
      <li>mem.nf The sum of the number of all frees in this function.</li>
      <li>mem.aa The amount of allocated memory.</li>
    </ul>
    <p>
      If TIDEWAYS_XHPROF_FLAGS_MEMORY_ALLOC_AS_MU is set, TIDEWAYS_XHPROF_FLAGS_MEMORY_ALLOC is activated and, if TIDEWAYS_XHPROF_FLAGS_MEMORY_MU is not set, mem.aa is additionally returned in mu.

There is a "magic" function call called "main()" that represents the entry into the profiling. The wall time on this performance data describes the full timeframe that the profiling ran.
    </p>
  </div>
</div>

