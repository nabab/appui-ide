// Javascript Document

(() => {
  return {
    methods: {
      renderUrl(data) {
        return '<a href="'+ data.url + '" title="Commit ' + data.id + '">' + data.short_id + '</a>';
      },
      renderProject(data) {
        return '<a href="'+ data.project_url + '" title="Project ID ' + data.id_project + '">' + data.project + '</a>';
      }
    }
  }
})();